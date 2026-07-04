import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJoinRequestsForRideApi, respondToJoinRequestApi } from "../lib/joinRequestApi";

interface JoinRequestData {
  _id: string;
  status: "pending" | "accepted" | "rejected";
  requester: {
    _id: string;
    name: string;
    branch: string;
    year: number;
    rating: number;
  };
}

export default function ManageJoinRequestsPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["joinRequestsForRide", id],
    queryFn: () => getJoinRequestsForRideApi(id!),
    enabled: !!id,
  });

  const respondMutation = useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: "accept" | "reject" }) =>
      respondToJoinRequestApi(requestId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["joinRequestsForRide", id] });
    },
  });

  const joinRequests: JoinRequestData[] = data?.data?.joinRequests || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <Link to={`/ride-requests/${id}`} className="text-sm text-purple-600 hover:underline mb-4 inline-block">
          ← Back to Ride Details
        </Link>

        <h1 className="text-xl font-bold text-gray-900 mb-6">Join Requests</h1>

        {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}
        {isError && <p className="text-red-500 text-sm">Failed to load join requests. (Are you the creator of this ride?)</p>}

        {!isLoading && joinRequests.length === 0 && (
          <p className="text-gray-500 text-sm">No one has requested to join yet.</p>
        )}

        <div className="space-y-3">
          {joinRequests.map((jr) => (
            <div key={jr._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{jr.requester?.name}</p>
                <p className="text-sm text-gray-500">
                  {jr.requester?.branch}, Year {jr.requester?.year}
                </p>
              </div>

              {jr.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => respondMutation.mutate({ requestId: jr._id, action: "accept" })}
                    disabled={respondMutation.isPending}
                    className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-3 py-1.5"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondMutation.mutate({ requestId: jr._id, action: "reject" })}
                    disabled={respondMutation.isPending}
                    className="text-sm bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg px-3 py-1.5"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                    jr.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {jr.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}