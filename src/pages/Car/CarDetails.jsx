import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StarRating from "../../components/StarRating";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const docRef = doc(db, "cars", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCar({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Failed to fetch car:", err);
      }
    };
    fetchCar();
  }, [id]);

  const handleBook = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    navigate(`/payment/${car.id}`, {
      state: {
        startDate,
        endDate,
      },
    });
  };

  if (!car) return <p className="text-center mt-10">Loading car...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8 bg-white shadow-xl rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Car Image */}
        <img
          src={car.imageUrl}
          alt={car.name}
          className="w-full h-64 object-cover rounded-lg"
        />

        {/* Car Info */}
        <div>
          <h2 className="text-2xl font-bold text-[#2E2E3A] mb-2">
            {car.name} - {car.model}
          </h2>
          <p className="text-lg text-[#2E2E3A] mb-1">
            <strong>€{car.price}</strong> / day
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Location:</strong> {car.location}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Listed by:</strong> {car.ownerEmail}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Description:</strong> {car.description}
          </p>
          <StarRating carId={car.id} />

          {/* Date Picker (Optional) */}
          <div className="flex gap-4 my-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Check-in"
              className="w-full px-4 py-2 border rounded-md"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Check-out"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Book Button */}
          <button
            onClick={handleBook}
            className="bg-[#A9FF3A] text-[#2E2E3A] py-2 px-6 rounded-md font-semibold w-full hover:brightness-90 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
