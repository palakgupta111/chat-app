const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5000;

// ✅ Add a welcome route for GET /
app.get("/", (req, res) => {
  res.send("✅ Real-time Chat Server is running!");
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

let messageHistory = [];

wss.on("connection", (ws) => {
  console.log("New client connected");

  // Send chat history to new user
  ws.send(JSON.stringify({ type: "history", data: messageHistory }));

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === "message") {
      const chatMessage = {
        id: Date.now(),
        text: parsedMessage.text,
        sender: parsedMessage.sender,
        time: new Date().toLocaleTimeString(),
      };

      // Save message to history
      messageHistory.push(chatMessage);

      // Send to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "message", data: chatMessage }));
        }
      });
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});
