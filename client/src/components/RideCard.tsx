import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users2 } from "lucide-react";

interface RideCardProps {
  id: string;
  index?: number;
  pickup: string;
  destination: string;
  travelDateTime: string;
  peopleNeeded: number;
  genderPreference: "anyone" | "men" | "women";
  creatorName: string;
}

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

export default function RideCard({
  id,
  index = 0,
  pickup,
  destination,
  travelDateTime,
  peopleNeeded,
  genderPreference,
  creatorName,
}: RideCardProps) {
  const dateObj = new Date(travelDateTime);
  const formattedDate = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const formattedTime = dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const initials = creatorName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4 }}
      className="group relative bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-500/10 dark:hover:shadow-brand-500/5 transition-shadow"
    >
      <div className="h-1.5 bg-gradient-to-r from-brand-500 to-accent-500" />

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div>
              <p className="text-xs text-surface-400 dark:text-surface-500 leading-none mb-0.5">Posted by</p>
              <p className="text-sm font-semibold text-surface-900 dark:text-surface-50">{creatorName}</p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${genderStyles[genderPreference]}`}>
            {genderLabels[genderPreference]}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-xs text-surface-400 dark:text-surface-500 mb-0.5">{pickup}</p>
          <div className="flex items-center gap-1.5">
            <ArrowRight className="w-4 h-4 text-brand-500 dark:text-brand-400 shrink-0" />
            <p className="text-lg font-bold text-surface-900 dark:text-surface-50 leading-tight">{destination}</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-surface-500 dark:text-surface-400 mb-4 pb-4 border-b border-surface-100 dark:border-surface-800">
          <span>{formattedDate} · {formattedTime}</span>
          <span className="flex items-center gap-1">
            <Users2 className="w-3.5 h-3.5" />
            {peopleNeeded} needed
          </span>
        </div>

        <Link
          to={`/ride-requests/${id}`}
          className="flex items-center justify-center gap-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}