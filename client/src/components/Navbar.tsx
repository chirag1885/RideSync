import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Moon, Sun, LogOut, MessageCircle, Inbox, Plus, User, Menu, X, Settings, Compass } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi } from "../lib/notificationApi";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";

interface NotificationData {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  relatedRideRequest?: string;
  createdAt: string;
}

const navLinks = [
  { to: "/dashboard", label: "Explore", icon: Compass },
  { to: "/my-requests", label: "My Requests", icon: Inbox },
  { to: "/chats", label: "Chats", icon: MessageCircle },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotificationsApi,
    refetchInterval: 8000,
  });

  const notifications: NotificationData[] = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  const markReadMutation = useMutation({
    mutationFn: markNotificationReadApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsReadApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNotificationClick = (n: NotificationData) => {
    if (!n.isRead) markReadMutation.mutate(n._id);
    setIsOpen(false);
    if (n.relatedRideRequest) navigate(`/ride-requests/${n.relatedRideRequest}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-20 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200/70 dark:border-surface-800 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/dashboard" className="shrink-0">
            <Logo size="sm" />
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-surface-100 dark:bg-surface-900 rounded-full p-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-brand-600 rounded-full -z-10"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/create-request"
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white text-sm font-semibold rounded-full px-4 py-2 shadow-md shadow-brand-500/25 transition"
            >
              <Plus className="w-4 h-4" />
              New Request
            </Link>

            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-accent-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-80 max-w-[90vw] bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-xl max-h-96 overflow-y-auto"
                  >
                    <div className="flex justify-between items-center p-4 border-b border-surface-100 dark:border-surface-800">
                      <p className="text-sm font-semibold text-surface-900 dark:text-surface-50">Notifications</p>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllReadMutation.mutate()}
                          className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-sm text-surface-500 dark:text-surface-400 p-6 text-center">
                        No notifications yet
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n._id}
                          onClick={() => handleNotificationClick(n)}
                          className={`block w-full text-left p-4 text-sm border-b border-surface-50 dark:border-surface-800 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors ${
                            !n.isRead ? "bg-brand-50 dark:bg-brand-500/10" : ""
                          }`}
                        >
                          <p className="text-surface-900 dark:text-surface-50">{n.message}</p>
                          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                            {new Date(n.createdAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/profile"
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={handleLogout}
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex md:hidden w-10 h-10 items-center justify-center rounded-full text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-600 text-white"
                        : "text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
              <Link
                to="/create-request"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <Plus className="w-4 h-4" />
                New Request
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}