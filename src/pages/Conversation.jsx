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
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

function Conversation() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverInfo, setReceiverInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);
      setReceiverInfo(userSnap.exists() ? userSnap.data() : {});
    };

    const fetchMessages = async () => {
      const q = query(
        collection(db, "messages"),
        where("participants", "array-contains", currentUser.uid),
        orderBy("timestamp")
      );
      const snapshot = await getDocs(q);
      const msgs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (msg) =>
            (msg.senderId === currentUser.uid && msg.receiverId === userId) ||
            (msg.senderId === userId && msg.receiverId === currentUser.uid)
        );
      setMessages(msgs);
    };

    fetchUserInfo();
    fetchMessages();
  }, [currentUser, userId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      senderId: currentUser.uid,
      receiverId: userId,
      participants: [currentUser.uid, userId],
      message: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");

    // Re-fetch messages after sending
    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("timestamp")
    );
    const snapshot = await getDocs(q);
    const msgs = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(
        (msg) =>
          (msg.senderId === currentUser.uid && msg.receiverId === userId) ||
          (msg.senderId === userId && msg.receiverId === currentUser.uid)
      );
    setMessages(msgs);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={
            receiverInfo?.photoURL ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(receiverInfo?.displayName || "User")
          }
          alt="User"
          className="w-12 h-12 rounded-full object-cover"
        />
        <h2 className="text-xl font-bold">
          {receiverInfo?.displayName || "User"}
        </h2>
      </div>

      <div className="space-y-3 mb-4 max-h-[50vh] overflow-y-auto border p-4 rounded-lg bg-white shadow-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === currentUser.uid ? "justify-end" : "justify-start"
            }`}
          >
            <p
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.senderId === currentUser.uid
                  ? "bg-[#A9FF3A] text-gray-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-lg text-sm"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-[#2E2E3A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#1c1c26]"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Conversation;
