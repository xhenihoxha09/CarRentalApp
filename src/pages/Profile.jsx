import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const name = currentUser?.displayName || "User Name";
  const email = currentUser?.email;
  const phone = currentUser?.phone || "Not Provided";
  const photo =
    currentUser?.photoURL ||
    "https://ui-avatars.com/api/?name=User&background=EEE&color=2E2E3A";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFCFF] px-6 py-12">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-lg w-full text-center">
        <img
          src={photo}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-[#A9FF3A] object-cover mx-auto"
        />
        <h2 className="text-2xl font-bold text-[#2E2E3A] mt-4">{name}</h2>
        <p className="text-gray-600 mb-1">
          <strong>Email:</strong> {email}
        </p>
        <p className="text-gray-600">
          <strong>Phone:</strong> {phone}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate("/cars")}
            className="px-4 py-2 rounded-md bg-[#A9FF3A] text-[#2E2E3A] font-semibold shadow-sm hover:bg-[#bfff5a]"
          >
            Rent a Car
          </button>
          <button
            onClick={() => navigate("/list-car")}
            className="px-4 py-2 rounded-md border text-[#2E2E3A] hover:bg-gray-100"
          >
            List Your Car
          </button>
          <button
            onClick={() => navigate("/my-cars")}
            className="px-4 py-2 rounded-md border text-[#2E2E3A] hover:bg-gray-100"
          >
            My Cars
          </button>
          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            className="px-4 py-2 rounded-md bg-red-100 text-red-600 font-semibold hover:bg-red-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
