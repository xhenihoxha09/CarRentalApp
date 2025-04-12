import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ReviewForm from "../../components/ReviewForm";

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      const docRef = doc(db, "cars", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCar({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchCar();
  }, [id]);

  if (!car) return <p>Loading car details...</p>;

  return (
    <div>
      <h2>
        {car.name} - {car.model}
      </h2>
      <img src={car.imageUrl} alt={car.name} style={{ width: "300px" }} />
      <p>
        <strong>Price:</strong> €{car.price}/day
      </p>
      <p>
        <strong>Location:</strong> {car.location}
      </p>
      <p>{car.description}</p>

      <ReviewForm carId={car.id} />
    </div>
  );
}

export default CarDetails;
