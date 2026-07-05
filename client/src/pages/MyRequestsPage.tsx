import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Navigation, Clock3, CheckCircle2, XCircle, Inbox } from "lucide-react";
import { getMyJoinRequestsApi } from "../lib/joinRequestApi";

interface MyJoinRequestData {
  _id: string;
  status: "pending" | "accepted" | "rejected";
  message?: string;
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

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock3,
    className: "bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function MyRequestsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myJoinRequests"],
    queryFn: getMyJoinRequestsApi,
  });

  const requests: MyJoinRequestData[] = data?.data?.joinRequests || [];

  return (
    <div className="relative min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors overflow-hidden">
      <div className="pointer-events-none absolute -top-40 right-1/3 w-[500px] h-[500px] bg-brand-400/20 dark:bg-brand-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto px-6 py-12">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <Inbox className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h1 className="text-xl font-extrabold text-surface-900 dark:text-surface-50">My Join Requests</h1>
        </div>

        {isLoading && <p className="text-surface-500 dark:text-surface-400 text-sm">Loading...</p>}
        {isError && <p className="text-red-500 text-sm">Failed to load your requests.</p>}

        {!isLoading && requests.length === 0 && (
          <div className="text-center py-16 bg-white/50 dark:bg-surface-900/50 backdrop-blur rounded-2xl border border-dashed border-surface-300 dark:border-surface-700">
            <p className="text-surface-500 dark:text-surface-400">
              You haven't requested to join any rides yet.
            </p>
            <Link
              to="/dashboard"
              className="inline-block mt-3 text-brand-600 dark:text-brand-400 font-semibold hover:underline text-sm"
            >
              Browse open rides
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {requests
            .filter((jr) => jr.rideRequest)
            .map((jr, index) => {
            const config = statusConfig[jr.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={jr._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={`/ride-requests/${jr.rideRequest?._id}`}
                  className="block bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-2xl border border-surface-200/60 dark:border-surface-800 shadow-sm hover:shadow-md transition-shadow p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {jr.rideRequest?.pickup}
                      </p>
                      <p className="font-bold text-surface-900 dark:text-surface-50 flex items-center gap-1.5 mt-0.5">
                        <Navigation className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                        {jr.rideRequest?.destination}
                      </p>
                    </div>
                    <span
                      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${config.className}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    Posted by {jr.rideRequest?.creator?.name}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}