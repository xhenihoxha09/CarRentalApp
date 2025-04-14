import React, { useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function MessageForm({ carOwnerId, carId }) {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        senderId: currentUser.uid,
        receiverId: carOwnerId,
        carId,
        message,
        timestamp: Timestamp.now(),
      });
      setMessage("");
      setStatus("Message sent!");
    } catch (err) {
      console.error("Failed to send message:", err);
      setStatus("Failed to send message.");
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Send Message to Owner</h3>
      {status && <p>{status}</p>}
      <form onSubmit={handleSend}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows={3}
          style={{ width: "100%" }}
        />
        <button type="submit" style={{ marginTop: "10px" }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default MessageForm;
