import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ShieldAlert, Save, Trash2 } from "lucide-react";
import { changePasswordApi, deleteAccountApi } from "../lib/authApi";
import { useAuth } from "../context/AuthContext";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      reset();
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccountApi,
    onSuccess: () => {
      logout();
      navigate("/login");
    },
  });

  const onSubmit = (data: ChangePasswordValues) => {
    changePasswordMutation.mutate(data);
  };

  const canDelete = deleteConfirmText === "DELETE";

  return (
    <div className="relative min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors overflow-hidden">
      <div className="pointer-events-none absolute -top-40 right-1/3 w-[500px] h-[500px] bg-brand-400/20 dark:bg-brand-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-xl mx-auto px-6 py-12">
        <h1 className="text-xl font-extrabold text-surface-900 dark:text-surface-50 mb-6">Settings</h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-3xl border border-surface-200/60 dark:border-surface-800 shadow-xl shadow-surface-900/5 dark:shadow-none p-8 mb-6"
        >
          <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-5 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Change Password
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                {...register("currentPassword")}
                className="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                {...register("newPassword")}
                className="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
            </div>

            {changePasswordMutation.isSuccess && (
              <p className="text-green-600 dark:text-green-400 text-sm">Password changed successfully!</p>
            )}
            {changePasswordMutation.isError && (
              <p className="text-red-500 text-sm">
                {(changePasswordMutation.error as any)?.response?.data?.message || "Failed to change password"}
              </p>
            )}

            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm shadow-lg shadow-brand-500/25 transition"
            >
              <Save className="w-4 h-4" />
              {changePasswordMutation.isPending ? "Saving..." : "Update Password"}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-red-50/50 dark:bg-red-500/5 backdrop-blur-xl rounded-3xl border border-red-200 dark:border-red-500/20 p-8"
        >
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
            Deleting your account is permanent. This removes your profile, ride requests, chats, and reviews.
            This cannot be undone.
          </p>

          <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5">
            Type <span className="font-bold">DELETE</span> to confirm
          </label>
          <input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            className="w-full rounded-xl border border-red-300 dark:border-red-500/30 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="DELETE"
          />

          {deleteAccountMutation.isError && (
            <p className="text-red-500 text-sm mb-3">Failed to delete account. Try again.</p>
          )}

          <button
            onClick={() => deleteAccountMutation.mutate()}
            disabled={!canDelete || deleteAccountMutation.isPending}
            className="w-full flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-2.5 text-sm transition"
          >
            <Trash2 className="w-4 h-4" />
            {deleteAccountMutation.isPending ? "Deleting..." : "Delete My Account"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}