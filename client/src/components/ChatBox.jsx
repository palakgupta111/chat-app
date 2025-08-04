import React, { useState, useEffect, useRef } from "react";
import "./ChatBox.css";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const ws = useRef(null);

  const params = new URLSearchParams(window.location.search);
  const sender = params.get("name") || "Anonymous";

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:5000");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "history") {
        setMessages(data.data);
      } else if (data.type === "message") {
        setMessages((prev) => [...prev, data.data]);
      }
    };

    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (text.trim()) {
      ws.current.send(JSON.stringify({ type: "message", text, sender }));
      setText("");
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Real-time Chat</h1>
      </header>

      <main className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${
              msg.sender === sender ? "sent" : "received"
            }`}
          >
            <p className="message-text">{msg.text}</p>
            <span className="message-meta">
              {msg.sender} • {msg.time}
            </span>
          </div>
        ))}
      </main>

      <footer className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </footer>
    </div>
  );
}
