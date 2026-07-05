import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Navigation, Calendar, Clock, Users2, Heart, FileText, ArrowRight, X } from "lucide-react";
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
    watch,
    formState: { errors },
  } = useForm<CreateRequestInput, unknown, CreateRequestValues>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      genderPreference: "anyone",
      peopleNeeded: 1,
    },
  });

  const genderPreference = watch("genderPreference");

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

  const inputClass =
    "w-full pl-10 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400";
  const labelClass = "block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5";

  const genderOptions = [
    { value: "anyone", label: "Anyone" },
    { value: "men", label: "Men Only" },
    { value: "women", label: "Women Only" },
  ] as const;

  return (
    <div className="relative min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors overflow-hidden">
      <div className="pointer-events-none absolute -top-40 right-1/4 w-[500px] h-[500px] bg-brand-400/20 dark:bg-brand-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-40 w-[400px] h-[400px] bg-accent-400/15 dark:bg-accent-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-extrabold text-surface-900 dark:text-surface-50">
              Post a Ride Request
            </h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              Let other students know where you're headed
            </p>
          </div>
          <Link
            to="/dashboard"
            className="w-9 h-9 flex items-center justify-center rounded-full text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
          >
            <X className="w-5 h-5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-3xl border border-surface-200/60 dark:border-surface-800 shadow-xl shadow-surface-900/5 dark:shadow-none p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Route visual */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center pt-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                <div className="w-0.5 h-10 bg-gradient-to-b from-brand-500 to-accent-500 my-1" />
                <div className="w-2.5 h-2.5 rounded-full bg-accent-500" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className={labelClass}>Pickup Location</label>
                  <div className="relative">
                    <MapPin className={iconClass} />
                    <input {...register("pickup")} className={inputClass} placeholder="Thapar Main Gate" />
                  </div>
                  {errors.pickup && <p className="text-red-500 text-xs mt-1">{errors.pickup.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Destination</label>
                  <div className="relative">
                    <Navigation className={iconClass} />
                    <input {...register("destination")} className={inputClass} placeholder="Chandigarh Airport" />
                  </div>
                  {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Travel Date</label>
                <div className="relative">
                  <Calendar className={iconClass} />
                  <input type="date" {...register("travelDate")} className={inputClass} />
                </div>
                {errors.travelDate && <p className="text-red-500 text-xs mt-1">{errors.travelDate.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Travel Time</label>
                <div className="relative">
                  <Clock className={iconClass} />
                  <input type="time" {...register("travelTime")} className={inputClass} />
                </div>
                {errors.travelTime && <p className="text-red-500 text-xs mt-1">{errors.travelTime.message}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass}>People Needed</label>
              <div className="relative">
                <Users2 className={iconClass} />
                <input
                  type="number"
                  {...register("peopleNeeded")}
                  min={1}
                  max={10}
                  className={inputClass}
                />
              </div>
              {errors.peopleNeeded && <p className="text-red-500 text-xs mt-1">{errors.peopleNeeded.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Gender Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {genderOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium cursor-pointer transition ${
                      genderPreference === opt.value
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                        : "border-surface-300 dark:border-surface-700 text-surface-500 dark:text-surface-400 hover:border-surface-400"
                    }`}
                  >
                    <input type="radio" value={opt.value} {...register("genderPreference")} className="sr-only" />
                    <Heart className="w-3.5 h-3.5" />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Notes (optional)</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-surface-400" />
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="w-full pl-10 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400"
                  placeholder="e.g. 2 medium suitcases, leaving exactly at 5"
                />
              </div>
              {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>}
            </div>

            {createMutation.isError && (
              <p className="text-red-500 text-sm">
                {(createMutation.error as any)?.response?.data?.message || "Failed to create request"}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={createMutation.isPending}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm shadow-lg shadow-brand-500/25 transition"
            >
              {createMutation.isPending ? "Creating..." : "Create Ride Request"}
              {!createMutation.isPending && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}