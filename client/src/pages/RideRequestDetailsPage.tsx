import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Calendar,
  Clock,
  Users2,
  GraduationCap,
  FileText,
  ArrowLeft,
  Inbox,
  CheckCircle2,
  Clock3,
  XCircle,
  MessageSquarePlus,
  Trash2,
} from "lucide-react";
import { getRideRequestByIdApi, deleteRideRequestApi } from "../lib/rideRequestApi";
import { createJoinRequestApi, getMyJoinRequestsApi } from "../lib/joinRequestApi";
import { useAuth } from "../context/AuthContext";

const genderStyles: Record<string, string> = {
  anyone: "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300",
  men: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  women: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
};

const genderLabels: Record<string, string> = {
  anyone: "Anyone",
  men: "Men Only",
  women: "Women Only",
};

export default function RideRequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rideRequest", id],
    queryFn: () => getRideRequestByIdApi(id!),
    enabled: !!id,
  });

  const { data: myRequestsData } = useQuery({
    queryKey: ["myJoinRequests"],
    queryFn: getMyJoinRequestsApi,
  });

  const existingJoinRequest = myRequestsData?.data?.joinRequests?.find(
    (jr: any) => jr.rideRequest?._id === id
  );

  const joinMutation = useMutation({
    mutationFn: () => createJoinRequestApi(id!, message.trim() || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rideRequest", id] });
      queryClient.invalidateQueries({ queryKey: ["myJoinRequests"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRideRequestApi(id!),
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const handleDelete = () => {
    if (
      confirm(
        "Delete this ride request? This can't be undone, and any chats tied to it will also be deleted."
      )
    ) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <p className="text-surface-500 dark:text-surface-400">Loading...</p>
      </div>
    );
  }

  if (isError || !data?.data?.rideRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 flex-col gap-3">
        <p className="text-surface-500 dark:text-surface-400">Ride request not found.</p>
        <Link to="/dashboard" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const r = data.data.rideRequest;
  const dateObj = new Date(r.travelDateTime);
  const isOwnRequest = r.creator?._id === user?.id;
  const initials = r.creator?.name
    ?.split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const renderActionButton = () => {
    if (isOwnRequest) {
      return (
        <div className="space-y-2">
          <Link
            to={`/ride-requests/${id}/requests`}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold rounded-xl py-3 text-sm shadow-lg shadow-brand-500/25 transition"
          >
            <Inbox className="w-4 h-4" />
            View Join Requests
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="w-full flex items-center justify-center gap-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 font-medium rounded-xl py-2.5 text-sm transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {deleteMutation.isPending ? "Deleting..." : "Delete Ride Request"}
          </button>
        </div>
      );
    }

    const status = existingJoinRequest?.status;

    if (status === "accepted") {
      return (
        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm font-semibold py-3 bg-green-50 dark:bg-green-500/10 rounded-xl">
          <CheckCircle2 className="w-4 h-4" />
          Accepted — check your Chats
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="flex items-center justify-center gap-2 text-surface-500 dark:text-surface-400 text-sm font-semibold py-3 bg-surface-100 dark:bg-surface-800 rounded-xl">
          <Clock3 className="w-4 h-4" />
          Requested — waiting for response
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <div className="flex items-center justify-center gap-2 text-red-500 dark:text-red-400 text-sm font-semibold py-3 bg-red-50 dark:bg-red-500/10 rounded-xl">
          <XCircle className="w-4 h-4" />
          Request was declined
        </div>
      );
    }

    return (
      <div>
        <div className="mb-3">
          <label className="text-xs font-medium text-surface-500 dark:text-surface-400 flex items-center gap-1.5 mb-1.5">
            <MessageSquarePlus className="w-3.5 h-3.5" />
            Add a message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            maxLength={300}
            placeholder="e.g. I can leave anytime after 4, happy to split the fare evenly"
            className="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400"
          />
        </div>
        <motion.button
          onClick={() => joinMutation.mutate()}
          disabled={joinMutation.isPending}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm shadow-lg shadow-brand-500/25 transition"
        >
          {joinMutation.isPending ? "Sending..." : "I'm Interested"}
        </motion.button>
        {joinMutation.isError && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {(joinMutation.error as any)?.response?.data?.message || "Failed to send interest"}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/4 w-[500px] h-[500px] bg-brand-400/20 dark:bg-brand-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-3xl border border-surface-200/60 dark:border-surface-800 shadow-xl shadow-surface-900/5 dark:shadow-none overflow-hidden"
        >
          <div className="h-2 bg-gradient-to-r from-brand-500 to-accent-500" />

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-md">
                  {initials}
                </div>
                <div>
                  <p className="text-xs text-surface-400 dark:text-surface-500">Posted by</p>
                  <p className="font-semibold text-surface-900 dark:text-surface-50">{r.creator?.name}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${genderStyles[r.genderPreference]}`}>
                {genderLabels[r.genderPreference]}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-surface-100 dark:border-surface-800">
              <div className="flex flex-col items-center pt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                <div className="w-0.5 h-8 bg-gradient-to-b from-brand-500 to-accent-500 my-1" />
                <div className="w-2.5 h-2.5 rounded-full bg-accent-500" />
              </div>
              <div>
                <p className="text-sm text-surface-400 dark:text-surface-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {r.pickup}
                </p>
                <p className="text-2xl font-extrabold text-surface-900 dark:text-surface-50 flex items-center gap-1.5 mt-1">
                  <Navigation className="w-5 h-5 text-brand-500 dark:text-brand-400" /> {r.destination}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-surface-500 dark:text-surface-400" />
                </div>
                <div>
                  <p className="text-xs text-surface-400 dark:text-surface-500">Date</p>
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                    {dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-surface-500 dark:text-surface-400" />
                </div>
                <div>
                  <p className="text-xs text-surface-400 dark:text-surface-500">Time</p>
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                    {dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
  <div
    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
      (r.seatsRemaining ?? r.peopleNeeded) <= 0
        ? "bg-red-50 dark:bg-red-500/10"
        : "bg-green-50 dark:bg-green-500/10"
    }`}
  >
    <Users2
      className={`w-4 h-4 ${
        (r.seatsRemaining ?? r.peopleNeeded) <= 0
          ? "text-red-500 dark:text-red-400"
          : "text-green-600 dark:text-green-400"
      }`}
    />
  </div>
  <div>
    <p className="text-xs text-surface-400 dark:text-surface-500">Seats</p>
    <p
      className={`text-sm font-semibold ${
        (r.seatsRemaining ?? r.peopleNeeded) <= 0
          ? "text-red-500 dark:text-red-400"
          : "text-green-600 dark:text-green-400"
      }`}
    >
      {(r.seatsRemaining ?? r.peopleNeeded) <= 0 ? "Full" : `${r.seatsRemaining} left`}
    </p>
  </div>
</div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-surface-500 dark:text-surface-400" />
                </div>
                <div>
                  <p className="text-xs text-surface-400 dark:text-surface-500">Branch / Year</p>
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                    {r.creator?.branch}, Y{r.creator?.year}
                  </p>
                </div>
              </div>
            </div>

            {r.notes && (
              <div className="mb-6 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 flex gap-2.5">
                <FileText className="w-4 h-4 text-surface-400 shrink-0 mt-0.5" />
                <p className="text-sm text-surface-600 dark:text-surface-300">{r.notes}</p>
              </div>
            )}

            {renderActionButton()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}