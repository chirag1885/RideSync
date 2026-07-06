import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MapPinOff } from "lucide-react";
import Logo from "../components/Logo";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 overflow-hidden transition-colors">
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-brand-400/20 dark:bg-brand-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-accent-400/20 dark:bg-accent-600/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative text-center max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mb-6 shadow-lg shadow-brand-500/25">
          <MapPinOff className="w-9 h-9 text-white" />
        </div>

        <h1 className="text-3xl font-extrabold text-surface-900 dark:text-surface-50 mb-2">
          Looks like this route doesn't exist
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8">
          The page you're looking for might have moved, or the address is off by a letter.
        </p>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-brand-500/25 transition"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}