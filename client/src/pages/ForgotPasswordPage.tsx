import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { forgotPasswordApi } from "../lib/authApi";
import AuthLayout from "../components/AuthLayout";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotMutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      navigate("/reset-password", { state: { email: getValues("email") } });
    },
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    forgotMutation.mutate(data);
  };

  return (
    <AuthLayout title="Forgot your password?" subtitle="We'll email you a code to reset it">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            College Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              {...register("email")}
              className="w-full pl-10 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400"
              placeholder="you@thapar.edu"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {forgotMutation.isSuccess && (
          <p className="text-green-600 dark:text-green-400 text-sm">
            If that email is registered, a reset code has been sent.
          </p>
        )}

        <motion.button
          type="submit"
          disabled={forgotMutation.isPending}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm shadow-lg shadow-brand-500/25 transition"
        >
          {forgotMutation.isPending ? "Sending..." : "Send Reset Code"}
          {!forgotMutation.isPending && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </form>

      <p className="text-sm text-surface-500 dark:text-surface-400 mt-6 text-center">
        Remembered it?{" "}
        <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
}