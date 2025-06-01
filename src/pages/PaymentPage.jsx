// ✅ src/pages/PaymentPage.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function PaymentPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { carId } = useParams(); // e.g. /payment/carId123
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCVC] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name || !cardNumber || !expiry || !cvc) {
      setErrorMsg("Please fill in all payment fields.");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        carId,
        userId: currentUser.uid,
        status: "booked",
        paymentInfo: {
          name,
          cardNumber,
          expiry,
          cvc,
        },
        timestamp: serverTimestamp(),
      });

      setSuccessMsg("Payment successful! Your car has been booked.");

      // Optional: wait a second then navigate
      setTimeout(() => {
        navigate("/thank-you");
      }, 1500);
    } catch (err) {
      setErrorMsg("Failed to complete booking: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Checkout</h2>

        {errorMsg && <p className="text-red-500 mb-3">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 mb-3">{successMsg}</p>}

        <form onSubmit={handlePayment} className="space-y-4">
          <input
            type="text"
            placeholder="Name on card"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Card number"
            maxLength={19}
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(
                e.target.value
                  .replace(/\D/g, "")
                  .replace(/(.{4})/g, "$1 ")
                  .trim()
              )
            }
            className="w-full border px-4 py-2 rounded text-sm"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-1/2 border px-4 py-2 rounded text-sm"
            />
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              maxLength={4}
              onChange={(e) => setCVC(e.target.value.replace(/\D/g, ""))}
              className="w-1/2 border px-4 py-2 rounded text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#2E2E3A] text-white py-2 rounded hover:bg-[#1c1c26] text-sm"
          >
            Confirm Payment & Book
          </button>
        </form>
      </div>
    </div>
  );
}
