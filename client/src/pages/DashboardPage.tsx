import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRideRequestsApi } from "../lib/rideRequestApi";
import RideCard from "../components/RideCard";

interface RideRequestData {
  _id: string;
  pickup: string;
  destination: string;
  travelDateTime: string;
  peopleNeeded: number;
  genderPreference: "anyone" | "men" | "women";
  creator: {
    _id: string;
    name: string;
  };
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rideRequests"],
    queryFn: () => getRideRequestsApi(),
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const rideRequests: RideRequestData[] = data?.data?.rideRequests || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/profile" className="text-sm text-purple-600 hover:underline">
              Edit Profile
            </Link>
            <Link to="/my-requests" className="text-sm text-purple-600 hover:underline">
              My Requests
            </Link>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
              Log out
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Open Ride Requests</h2>
          <Link
            to="/create-request"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg px-4 py-2"
          >
            + Create Ride Request
          </Link>
        </div>

        {isLoading && <p className="text-gray-500 text-sm">Loading requests...</p>}
        {isError && <p className="text-red-500 text-sm">Failed to load requests.</p>}

        {!isLoading && rideRequests.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No ride requests yet. Be the first to create one!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rideRequests.map((r) => (
            <RideCard
              key={r._id}
              id={r._id}
              pickup={r.pickup}
              destination={r.destination}
              travelDateTime={r.travelDateTime}
              peopleNeeded={r.peopleNeeded}
              genderPreference={r.genderPreference}
              creatorName={r.creator?.name || "Unknown"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}