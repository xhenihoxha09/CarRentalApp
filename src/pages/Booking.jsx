import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [startDate, endDate] = selectedDates;
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      const carDoc = await getDoc(doc(db, "cars", id));
      if (carDoc.exists()) {
        setCar({ id: carDoc.id, ...carDoc.data() });
      }
    };
    fetchCar();
    const fetchBookedDates = async () => {
      const q = query(collection(db, "bookings"), where("carId", "==", id));
      const snapshot = await getDocs(q);

      const dates = [];
      snapshot.forEach((docSnap) => {
        const { startDate, endDate } = docSnap.data();
        const start = startDate.toDate
          ? startDate.toDate()
          : new Date(startDate);
        const end = endDate.toDate ? endDate.toDate() : new Date(endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
      });

      setBookedDates(dates);
    };
    fetchBookedDates();
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
      const bookedStart = b.startDate.toDate
        ? b.startDate.toDate()
        : new Date(b.startDate);
      const bookedEnd = b.endDate.toDate
        ? b.endDate.toDate()
        : new Date(b.endDate);
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
        startDate: new Date(startDate),
        endDate: new Date(endDate),
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
        <div style={{ marginBottom: "20px" }}>
          <label>Select your rental dates:</label>
          <DatePicker
            selected={startDate}
            onChange={(dates) => setSelectedDates(dates)}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            excludeDates={bookedDates}
            dayClassName={(date) =>
              bookedDates.some((d) => d.toDateString() === date.toDateString())
                ? "booked-date"
                : undefined
            }
          />
        </div>

        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
}

<style>{`
  .booked-date {
    background-color: #ffcccc !important;
    color: red !important;
    pointer-events: none;
  }
`}</style>;

export default Booking;
