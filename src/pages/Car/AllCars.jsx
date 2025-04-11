import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
          <h3>
            {car.name} - {car.model}
          </h3>
          <img
            src={car.imageUrl}
            alt={car.name}
            style={{ width: "200px", height: "150px" }}
          />
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
          <button onClick={() => navigate(`/book/${car.id}`)}>Book Now</button>
        </div>
      ))}
    </div>
  );
}

export default AllCars;
