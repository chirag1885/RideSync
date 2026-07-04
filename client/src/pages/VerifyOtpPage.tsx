import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyOtpApi } from "../lib/authApi";

const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const verifyMutation = useMutation({
    mutationFn: (otp: string) => {
      if (!email) throw new Error("Missing email — please sign up again");
      return verifyOtpApi({ email, otp });
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  const onSubmit = (data: VerifyOtpValues) => {
    verifyMutation.mutate(data.otp);
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-gray-700 mb-4">No email found. Please sign up again.</p>
          <Link to="/signup" className="text-purple-600 font-medium hover:underline">
            Go to Signup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify your email</h1>
        <p className="text-sm text-gray-500 mb-6">
          We sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
            <input
              {...register("otp")}
              maxLength={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="123456"
            />
            {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
          </div>

          {verifyMutation.isError && (
            <p className="text-red-500 text-sm">
              {(verifyMutation.error as any)?.response?.data?.message || "Verification failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={verifyMutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition"
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
}