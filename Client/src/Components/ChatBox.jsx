import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const ChatBox = ({ roomId, username }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Join the room when the component mounts
    socket.emit("joinRoom", { roomCode: roomId });

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      console.log("New message received:", data); // Debugging log
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim()) {
      const chatMessage = { roomCode: roomId, username, message }; // Use "roomCode"
      socket.emit("sendMessage", chatMessage);
      setMessages((prev) => [...prev, chatMessage]);
      setMessage("");
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <p key={index} style={styles.message}>
            <strong>{msg.username}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    position: "absolute",
    right: "10px",
    top: "100px",
    width: "300px",
    height: "400px",
    backgroundColor: "#1e1e1e",
    color: "white",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  chatBox: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
  },
  message: {
    margin: "5px 0",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid gray",
  },
  input: {
    flex: 1,
    padding: "5px",
    borderRadius: "5px",
  },
  sendButton: {
    marginLeft: "5px",
    padding: "5px 10px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default ChatBox;
