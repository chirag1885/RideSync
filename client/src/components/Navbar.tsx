import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getMyNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi } from "../lib/notificationApi";

interface NotificationData {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  relatedRideRequest?: string;
  createdAt: string;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
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

  const handleNotificationClick = (n: NotificationData) => {
    if (!n.isRead) {
      markReadMutation.mutate(n._id);
    }
    setIsOpen(false);
    if (n.relatedRideRequest) {
      navigate(`/ride-requests/${n.relatedRideRequest}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="font-bold text-gray-900">
          RideSync
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/create-request" className="text-sm text-gray-600 hover:text-purple-600">
            Create Request
          </Link>
          <Link to="/my-requests" className="text-sm text-gray-600 hover:text-purple-600">
            My Requests
          </Link>
          <Link to="/chats" className="text-sm text-gray-600 hover:text-purple-600">
            Chats
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="relative text-gray-600 hover:text-purple-600"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center p-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Notifications</p>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllReadMutation.mutate()}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 p-4 text-center">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`block w-full text-left p-3 text-sm border-b border-gray-50 hover:bg-gray-50 ${
                        !n.isRead ? "bg-purple-50" : ""
                      }`}
                    >
                      <p className="text-gray-900">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
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
              </div>
            )}
          </div>

          <Link to="/profile" className="text-sm text-gray-600 hover:text-purple-600">
            Profile
          </Link>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}