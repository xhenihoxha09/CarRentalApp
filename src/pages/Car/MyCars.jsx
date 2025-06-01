import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export default function MyCars() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, "cars"),
          where("ownerId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
      setLoading(false);
    };

    fetchCars();
  }, [currentUser]);

  const handleDelete = async (carId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "cars", carId));
        setCars(cars.filter((car) => car.id !== carId));
      } catch (error) {
        console.error("Error deleting car:", error);
      }
    }
  };

  const handleEdit = (carId) => {
    navigate(`/edit-car/${carId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#2E2E3A]">My Listed Cars</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="loader border-t-[#A9FF3A] border-4 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : cars.length === 0 ? (
        <p className="text-gray-500 text-center">
          You haven't listed any cars yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white border border-[#CBD4C2] rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img
                src={car.imageUrl}
                alt={car.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-[#2E2E3A]">
                  {car.name} - {car.model}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {car.location}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Price:</strong> €{car.price} / day
                </p>
                <p className="text-sm text-gray-600 truncate">
                  <strong>Description:</strong> {car.description}
                </p>

                <div className="flex justify-between mt-3">
                  <Link
                    to={`/cars/${car.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(car.id)}
                      className="text-sm bg-white-400 text-[#2E2E3A] px-3 py-1 rounded-lg hover:border border-black-500 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(car.id)}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
