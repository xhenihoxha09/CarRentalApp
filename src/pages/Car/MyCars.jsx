import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

function MyCars() {
  const { currentUser } = useAuth();
  const [myCars, setMyCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);

  useEffect(() => {
    const fetchMyCars = async () => {
      const q = query(
        collection(db, "cars"),
        where("owner", "==", currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const carsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyCars(carsList);
    };

    if (currentUser) {
      fetchMyCars();
    }
  }, [currentUser]);

  const handleDelete = async (carId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "cars", carId));
      setMyCars((prev) => prev.filter((car) => car.id !== carId));
      alert("Car deleted successfully!");
    } catch (err) {
      console.error("Error deleting car:", err.message);
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
  };

  const handleUpdateCar = async (e, carId) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "cars", carId), {
        name: editingCar.name,
        model: editingCar.model,
        price: Number(editingCar.price),
        location: editingCar.location,
        description: editingCar.description,
      });
      alert("Car updated successfully!");
      setEditingCar(null);

      // Refresh list
      const q = query(
        collection(db, "cars"),
        where("owner", "==", currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const updatedList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyCars(updatedList);
    } catch (err) {
      console.error("Error updating car:", err.message);
    }
  };

  return (
    <div>
      <h2>My Listed Cars</h2>
      {myCars.length === 0 && <p>No cars listed yet.</p>}
      {myCars.map((car) => (
        <div key={car.id} style={{ marginBottom: "20px" }}>
          <h3>
            {car.name} - {car.model}
          </h3>
          <img
            src={car.imageUrl}
            alt={car.name}
            style={{ width: "200px", height: "150px" }}
          />
          <p>Price: €{car.price} / day</p>
          <p>Location: {car.location}</p>
          <p>Description: {car.description}</p>

          <button onClick={() => handleEdit(car)}>Edit</button>
          <button onClick={() => handleDelete(car.id)}>Delete</button>

          {editingCar?.id === car.id && (
            <form onSubmit={(e) => handleUpdateCar(e, car.id)}>
              <input
                type="text"
                value={editingCar.name}
                onChange={(e) =>
                  setEditingCar({ ...editingCar, name: e.target.value })
                }
              />
              <input
                type="text"
                value={editingCar.model}
                onChange={(e) =>
                  setEditingCar({ ...editingCar, model: e.target.value })
                }
              />
              <input
                type="number"
                value={editingCar.price}
                onChange={(e) =>
                  setEditingCar({ ...editingCar, price: e.target.value })
                }
              />
              <input
                type="text"
                value={editingCar.location}
                onChange={(e) =>
                  setEditingCar({ ...editingCar, location: e.target.value })
                }
              />
              <textarea
                value={editingCar.description}
                onChange={(e) =>
                  setEditingCar({ ...editingCar, description: e.target.value })
                }
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingCar(null)}>
                Cancel
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyCars;
