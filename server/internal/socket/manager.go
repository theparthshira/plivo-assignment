package socket

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// Manager maintains the set of active clients and broadcasts messages to the
// clients.
type Manager struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients. (Not directly used for server-to-client events, but good to have)
	Broadcast chan []byte

	// Register requests from the clients.
	Register chan *Client

	// Unregister requests from clients.
	Unregister chan *Client

	// Rooms: map OrgID to a slice of clients in that organization
	Rooms map[string]map[*Client]bool
	mu    sync.RWMutex // Mutex to protect access to the Rooms map
}

func NewManager() *Manager {
	return &Manager{
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
		Rooms:      make(map[string]map[*Client]bool),
	}
}

func (m *Manager) Run() {
	for {
		select {
		case client := <-m.Register:
			m.mu.Lock()
			m.clients[client] = true
			if _, ok := m.Rooms[client.OrgID]; !ok {
				m.Rooms[client.OrgID] = make(map[*Client]bool)
			}
			m.Rooms[client.OrgID][client] = true
			m.mu.Unlock()
			log.Printf("Client registered. OrgID: %s, Total clients in room: %d\n", client.OrgID, len(m.Rooms[client.OrgID]))

		case client := <-m.Unregister:
			m.mu.Lock()
			if _, ok := m.clients[client]; ok {
				delete(m.clients, client)
				if m.Rooms[client.OrgID] != nil {
					delete(m.Rooms[client.OrgID], client)
					if len(m.Rooms[client.OrgID]) == 0 {
						delete(m.Rooms, client.OrgID) // Clean up empty room
					}
				}
				close(client.Send)
			}
			m.mu.Unlock()
			log.Printf("Client unregistered. OrgID: %s\n", client.OrgID)

		case message := <-m.Broadcast:
			// This is for broadcasting to all clients (if needed)
			m.mu.RLock()
			for client := range m.clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(m.clients, client)
					// Handle unregistration for all clients here if not handled by client's readPump
				}
			}
			m.mu.RUnlock()
		}
	}
}

// SendEventToOrg sends an event message to all clients in a specific organization's room.
func (m *Manager) SendEventToOrg(orgID string, event []byte) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	if clients, ok := m.Rooms[orgID]; ok {
		log.Printf("Sending event to %d clients in organization %s\n", len(clients), orgID)
		for client := range clients {
			select {
			case client.Send <- event:
			default:
				// If sending fails, close the client's send channel and unregister
				close(client.Send)
				delete(m.clients, client) // Remove from overall clients map
				if m.Rooms[orgID] != nil {
					delete(m.Rooms[orgID], client) // Remove from specific room
				}
				log.Printf("Failed to send event to client, unregistering: OrgID: %s\n", orgID)
			}
		}
	} else {
		log.Printf("No clients found for organization: %s\n", orgID)
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// IMPORTANT: In a production environment, you should restrict this
		// to your allowed origins. For development, true allows all.
		return true
	},
}

// ServeWs handles websocket requests from the peer.
func (m *Manager) ServeWs(w http.ResponseWriter, r *http.Request, orgID string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{Manager: m, Conn: conn, Send: make(chan []byte, 256), OrgID: orgID}
	client.Manager.Register <- client

	// Allow collection of old messages if client doesn't read fast enough.
	go client.writePump()
	go client.readPump()
}
