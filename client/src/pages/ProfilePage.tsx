import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { User, GraduationCap, Hash, Phone, FileText, Save, Star, MapPin, Calendar } from "lucide-react";
import { getProfileApi, updateProfileApi } from "../lib/userApi";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  branch: z.string().min(1, "Branch is required"),
  year: z.coerce.number().min(1).max(5),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
});

type ProfileFormInput = z.input<typeof profileFormSchema>;
type ProfileFormValues = z.output<typeof profileFormSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    if (data?.data?.user) {
      const u = data.data.user;
      reset({ name: u.name, branch: u.branch, year: u.year, phone: u.phone, bio: u.bio || "" });
    }
  }, [data, reset]);

  const updateMutation = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    updateMutation.mutate(values);
  };

  const inputClass =
    "w-full pl-10 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400";
  const labelClass = "block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5";

  const user = data?.data?.user;
  const fullName = user?.name || "";
  const initials = fullName
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <p className="text-surface-500 dark:text-surface-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors">
      {/* Cover banner */}
      <div className="h-56 bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 relative overflow-hidden flex items-center justify-center">
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl" />

        <motion.h2
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.06, delayChildren: 0.2 }}
          className="relative text-white text-5xl sm:text-6xl select-none"
          style={{ fontFamily: "var(--font-cursive)" }}
        >
          {fullName.split("").map((char: string, i: number) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35 }}
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h2>
      </div>

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Avatar overlapping the banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="-mt-16 mb-6 flex flex-col sm:flex-row sm:items-end gap-5"
        >
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-surface-50 dark:ring-surface-950 shrink-0">
            {initials}
          </div>

          <div className="pb-2">
            <h1 className="text-2xl font-extrabold text-surface-900 dark:text-surface-50">{user?.name}</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400">{user?.email}</p>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-2xl border border-surface-200/60 dark:border-surface-800 p-5 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
              <Star className="w-5 h-5 fill-amber-500" />
              <span className="text-xl font-bold text-surface-900 dark:text-surface-50">{user?.rating || "—"}</span>
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400">Rating</p>
          </div>
          <div className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-2xl border border-surface-200/60 dark:border-surface-800 p-5 text-center">
            <div className="flex items-center justify-center gap-1 text-brand-600 dark:text-brand-400 mb-1">
              <MapPin className="w-5 h-5" />
              <span className="text-xl font-bold text-surface-900 dark:text-surface-50">
                {user?.completedTrips || 0}
              </span>
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400">Trips Shared</p>
          </div>
          <div className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-2xl border border-surface-200/60 dark:border-surface-800 p-5 text-center">
            <div className="flex items-center justify-center gap-1 text-accent-500 mb-1">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400">Since {joinedDate}</p>
          </div>
        </motion.div>

        {/* Edit form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-3xl border border-surface-200/60 dark:border-surface-800 shadow-xl shadow-surface-900/5 dark:shadow-none p-8 mb-12"
        >
          <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-5">Edit Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <User className={iconClass} />
                <input {...register("name")} className={inputClass} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Branch</label>
                <div className="relative">
                  <GraduationCap className={iconClass} />
                  <input {...register("branch")} className={inputClass} />
                </div>
                {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <div className="relative">
                  <Hash className={iconClass} />
                  <input type="number" {...register("year")} className={inputClass} />
                </div>
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <Phone className={iconClass} />
                <input {...register("phone")} className={inputClass} />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Bio</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-surface-400" />
                <textarea
                  {...register("bio")}
                  rows={3}
                  className="w-full pl-10 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400"
                  placeholder="Tell others a bit about yourself"
                />
              </div>
              {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
            </div>

            {updateMutation.isSuccess && (
              <p className="text-green-600 dark:text-green-400 text-sm">Profile updated successfully!</p>
            )}
            {updateMutation.isError && (
              <p className="text-red-500 text-sm">
                {(updateMutation.error as any)?.response?.data?.message || "Update failed"}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={updateMutation.isPending}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm shadow-lg shadow-brand-500/25 transition"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}