import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, MessageSquare, Inbox as InboxIcon, UserX } from "lucide-react";
import { getJoinRequestsForRideApi, respondToJoinRequestApi, removeParticipantApi } from "../lib/joinRequestApi";

interface JoinRequestData {
  _id: string;
  status: "pending" | "accepted" | "rejected" | "removed";
  message?: string;
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
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

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

  const removeMutation = useMutation({
    mutationFn: (requestId: string) => removeParticipantApi(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["joinRequestsForRide", id] });
      setConfirmRemoveId(null);
    },
  });

  const joinRequests: JoinRequestData[] = data?.data?.joinRequests || [];
  const pending = joinRequests.filter((jr) => jr.status === "pending");
  const resolved = joinRequests.filter((jr) => jr.status !== "pending");

  const initialsOf = (name: string) =>
    name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="relative min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors overflow-hidden">
      <div className="pointer-events-none absolute -top-40 right-1/4 w-[500px] h-[500px] bg-brand-400/20 dark:bg-brand-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto px-6 py-12">
        <Link
          to={`/ride-requests/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ride Details
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <InboxIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h1 className="text-xl font-extrabold text-surface-900 dark:text-surface-50">Join Requests</h1>
        </div>

        {isLoading && <p className="text-surface-500 dark:text-surface-400 text-sm">Loading...</p>}
        {isError && (
          <p className="text-red-500 text-sm">Failed to load join requests. (Are you the creator of this ride?)</p>
        )}

        {!isLoading && joinRequests.length === 0 && (
          <div className="text-center py-16 bg-white/50 dark:bg-surface-900/50 backdrop-blur rounded-2xl border border-dashed border-surface-300 dark:border-surface-700">
            <p className="text-surface-500 dark:text-surface-400">No one has requested to join yet.</p>
          </div>
        )}

        {pending.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide mb-3">
              Pending ({pending.length})
            </p>
            <div className="space-y-3">
              <AnimatePresence>
                {pending.map((jr) => (
                  <motion.div
                    key={jr._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-2xl border border-surface-200/60 dark:border-surface-800 shadow-sm p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {initialsOf(jr.requester?.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-surface-900 dark:text-surface-50">{jr.requester?.name}</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400">
                            {jr.requester?.branch}, Year {jr.requester?.year}
                          </p>
                        </div>
                      </div>
                    </div>

                    {jr.message && (
                      <div className="mb-4 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 flex gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-surface-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-surface-600 dark:text-surface-300 italic">"{jr.message}"</p>
                      </div>
                    )}

                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">
                      Would you like to accept this request?
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => respondMutation.mutate({ requestId: jr._id, action: "accept" })}
                        disabled={respondMutation.isPending}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl py-2.5 transition"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => respondMutation.mutate({ requestId: jr._id, action: "reject" })}
                        disabled={respondMutation.isPending}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-50 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl py-2.5 transition"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {resolved.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide mb-3">
              Resolved
            </p>
            <div className="space-y-2">
              {resolved.map((jr) => (
                <div
                  key={jr._id}
                  className="bg-white/50 dark:bg-surface-900/50 rounded-xl border border-surface-200/60 dark:border-surface-800 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-surface-200 dark:bg-surface-800 flex items-center justify-center text-xs font-bold text-surface-500 dark:text-surface-400">
                        {initialsOf(jr.requester?.name)}
                      </div>
                      <p className="text-sm text-surface-700 dark:text-surface-300">{jr.requester?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                          jr.status === "accepted"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : jr.status === "removed"
                            ? "bg-surface-200 text-surface-600 dark:bg-surface-700 dark:text-surface-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {jr.status}
                      </span>
                      {jr.status === "accepted" && (
                        <button
                          onClick={() => setConfirmRemoveId(jr._id)}
                          className="text-xs font-medium text-red-500 dark:text-red-400 hover:underline flex items-center gap-1"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {confirmRemoveId === jr._id && (
                    <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between">
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        Remove {jr.requester?.name}? Their chat will be deleted too.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmRemoveId(null)}
                          className="text-xs text-surface-500 dark:text-surface-400 px-2 py-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => removeMutation.mutate(jr._id)}
                          disabled={removeMutation.isPending}
                          className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
                        >
                          {removeMutation.isPending ? "Removing..." : "Confirm"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}