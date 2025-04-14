import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

function ReviewList({ carId }) {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(collection(db, "reviews"), where("carId", "==", carId));
      const snapshot = await getDocs(q);
      const reviewList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewList);
    };

    fetchReviews();
  }, [carId]);

  if (reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Reviews</h3>
      {reviews.map((review) => (
        <div
          key={review.id}
          style={{
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
            marginBottom: "15px",
          }}
        >
          <div>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                style={{ color: num <= review.rating ? "gold" : "lightgray" }}
              >
                ★
              </span>
            ))}
          </div>
          <p>
            <strong>
              {review.userId === currentUser.uid ? "You" : review.userEmail}
            </strong>
          </p>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
