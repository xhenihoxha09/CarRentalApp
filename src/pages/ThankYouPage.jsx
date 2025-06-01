// ✅ src/pages/ThankYouPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-[#2E2E3A] mb-4">Thank You! </h1>
        <p className="text-gray-600 mb-6">
          Your booking was successful. We’ve saved your reservation and sent you
          a confirmation.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#2E2E3A] text-white px-6 py-2 rounded hover:bg-[#1c1c26] transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
