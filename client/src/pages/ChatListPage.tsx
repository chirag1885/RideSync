import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyChatsApi } from "../lib/chatApi";
import { useAuth } from "../context/AuthContext";

interface ChatData {
  _id: string;
  participants: { _id: string; name: string }[];
  rideRequest: { pickup: string; destination: string };
  updatedAt: string;
}

export default function ChatListPage() {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myChats"],
    queryFn: getMyChatsApi,
    refetchInterval: 5000,
  });

  const chats: ChatData[] = data?.data?.chats || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <Link to="/dashboard" className="text-sm text-purple-600 hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-xl font-bold text-gray-900 mb-6">Your Chats</h1>

        {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}
        {isError && <p className="text-red-500 text-sm">Failed to load chats.</p>}
        {!isLoading && chats.length === 0 && (
          <p className="text-gray-500 text-sm">
            No chats yet. Chats unlock once someone accepts your join request, or you accept someone else's.
          </p>
        )}

        <div className="space-y-2">
          {chats.map((chat) => {
            const otherPerson = chat.participants.find((p) => p._id !== user?.id);
            return (
              <Link
                key={chat._id}
                to={`/chats/${chat._id}`}
                className="block border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
              >
                <p className="font-medium text-gray-900">{otherPerson?.name || "Unknown"}</p>
                <p className="text-sm text-gray-500">
                  {chat.rideRequest?.pickup} → {chat.rideRequest?.destination}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}