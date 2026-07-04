import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRideRequestByIdApi } from "../lib/rideRequestApi";

export default function RideRequestDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rideRequest", id],
    queryFn: () => getRideRequestByIdApi(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (isError || !data?.data?.rideRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Ride request not found. <Link to="/dashboard" className="text-purple-600 ml-2 hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const r = data.data.rideRequest;
  const dateObj = new Date(r.travelDateTime);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <Link to="/dashboard" className="text-sm text-purple-600 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {r.pickup} → {r.destination}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} at{" "}
          {dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-gray-500">Posted by</p>
            <p className="font-medium text-gray-900">{r.creator?.name}</p>
          </div>
          <div>
            <p className="text-gray-500">People Needed</p>
            <p className="font-medium text-gray-900">{r.peopleNeeded}</p>
          </div>
          <div>
            <p className="text-gray-500">Gender Preference</p>
            <p className="font-medium text-gray-900 capitalize">{r.genderPreference}</p>
          </div>
          <div>
            <p className="text-gray-500">Branch / Year</p>
            <p className="font-medium text-gray-900">{r.creator?.branch}, Year {r.creator?.year}</p>
          </div>
        </div>

        {r.notes && (
          <div className="mb-6">
            <p className="text-gray-500 text-sm mb-1">Notes</p>
            <p className="text-gray-900 text-sm">{r.notes}</p>
          </div>
        )}

        <button
          disabled
          className="w-full bg-purple-600 opacity-50 cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm"
        >
          I'm Interested (coming soon)
        </button>
      </div>
    </div>
  );
}