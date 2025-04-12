import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import StarRating from "../../components/StarRating";

function AllCars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const snapshot = await getDocs(collection(db, "cars"));
      const carList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCars(carList);
    };

    fetchCars();
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
  }, []);
  const navigate = useNavigate();

  return (
    <div>
      <h2>Available Cars for Rent</h2>
      {cars.length === 0 && <p>No cars listed yet.</p>}

      {cars.map((car) => (
        <div
          key={car.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <Link to={`/cars/${car.id}`}>
            <img src={car.imageUrl} alt={car.name} width="200" />
            <h3>
              {car.name}- {car.model}
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
          <p>
            <em>Listed by: {car.ownerEmail}</em>
          </p>
          <StarRating carId={car.id} />
          <Link to={`/cars/${car.id}`}>View Details</Link>
          <button onClick={() => navigate(`/book/${car.id}`)}>Book Now</button>
        </div>
      ))}
    </div>
  );
}

export default AllCars;
