package pkg

import (
	"fmt"
	"net/smtp"
	"os"

	"github.com/joho/godotenv"
)

func Send(to_email, subject, body string) bool {
	fmt.Println("smpt called: ", to_email, subject, body)
	godotenv.Load()

	host := os.Getenv("SMTP_HOST")
	username := os.Getenv("SMTP_USERNAME")
	password := os.Getenv("SMTP_PASSWORD")
	port := os.Getenv("SMTP_PORT")

	connection := smtp.PlainAuth("", username, password, host)

	to := []string{to_email}
	to_string := "To: " + to_email + "\n"
	formatted_subject := "Subject: " + subject + "\n"
	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	msg := []byte(to_string + formatted_subject + mime + body)

	err := smtp.SendMail(host+":"+port, connection, username, to, msg)

	fmt.Println("smpt err", err)

	if err != nil {
		fmt.Println("error", err)
		return true
	}

	return false
}
