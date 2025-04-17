import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

function Messages() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, "messages"),
          where("receiverId", "==", currentUser.uid),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const grouped = {};
        for (const msg of msgs) {
          if (!grouped[msg.senderId]) {
            const userDoc = await getDoc(doc(db, "users", msg.senderId));
            const userData = userDoc.exists() ? userDoc.data() : {};

            console.log("Fetched user for inbox:", userData);

            grouped[msg.senderId] = {
              ...msg,
              senderName:
                userData.displayName ||
                userData.name ||
                userData.email ||
                msg.senderId,
              senderPhoto:
                userData.photoURL && userData.photoURL !== "null"
                  ? userData.photoURL
                  : null,
            };
          }
        }

        setConversations(Object.values(grouped));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentUser]);

  return (
    <div>
      <h2>Inbox</h2>
      {conversations.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {conversations.map((msg) => (
            <li
              key={msg.id}
              style={{
                listStyle: "none",
                borderBottom: "1px solid #ccc",
                marginBottom: "10px",
                paddingBottom: "10px",
              }}
            >
              <Link
                to={`/messages/${msg.senderId}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {msg.senderPhoto ? (
                    <img
                      src={msg.senderPhoto}
                      alt="User"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "#ccc",
                      }}
                    />
                  )}
                  <div>
                    <strong>From:</strong> {msg.senderName}
                    <div>
                      <strong>Latest:</strong>{" "}
                      {msg.message.length > 50
                        ? msg.message.slice(0, 50) + "..."
                        : msg.message}
                    </div>
                    <div style={{ fontSize: "12px", color: "gray" }}>
                      {msg.timestamp?.toDate().toLocaleString()}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Messages;
