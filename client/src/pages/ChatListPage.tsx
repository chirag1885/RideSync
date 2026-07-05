import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Navigation } from "lucide-react";
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

  const initialsOf = (name: string) =>
    name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="relative min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/3 w-[500px] h-[500px] bg-brand-400/20 dark:bg-brand-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto px-6 py-12">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h1 className="text-xl font-extrabold text-surface-900 dark:text-surface-50">Your Chats</h1>
        </div>

        {isLoading && <p className="text-surface-500 dark:text-surface-400 text-sm">Loading...</p>}
        {isError && <p className="text-red-500 text-sm">Failed to load chats.</p>}

        {!isLoading && chats.length === 0 && (
          <div className="text-center py-16 bg-white/50 dark:bg-surface-900/50 backdrop-blur rounded-2xl border border-dashed border-surface-300 dark:border-surface-700">
            <p className="text-surface-500 dark:text-surface-400">
              No chats yet. Chats unlock once someone accepts your join request, or you accept someone else's.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {chats.map((chat, index) => {
            const otherPerson = chat.participants.find((p) => p._id !== user?.id);
            return (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/chats/${chat._id}`}
                  className="flex items-center gap-4 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-2xl border border-surface-200/60 dark:border-surface-800 shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold">
                    {initialsOf(otherPerson?.name || "?")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-surface-900 dark:text-surface-50 truncate">
                      {otherPerson?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-1 truncate">
                      <Navigation className="w-3 h-3 shrink-0" />
                      {chat.rideRequest?.pickup} → {chat.rideRequest?.destination}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}