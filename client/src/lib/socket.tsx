import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";

interface WebSocketContextType {
  messages: any[];
  connectWebSocket: (id: string) => void;
  removeReadMessage: (id: string) => any[];
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback((id: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected.");
      return;
    }

    if (!id) {
      console.error("Organization ID is required to connect to WebSocket.");
      return;
    }

    const url = `ws://localhost:8080/ws/${id}`;
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log(`WebSocket connected to organization: ${id}`);
    };

    wsRef.current.onmessage = (event: MessageEvent) => {
      console.log("Received message:", event.data);
      try {
        const parsedMessage = JSON.parse(event.data as string);
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...parsedMessage, id: uuidv4() },
        ]);
      } catch (e) {
        console.error(
          "Failed to parse WebSocket message as JSON:",
          e,
          event.data
        );
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected.");
    };

    wsRef.current.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const removeReadMessage = (id: string) => {
    return messages.filter((message) => message?.id !== id);
  };

  const value: WebSocketContextType = {
    messages,
    connectWebSocket,
    removeReadMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === null) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
