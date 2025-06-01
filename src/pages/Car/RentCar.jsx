import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function RentCar() {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const snapshot = await getDocs(collection(db, "cars"));
        const carList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(carList);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Available Cars
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transition"
          >
            <img
              src={car.imageUrl}
              alt={car.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {car.name}
              </h3>
              <p className="text-sm text-gray-500">{car.model}</p>
              <p className="text-sm text-gray-700">
                <strong>Location:</strong> {car.location}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Price:</strong> €{car.price} / day
              </p>
              <p className="text-xs text-gray-500 line-clamp-2">
                {car.description}
              </p>
              <button
                onClick={() => navigate(`/book/${car.id}`)}
                className="mt-2 w-full py-2 bg-[#A9FF3A] text-[#2E2E3A] font-bold rounded-md hover:bg-[#90e62e]"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RentCar;
