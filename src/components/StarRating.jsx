import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function StarRating({ carId }) {
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const q = query(collection(db, "reviews"), where("carId", "==", carId));
        const snapshot = await getDocs(q);
        const ratings = snapshot.docs.map((doc) => doc.data().rating);

        if (ratings.length > 0) {
          const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          setAverageRating(avg);
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchRating();
  }, [carId]);

  if (averageRating === null) return null;

  const rounded = Math.round(averageRating);

  return (
    <div>
      {[1, 2, 3, 4, 5].map((num) => (
        <span
          key={num}
          style={{
            color: num <= rounded ? "gold" : "lightgray",
            fontSize: "18px",
          }}
        >
          ★
        </span>
      ))}
      <span style={{ marginLeft: "5px" }}>({averageRating.toFixed(1)})</span>
    </div>
  );
}

export default StarRating;
