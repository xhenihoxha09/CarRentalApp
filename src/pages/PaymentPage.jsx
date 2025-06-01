import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { differenceInDays } from "date-fns";

export default function PaymentPage() {
  const { id } = useParams();
  const { state } = useLocation(); // contains startDate and endDate
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const startDate = new Date(state?.startDate);
  const endDate = new Date(state?.endDate);

  useEffect(() => {
    const fetchCar = async () => {
      const carRef = doc(db, "cars", id);
      const carSnap = await getDoc(carRef);
      if (carSnap.exists()) {
        setCar({ id: carSnap.id, ...carSnap.data() });
      }
      setLoading(false);
    };
    fetchCar();
  }, [id]);

  const days = differenceInDays(endDate, startDate) || 1;
  const total = car ? car.price * days : 0;

  const handleConfirmBooking = async () => {
    try {
      await addDoc(collection(db, "bookings"), {
        carId: car.id,
        carName: car.name,
        ownerId: car.ownerId,
        renterId: currentUser.uid,
        renterEmail: currentUser.email,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        pricePerDay: car.price,
        total,
        createdAt: new Date().toISOString(),
      });

      alert("Booking successful!");
      navigate("/profile"); // or wherever you want to redirect after
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Try again.");
    }
  };

  if (loading) return <div className="p-6">Loading car details...</div>;
  if (!car) return <div className="p-6 text-red-500">Car not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-[#2E2E3A] mb-6">Confirm & Pay</h2>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <img
            src={car.imageUrl}
            alt={car.name}
            className="w-full sm:w-48 h-32 object-cover rounded-md"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-[#2E2E3A]">
              {car.name} — {car.model}
            </h3>
            <p className="text-sm text-gray-500">Location: {car.location}</p>
            <p className="text-sm text-gray-500">€{car.price} / day</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
          <p>
            <strong>Check-in:</strong> {startDate.toLocaleDateString()}
          </p>
          <p>
            <strong>Check-out:</strong> {endDate.toLocaleDateString()}
          </p>
          <p>
            <strong>Days:</strong> {days}
          </p>
          <p className="text-lg font-bold text-[#2E2E3A]">
            Total: €{total.toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleConfirmBooking}
          className="w-full mt-4 bg-[#A9FF3A] text-[#2E2E3A] font-bold py-3 rounded-md hover:opacity-90 transition"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}
