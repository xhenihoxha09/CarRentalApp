import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import StarRating from "../../components/StarRating";

function AllCars() {
  const location = useLocation();
  const { search } = location;
  const params = new URLSearchParams(search);

  const city = params.get("location");
  const model = params.get("model");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        let carsQuery = collection(db, "cars");

        // You can optionally build filters here based on query params
        if (city || model) {
          const filters = [];
          if (city) filters.push(where("location", "==", city));
          if (model) filters.push(where("model", "==", model));
          carsQuery = query(carsQuery, ...filters);
        }

        const snapshot = await getDocs(carsQuery);
        const carList = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const avgRating = await fetchAverageRating(doc.id);
            return {
              id: doc.id,
              ...data,
              avgRating,
            };
          })
        );
        setCars(carList);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    };

    const fetchAverageRating = async (carId) => {
      const q = query(collection(db, "reviews"), where("carId", "==", carId));
      const snapshot = await getDocs(q);
      const ratings = snapshot.docs.map((doc) => doc.data().rating);
      const avg =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
      return avg;
    };

    fetchCars();
  }, [city, model, startDate, endDate]);

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Available Cars for Rent
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white border rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <Link to={`/cars/${car.id}`}>
              <img
                src={car.imageUrl}
                alt={car.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">
                {car.name} - {car.model}
              </h3>
            </Link>
            <p>
              <strong>Price:</strong> €{car.price} / day
            </p>
            <p>
              <strong>Location:</strong> {car.location}
            </p>
            <p>
              <strong>Description:</strong> {car.description}
            </p>
            <p className="italic text-sm text-gray-500">
              Listed by: {car.ownerEmail}
            </p>
            <StarRating carId={car.id} />
            <div className="flex justify-between mt-4">
              <Link
                to={`/cars/${car.id}`}
                className="text-blue-500 hover:underline text-sm"
              >
                View Details
              </Link>
              <button
                className="px-4 py-2 rounded-md bg-[#A9FF3A] text-[#2E2E3A] font-semibold shadow-sm hover:bg-[#bfff5a]"
                onClick={() => navigate(`/cars/${car.id}`)}
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

export default AllCars;
