import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

function ListCar() {
  const { currentUser } = useAuth();
  const [carName, setCarName] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carImage, setCarImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setCarImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carName || !carModel || !carImage) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      const fileRef = ref(
        storage,
        `carImages/${currentUser.uid}-${carImage.name}`
      );
      await uploadBytes(fileRef, carImage);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, "cars"), {
        owner: currentUser.uid,
        ownerEmail: currentUser.email,
        name: carName,
        model: carModel,
        price: Number(price),
        location,
        description,
        imageUrl: url,
        createdAt: new Date(),
      });

      setPrice("");
      setLocation("");
      setDescription("");
      setImageUrl(url);
      setMessage("Car listed successfully!");
      setCarName("");
      setCarModel("");
      setCarImage(null);
    } catch (error) {
      setMessage("Failed to list car: " + error.message);
    }
  };

  return (
    <div>
      <h2>List Your Car</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Car Name:</label>
          <input
            type="text"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            placeholder="Enter car name"
          />
        </div>

        <div>
          <label>Car Model:</label>
          <input
            type="text"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            placeholder="Enter car model"
          />
        </div>

        <div>
          <label>Car Image:</label>
          <input type="file" onChange={handleImageUpload} />
        </div>

        <div>
          <label>Price (€/day):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
        </div>

        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city/location"
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the car..."
          />
        </div>

        <button type="submit">List Car</button>
      </form>

      {imageUrl && (
        <div>
          <h4>Uploaded Image:</h4>
          <img
            src={imageUrl}
            alt="Car"
            style={{ width: "200px", height: "150px" }}
          />
        </div>
      )}
    </div>
  );0
}

export default ListCar;
