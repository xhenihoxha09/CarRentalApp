import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Messages() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, "messages"),
        where("participants", "array-contains", currentUser.uid)
      );

      const snapshot = await getDocs(q);
      const allMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Show only 1 message per other user (latest)
      const latestByUser = {};
      for (let msg of allMessages.reverse()) {
        const otherUserId =
          msg.senderId === currentUser.uid ? msg.receiverId : msg.senderId;
        if (!latestByUser[otherUserId]) {
          latestByUser[otherUserId] = msg;
        }
      }

      const conversationsArray = [];

      for (let otherUserId in latestByUser) {
        const msg = latestByUser[otherUserId];

        // ✅ Use document ID to fetch user
        const userRef = doc(db, "users", otherUserId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        conversationsArray.push({
          id: msg.id,
          userId: otherUserId,
          text: msg.message,
          name: userData.displayName || "User",
          photoURL:
            userData.photoURL ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(userData.displayName || "User"),
        });
      }

      setConversations(conversationsArray);
    };

    fetchConversations();
  }, [currentUser]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Inbox</h2>
      {conversations.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {conversations.map((c) => (
            <div
              key={c.id}
              className="flex items-center bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/conversation/${c.userId}`)}
            >
              <img
                src={c.photoURL}
                alt={c.name}
                className="w-10 h-10 rounded-full object-cover mr-4"
              />
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-gray-600 text-sm truncate">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Messages;
