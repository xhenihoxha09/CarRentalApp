import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      const carDoc = await getDoc(doc(db, "cars", id));
      if (carDoc.exists()) {
        setCar({ id: carDoc.id, ...carDoc.data() });
      }
    };
    fetchCar();
  }, [id]);

  const checkOverlap = (start1, end1, start2, end2) => {
    return (
      (start1 <= end2 && start1 >= start2) ||
      (end1 <= end2 && end1 >= start2) ||
      (start1 <= start2 && end1 >= end2)
    );
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage("");

    const q = query(collection(db, "bookings"), where("carId", "==", car.id));
    const snapshot = await getDocs(q);

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    for (const docSnap of snapshot.docs) {
      const b = docSnap.data();
      const bookedStart = new Date(b.startDate);
      const bookedEnd = new Date(b.endDate);
      if (checkOverlap(newStart, newEnd, bookedStart, bookedEnd)) {
        setMessage("This car is already booked for the selected dates.");
        return;
      }
    }

    try {
      await addDoc(collection(db, "bookings"), {
        carId: car.id,
        renterId: currentUser.uid,
        renterEmail: currentUser.email,
        startDate,
        endDate,
        createdAt: new Date(),
      });
      setMessage("Booking confirmed!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMessage("Booking failed: " + error.message);
    }
  };

  if (!car) return <p>Loading car...</p>;

  return (
    <div>
      <h2>
        Book {car.name} - {car.model}
      </h2>
      {message && <p>{message}</p>}

      <img src={car.imageUrl} alt={car.name} style={{ width: "250px" }} />
      <p>
        <strong>Price:</strong> €{car.price}/day
      </p>
      <p>
        <strong>Location:</strong> {car.location}
      </p>

      <form onSubmit={handleBooking}>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
}

export default Booking;
