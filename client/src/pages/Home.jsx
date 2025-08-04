import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const enterChat = () => {
    if (name.trim()) {
      navigate(`/chat?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="home-container">
      <div className="home-box">
        <h1 className="app-title">Textly</h1>
        <p className="tagline">Connect. Chat. Share.</p>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={enterChat}>Join Chat</button>
      </div>
    </div>
  );
}
