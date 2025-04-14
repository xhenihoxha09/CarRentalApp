import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

function Messages() {
  const { currentUser } = useAuth();
  console.log("Logged in user ID:", currentUser?.uid);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, "messages"),
          where("receiverId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        console.log("Docs found:", snapshot.size);
        if (snapshot.empty) {
          console.log("No messages found for this user.");
          return;
        }
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentUser]);

  return (
    <div>
      <h2>Inbox</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {messages.map((msg) => (
            <li
              key={msg.id}
              style={{
                listStyle: "none",
                borderBottom: "1px solid #ccc",
                marginBottom: "10px",
                paddingBottom: "10px",
              }}
            >
              <p>
                <strong>From:</strong> {msg.senderId}
              </p>
              <p>
                <strong>Car ID:</strong> {msg.carId}
              </p>
              <p>
                <strong>Message:</strong> {msg.message}
              </p>
              <p style={{ fontSize: "12px", color: "gray" }}>
                {msg.timestamp?.toDate().toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Messages;
