import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { createRideRequestApi } from "../lib/rideRequestApi";

const createRequestSchema = z.object({
  pickup: z.string().min(2, "Pickup location is required"),
  destination: z.string().min(2, "Destination is required"),
  travelDate: z.string().min(1, "Date is required"),
  travelTime: z.string().min(1, "Time is required"),
  peopleNeeded: z.coerce.number().min(1, "At least 1 person").max(10),
  genderPreference: z.enum(["anyone", "men", "women"]),
  notes: z.string().max(300).optional(),
});

type CreateRequestInput = z.input<typeof createRequestSchema>;
type CreateRequestValues = z.output<typeof createRequestSchema>;

export default function CreateRequestPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRequestInput, unknown, CreateRequestValues>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      genderPreference: "anyone",
      peopleNeeded: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: createRideRequestApi,
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const onSubmit = (values: CreateRequestValues) => {
    const travelDateTime = new Date(`${values.travelDate}T${values.travelTime}`).toISOString();

    createMutation.mutate({
      pickup: values.pickup,
      destination: values.destination,
      travelDateTime,
      peopleNeeded: values.peopleNeeded,
      genderPreference: values.genderPreference,
      notes: values.notes,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create a Ride Request</h1>
          <Link to="/dashboard" className="text-sm text-purple-600 hover:underline">
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
            <input
              {...register("pickup")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Thapar Main Gate"
            />
            {errors.pickup && <p className="text-red-500 text-xs mt-1">{errors.pickup.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              {...register("destination")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Chandigarh Airport"
            />
            {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
              <input
                type="date"
                {...register("travelDate")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.travelDate && <p className="text-red-500 text-xs mt-1">{errors.travelDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Travel Time</label>
              <input
                type="time"
                {...register("travelTime")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.travelTime && <p className="text-red-500 text-xs mt-1">{errors.travelTime.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">People Needed</label>
              <input
                type="number"
                {...register("peopleNeeded")}
                min={1}
                max={10}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.peopleNeeded && <p className="text-red-500 text-xs mt-1">{errors.peopleNeeded.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender Preference</label>
              <select
                {...register("genderPreference")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="anyone">Anyone</option>
                <option value="men">Men Only</option>
                <option value="women">Women Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g. 2 medium suitcases, leaving exactly at 5"
            />
            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>}
          </div>

          {createMutation.isError && (
            <p className="text-red-500 text-sm">
              {(createMutation.error as any)?.response?.data?.message || "Failed to create request"}
            </p>
          )}

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition"
          >
            {createMutation.isPending ? "Creating..." : "Create Request"}
          </button>
        </form>
      </div>
    </div>
  );
}