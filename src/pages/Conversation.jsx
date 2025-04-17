// ✅ src/pages/Conversation.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

function Conversation() {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchConversation = async () => {
      const q = query(
        collection(db, "messages"),
        where("participants", "array-contains", currentUser.uid),
        orderBy("timestamp")
      );
      const snapshot = await getDocs(q);
      const filtered = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (msg) =>
            (msg.senderId === currentUser.uid && msg.receiverId === userId) ||
            (msg.senderId === userId && msg.receiverId === currentUser.uid)
        );
      setMessages(filtered);
    };

    fetchConversation();
  }, [userId, currentUser.uid]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      senderId: currentUser.uid,
      receiverId: userId,
      message: newMessage,
      timestamp: serverTimestamp(),
      participants: [currentUser.uid, userId],
    });

    setNewMessage("");
    // Optional: re-fetch messages or use onSnapshot for real-time
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Conversation</h2>
      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.senderId === currentUser.uid ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <p
              style={{
                display: "inline-block",
                backgroundColor: msg.senderId === currentUser.uid ? "#dcf8c6" : "#f1f0f0",
                padding: "8px 12px",
                borderRadius: "10px",
              }}
            >
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Conversation;
