import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MessageCircleHeart, Wallet, Users } from "lucide-react";
import Logo from "./Logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const features = [
  {
    icon: ShieldCheck,
    title: "Verified students only",
    description: "Every account is verified with a Thapar college email — no strangers, ever.",
  },
  {
    icon: Users,
    title: "Find your travel match",
    description: "Post where you're headed, or browse who's already going your way.",
  },
  {
    icon: MessageCircleHeart,
    title: "Chat only after you agree",
    description: "Private chat unlocks only once both sides accept — no spam, no noise.",
  },
  {
    icon: Wallet,
    title: "You book the cab",
    description: "We just help you connect. Booking, payment, and the ride itself is up to you.",
  },
];

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950 transition-colors">
      {/* Left panel — marketing / how it works */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 p-12 flex-col justify-between">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="[&_span]:text-white [&_span_span]:text-brand-200">
            <Logo size="md" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-10 leading-tight">
            Never post "anyone going to Chandigarh?" on WhatsApp again.
          </h2>
          <p className="text-brand-100 mt-3 text-sm">
            RideSync connects Thapar students heading the same way, at the same time.
          </p>
        </motion.div>

        <div className="relative space-y-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 shrink-0 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{f.title}</p>
                <p className="text-brand-100 text-sm mt-0.5">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="relative text-brand-200 text-xs">© 2026 RideSync — Built by Chirag Gupta.</p>
      </div>

      {/* Right panel — the actual form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 bg-brand-400/15 dark:bg-brand-600/10 rounded-full blur-3xl lg:hidden" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-md"
        >
          <div className="flex justify-center mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <h1 className="text-2xl font-extrabold text-surface-900 dark:text-surface-50 mb-1">{title}</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">{subtitle}</p>

          {children}
        </motion.div>
      </div>
    </div>
  );
}