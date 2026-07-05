import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { resetPasswordApi } from "../lib/authApi";
import AuthLayout from "../components/AuthLayout";

const resetPasswordSchema = z.object({
  otp: z.string().length(6, "Code must be exactly 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetMutation = useMutation({
    mutationFn: (values: ResetPasswordValues) => {
      if (!email) throw new Error("Missing email — please start over");
      return resetPasswordApi({ email, otp: values.otp, newPassword: values.newPassword });
    },
    onSuccess: () => navigate("/login"),
  });

  const onSubmit = (data: ResetPasswordValues) => {
    resetMutation.mutate(data);
  };

  if (!email) {
    return (
      <AuthLayout title="Session expired" subtitle="We couldn't find your reset request">
        <div className="text-center">
          <Link to="/forgot-password" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
            Start over
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle={`Enter the code sent to ${email}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Reset Code
          </label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              {...register("otp")}
              maxLength={6}
              className="w-full pl-10 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:tracking-normal placeholder:text-surface-400"
              placeholder="123456"
            />
          </div>
          {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="password"
              {...register("newPassword")}
              className="w-full pl-10 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400"
              placeholder="At least 6 characters"
            />
          </div>
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
        </div>

        {resetMutation.isError && (
          <p className="text-red-500 text-sm">
            {(resetMutation.error as any)?.response?.data?.message || "Reset failed"}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={resetMutation.isPending}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm shadow-lg shadow-brand-500/25 transition"
        >
          {resetMutation.isPending ? "Resetting..." : "Reset Password"}
          {!resetMutation.isPending && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </form>
    </AuthLayout>
  );
}