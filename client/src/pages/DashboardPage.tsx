import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/profile" className="text-sm text-purple-600 hover:underline">
              Edit Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Branch</p>
            <p className="font-medium text-gray-900">{user?.branch}</p>
          </div>
          <div>
            <p className="text-gray-500">Year</p>
            <p className="font-medium text-gray-900">{user?.year}</p>
          </div>
        </div>
      </div>
    </div>
  );
}