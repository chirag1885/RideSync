import { Link } from "react-router-dom";

interface RideCardProps {
  id: string;
  pickup: string;
  destination: string;
  travelDateTime: string;
  peopleNeeded: number;
  genderPreference: "anyone" | "men" | "women";
  creatorName: string;
}

const genderLabels: Record<string, string> = {
  anyone: "Anyone",
  men: "Men Only",
  women: "Women Only",
};

const genderColors: Record<string, string> = {
  anyone: "bg-gray-100 text-gray-700",
  men: "bg-blue-100 text-blue-700",
  women: "bg-pink-100 text-pink-700",
};

export default function RideCard({
  id,
  pickup,
  destination,
  travelDateTime,
  peopleNeeded,
  genderPreference,
  creatorName,
}: RideCardProps) {
  const dateObj = new Date(travelDateTime);
  const formattedDate = dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs text-gray-500">Posted by</p>
          <p className="text-sm font-medium text-gray-900">{creatorName}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${genderColors[genderPreference]}`}>
          {genderLabels[genderPreference]}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-500">{pickup} → </p>
        <p className="text-lg font-semibold text-gray-900">{destination}</p>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <span>{formattedDate}, {formattedTime}</span>
        <span>{peopleNeeded} needed</span>
      </div>

      <Link
        to={`/ride-requests/${id}`}
        className="block text-center bg-purple-50 text-purple-600 hover:bg-purple-100 font-medium rounded-lg py-2 text-sm transition"
      >
        View Details
      </Link>
    </div>
  );
}