import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Users, MessageCircleHeart, Wallet, ArrowRight, MapPin } from "lucide-react";
import Logo from "../components/Logo";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified students only",
    description: "Every account is verified with a Thapar college email. No strangers, no spam.",
  },
  {
    icon: Users,
    title: "Find your travel match",
    description: "Post where you're headed, or browse who's already going your way — filter by date, gender preference, and more.",
  },
  {
    icon: MessageCircleHeart,
    title: "Chat only after you agree",
    description: "Private chat unlocks only once both sides accept. No noise until there's a real match.",
  },
  {
    icon: Wallet,
    title: "You book the cab",
    description: "RideSync just helps you connect. Booking, payment, and the ride itself happens outside the app.",
  },
];

const steps = [
  { step: "01", title: "Post or browse", description: "Create a ride request, or search for someone already headed your way." },
  { step: "02", title: "Send interest", description: "Found a match? Tap \"I'm Interested\" and add a quick note." },
  { step: "03", title: "Get accepted", description: "The creator accepts, and a private chat unlocks instantly." },
  { step: "04", title: "Book together", description: "Chat, decide who books the Uber, and share the ride." },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors overflow-hidden">
      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400">
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white text-sm font-semibold rounded-full px-5 py-2 shadow-md shadow-brand-500/25 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-400/25 dark:bg-brand-600/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-20 w-80 h-80 bg-accent-400/20 dark:bg-accent-600/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-1.5 bg-white/70 dark:bg-surface-900/70 backdrop-blur border border-surface-200/60 dark:border-surface-800 rounded-full px-4 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-300 mb-6">
            <MapPin className="w-3 h-3 text-brand-500" />
            Built for Thapar University students
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-surface-900 dark:text-surface-50 leading-tight">
            Never post <span className="text-brand-600 dark:text-brand-400">"anyone going to Chandigarh?"</span> on WhatsApp again.
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-5 text-lg max-w-xl mx-auto">
            RideSync connects students heading the same way, at the same time — so you can share a cab, split the fare, and skip the messy group chats.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <Link
              to="/signup"
              className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg shadow-brand-500/25 transition"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="text-surface-700 dark:text-surface-300 font-semibold px-6 py-3 hover:text-brand-600 dark:hover:text-brand-400 transition"
            >
              I have an account
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="relative max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-2xl border border-surface-200/60 dark:border-surface-800 shadow-sm p-6"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mb-4 shadow-md shadow-brand-500/20">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-surface-900 dark:text-surface-50 mb-1.5">{f.title}</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="relative max-w-4xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-extrabold text-surface-900 dark:text-surface-50 text-center mb-10"
        >
          How it works
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              <span className="text-4xl font-extrabold text-brand-500/20 dark:text-brand-400/20">{s.step}</span>
              <h3 className="font-bold text-surface-900 dark:text-surface-50 mt-1">{s.title}</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative max-w-3xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 rounded-3xl p-10 text-center relative overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <h2 className="text-2xl font-extrabold text-white mb-2">Ready to find your ride?</h2>
          <p className="text-brand-100 mb-6">Join students already sharing cabs across Thapar, right now.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 bg-white text-brand-700 font-semibold rounded-xl px-6 py-3 hover:bg-brand-50 transition"
          >
            Sign Up Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <footer className="relative text-center pb-8 text-xs text-surface-400 dark:text-surface-500">
        © 2026 RideSync — Built by Chirag Gupta
      </footer>
    </div>
  );
}