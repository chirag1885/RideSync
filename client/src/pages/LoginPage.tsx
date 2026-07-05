import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { loginApi } from "../lib/authApi";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      const { token, user } = response.data;
      login(token, user);
      navigate("/dashboard");
    },
  });

  const onSubmit = (data: LoginValues) => {
    loginMutation.mutate(data);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to find your next shared ride">
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

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="password"
              {...register("password")}
              className="w-full pl-10 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-surface-400"
              placeholder="Your password"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {loginMutation.isError && (
          <p className="text-red-500 text-sm">
            {(loginMutation.error as any)?.response?.data?.message || "Login failed"}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={loginMutation.isPending}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm shadow-lg shadow-brand-500/25 transition"
        >
          {loginMutation.isPending ? "Logging in..." : "Log In"}
          {!loginMutation.isPending && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </form>

      <p className="text-sm text-surface-500 dark:text-surface-400 mt-6 text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}