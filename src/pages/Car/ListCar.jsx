import { useState } from "react";
import { db, storage } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ListCar() {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !name || !model || !price || !location) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const imageRef = ref(storage, `carImages/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, "cars"), {
        name,
        model,
        price,
        location,
        description,
        imageUrl,
        ownerId: currentUser.uid,
        ownerEmail: currentUser.email,
      });

      navigate("/cars");
    } catch (err) {
      console.error("Error uploading car:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#2E2E3A]">
        List Your Car for Rent
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Car Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="e.g. Mercedes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="e.g. C-Class 2020"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price per day (€)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="e.g. 50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="e.g. Tirana"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            rows="4"
            placeholder="Write a few words about the car..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="mt-1"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 mt-4 bg-[#A9FF3A] text-[#2E2E3A] font-semibold rounded-md hover:bg-[#90e933] transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
