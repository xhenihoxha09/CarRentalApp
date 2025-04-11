import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

function AllCars() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const carsCollection = collection(db, "cars");
      const carSnapshot = await getDocs(carsCollection);
      const carList = carSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCars(carList);
    };
    fetchCars();
  }, []);

  return (
    <div>
      <h2>Available Cars for Rent</h2>
      {cars.map((car) => (
        <div key={car.id}>
          <h3>{car.name} - {car.model}</h3>
          <img src={car.imageUrl} alt={car.name} style={{ width: "200px", height: "150px" }} />
          <p>Owner: {car.ownerEmail || "Unknown User"}</p>
        </div>
      ))}
    </div>
  );
}

export default AllCars;
