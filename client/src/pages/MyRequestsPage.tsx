import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyJoinRequestsApi } from "../lib/joinRequestApi";

interface MyJoinRequestData {
  _id: string;
  status: "pending" | "accepted" | "rejected";
  rideRequest: {
    _id: string;
    pickup: string;
    destination: string;
    travelDateTime: string;
    creator: {
      name: string;
    };
  };
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MyRequestsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myJoinRequests"],
    queryFn: getMyJoinRequestsApi,
  });

  const requests: MyJoinRequestData[] = data?.data?.joinRequests || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <Link to="/dashboard" className="text-sm text-purple-600 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-xl font-bold text-gray-900 mb-6">My Join Requests</h1>

        {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}
        {isError && <p className="text-red-500 text-sm">Failed to load your requests.</p>}
        {!isLoading && requests.length === 0 && (
          <p className="text-gray-500 text-sm">You haven't requested to join any rides yet.</p>
        )}

        <div className="space-y-3">
          {requests.map((jr) => (
            <Link
              key={jr._id}
              to={`/ride-requests/${jr.rideRequest?._id}`}
              className="block border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">
                    {jr.rideRequest?.pickup} → {jr.rideRequest?.destination}
                  </p>
                  <p className="text-sm text-gray-500">Posted by {jr.rideRequest?.creator?.name}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColors[jr.status]}`}>
                  {jr.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}