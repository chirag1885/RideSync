import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, MapPin, Users2, SlidersHorizontal, Plus } from "lucide-react";
import { getRideRequestsApi } from "../lib/rideRequestApi";
import { useAuth } from "../context/AuthContext";
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
  const { user } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [destination, setDestination] = useState("");
  const [pickup, setPickup] = useState("");
  const [genderPreference, setGenderPreference] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rideRequests", { destination, pickup, genderPreference, sort }],
    queryFn: () =>
      getRideRequestsApi({
        destination: destination || undefined,
        pickup: pickup || undefined,
        genderPreference: genderPreference || undefined,
        sort,
      }),
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const rideRequests: RideRequestData[] = data?.data?.rideRequests || [];

  const handleClearFilters = () => {
    setDestination("");
    setPickup("");
    setGenderPreference("");
    setSort("newest");
  };

  const hasActiveFilters = pickup || destination || genderPreference || sort !== "newest";

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors overflow-hidden"
    >
      {/* Cursor-reactive glow */}
      <div
        className="pointer-events-none absolute w-[600px] h-[600px] rounded-full blur-3xl transition-transform duration-300 ease-out bg-gradient-to-br from-brand-400/30 to-accent-400/20 dark:from-brand-600/15 dark:to-accent-600/10"
        style={{
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-24">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-extrabold text-surface-900 dark:text-surface-50 mb-1">
            Welcome back, <span className="text-brand-600 dark:text-brand-400">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            Find students heading your way, right now.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/70 dark:bg-surface-900/70 backdrop-blur-xl rounded-2xl border border-surface-200/60 dark:border-surface-800 p-5 mb-10 shadow-sm"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Pickup"
                className="w-full pl-9 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination"
                className="w-full pl-9 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400"
              />
            </div>
            <select
              value={genderPreference}
              onChange={(e) => setGenderPreference(e.target.value)}
              className="rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Any Gender Pref.</option>
              <option value="anyone">Anyone</option>
              <option value="men">Men Only</option>
              <option value="women">Women Only</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
              className="rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline"
            >
              <SlidersHorizontal className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </motion.div>

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            {isLoading ? "Loading..." : `${rideRequests.length} Open Ride${rideRequests.length === 1 ? "" : "s"}`}
          </h2>
          <Link
            to="/create-request"
            className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 shadow-lg shadow-brand-500/25 transition"
          >
            <Plus className="w-4 h-4" />
            Create Ride Request
          </Link>
        </div>

        {isError && <p className="text-red-500 dark:text-red-400 text-sm">Failed to load requests.</p>}

        {!isLoading && rideRequests.length === 0 && (
          <div className="text-center py-20 bg-white/50 dark:bg-surface-900/50 backdrop-blur rounded-2xl border border-dashed border-surface-300 dark:border-surface-700">
            <p className="text-surface-500 dark:text-surface-400">
              No matching ride requests found. Try different filters, or create one!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rideRequests.map((r, index) => (
            <RideCard
              key={r._id}
              index={index}
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