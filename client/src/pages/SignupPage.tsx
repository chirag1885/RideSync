import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, GraduationCap, Hash, Phone, ArrowRight } from "lucide-react";
import { signupApi } from "../lib/authApi";
import AuthLayout from "../components/AuthLayout";

const signupFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").regex(/@thapar\.edu$/, "Must be a Thapar college email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  branch: z.string().min(1, "Branch is required"),
  year: z.coerce.number().min(1).max(5),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type SignupFormInput = z.input<typeof signupFormSchema>;
type SignupFormValues = z.output<typeof signupFormSchema>;

export default function SignupPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupFormInput, any, SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
  });

  const signupMutation = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      navigate("/verify-otp", { state: { email: getValues("email") } });
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    signupMutation.mutate(data);
  };

  const inputClass =
    "w-full pl-10 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400";
  const labelClass = "block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5";

  return (
    <AuthLayout title="Create your account" subtitle="Only for Thapar University students">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <div className="relative">
            <User className={iconClass} />
            <input {...register("name")} className={inputClass} placeholder="Your name" />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass}>College Email</label>
          <div className="relative">
            <Mail className={iconClass} />
            <input {...register("email")} className={inputClass} placeholder="you@thapar.edu" />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <Lock className={iconClass} />
            <input type="password" {...register("password")} className={inputClass} placeholder="At least 6 characters" />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Branch</label>
            <div className="relative">
              <GraduationCap className={iconClass} />
              <input {...register("branch")} className={inputClass} placeholder="CSE" />
            </div>
            {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Year</label>
            <div className="relative">
              <Hash className={iconClass} />
              <input type="number" {...register("year")} className={inputClass} placeholder="2" />
            </div>
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Gender</label>
          <select
            {...register("gender")}
            className="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            defaultValue=""
          >
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Phone Number</label>
          <div className="relative">
            <Phone className={iconClass} />
            <input {...register("phone")} className={inputClass} placeholder="9876543210" />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {signupMutation.isError && (
          <p className="text-red-500 text-sm">
            {(signupMutation.error as any)?.response?.data?.message || "Signup failed"}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={signupMutation.isPending}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm shadow-lg shadow-brand-500/25 transition"
        >
          {signupMutation.isPending ? "Creating account..." : "Sign Up"}
          {!signupMutation.isPending && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </form>

      <p className="text-sm text-surface-500 dark:text-surface-400 mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}