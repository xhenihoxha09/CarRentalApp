import React, { useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function ReviewForm({ carId, onReviewSubmitted }) {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      setMessage("Please provide a rating and comment.");
      return;
    }

    try {
      await addDoc(collection(db, "reviews"), {
        carId,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        rating,
        comment,
        createdAt: Timestamp.now(),
      });
      setMessage("Review submitted successfully!");
      setRating(0);
      setComment("");
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      setMessage("Failed to submit review: " + error.message);
    }
  };

  return (
    <div
      style={{ border: "1px solid #ddd", padding: "15px", marginTop: "20px" }}
    >
      <h3>Leave a Review</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating: </label>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              style={{
                cursor: "pointer",
                color: num <= rating ? "gold" : "gray",
                fontSize: "24px",
              }}
              onClick={() => setRating(num)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          rows={4}
          style={{ width: "100%", marginTop: "10px" }}
        />
        <button type="submit" style={{ marginTop: "10px" }}>
          Submit Review
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
