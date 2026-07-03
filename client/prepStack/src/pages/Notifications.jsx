import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import { FaBell, FaStar, FaCalendarCheck, FaCheckDouble } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api/api";

const ICON_STYLES = {
  request: {
    icon: FaCalendarCheck,
    label: "Interview",
    color: "text-[#4C8EFF]",
    bg: "bg-[#4C8EFF]/15",
    border: "border-[#4C8EFF]/25",
  },
  review: {
    icon: FaStar,
    label: "Review",
    color: "text-amber-400",
    bg: "bg-amber-400/15",
    border: "border-amber-400/25",
  },
  default: {
    icon: FaBell,
    label: null,
    color: "text-slate-400",
    bg: "bg-white/10",
    border: "border-white/10",
  },
};

const getIconStyle = (type) => ICON_STYLES[type] || ICON_STYLES.default;

const NotificationSkeleton = () => (
  <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
    <div className="w-12 h-12 rounded-full bg-white/[0.06] animate-pulse shrink-0" />
    <div className="flex-1 space-y-2 pt-1">
      <div className="h-3.5 w-1/3 rounded bg-white/[0.06] animate-pulse" />
      <div className="h-3 w-2/3 rounded bg-white/[0.04] animate-pulse" />
    </div>
  </div>
);

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await fetchWithAuth("/notifications");
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetchWithAuth("/notifications/read-all", { method: "PUT" });
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await fetchWithAuth(`/notifications/${notif._id}/read`, {
          method: "PUT",
        });
        setNotifications(
          notifications.map((n) =>
            n._id === notif._id ? { ...n, read: true } : n,
          ),
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
    if (notif.link) navigate(notif.link);
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const visibleNotifications = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications;
  }, [notifications, filter]);

  return (
    <DashboardLayout>
      <DashboardContainer>
        {/* Full-width wrapper guarantees true centering regardless of the parent's own width */}
        <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col w-full max-w-4xl pt-8 mt-6 mb-16">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle,rgba(47,125,255,0.10),transparent_70%)]" />

            {/* Header */}
            <div className="relative flex justify-between items-start mb-10 gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2F7DFF]/15 border border-[#2F7DFF]/25 flex items-center justify-center shrink-0">
                  <FaBell className="text-[18px] text-[#4C8EFF]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <h1 className="text-[28px] font-semibold text-white tracking-tight leading-none">
                      Notifications
                    </h1>
                    {unreadCount > 0 && (
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4C8EFF] bg-[#4C8EFF]/15 border border-[#4C8EFF]/25 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4C8EFF]" />
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[14px] mt-0.5">
                    Stay updated on your interviews and account activity.
                  </p>
                </div>
              </div>

              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className={`flex items-center gap-2 text-[13px] font-medium px-4 py-2.5 rounded-xl border transition-colors shrink-0 mt-1 ${
                  unreadCount === 0
                    ? "text-slate-600 bg-white/[0.02] border-white/[0.06] cursor-not-allowed"
                    : "text-[#4C8EFF] hover:text-white bg-[#2F7DFF]/10 hover:bg-[#2F7DFF] border-[#2F7DFF]/25 hover:border-[#2F7DFF]"
                }`}
              >
                <FaCheckDouble /> Mark all as read
              </button>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 mb-8 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
              {[
                { key: "all", label: "All" },
                {
                  key: "unread",
                  label: `Unread${unreadCount ? ` (${unreadCount})` : ""}`,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                    filter === tab.key
                      ? "bg-[#2F7DFF] text-white shadow-[0_2px_10px_rgba(47,125,255,0.35)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <>
                  <NotificationSkeleton />
                  <NotificationSkeleton />
                  <NotificationSkeleton />
                </>
              ) : visibleNotifications.length === 0 ? (
                <div className="p-16 rounded-3xl text-center border border-white/[0.06] bg-white/[0.02] flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/[0.05] rounded-full flex items-center justify-center mb-4 border border-white/10">
                    <FaBell className="text-3xl text-slate-500" />
                  </div>
                  <h3 className="text-xl text-white font-semibold mb-2">
                    {filter === "unread"
                      ? "Nothing unread"
                      : "No notifications yet"}
                  </h3>
                  <p className="text-[14px] text-slate-400">
                    {filter === "unread"
                      ? "You've read everything so far."
                      : "Interview and account updates will show up here."}
                  </p>
                </div>
              ) : (
                visibleNotifications.map((notif) => {
                  const style = getIconStyle(notif.type);
                  const Icon = style.icon;
                  return (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`relative flex items-start gap-4 p-5 pl-6 rounded-2xl border transition-all cursor-pointer group overflow-hidden ${
                        notif.read
                          ? "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10"
                          : "bg-[#132038] border-[#2F7DFF]/40 hover:border-[#2F7DFF]/60 shadow-[0_4px_20px_rgba(47,125,255,0.12)]"
                      }`}
                    >
                      {/* Unread accent bar */}
                      {!notif.read && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#2F7DFF]" />
                      )}

                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${style.bg} ${style.border}`}
                      >
                        <Icon className={`text-[18px] ${style.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex justify-between items-start mb-1.5 gap-4">
                          <div className="flex items-center gap-2 min-w-0">
                            <h3
                              className={`text-[15px] font-semibold truncate ${
                                notif.read ? "text-slate-300" : "text-white"
                              }`}
                            >
                              {notif.title}
                            </h3>
                            {style.label && (
                              <span
                                className={`hidden sm:inline-block text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full shrink-0 ${style.bg} ${style.color} border ${style.border}`}
                              >
                                {style.label}
                              </span>
                            )}
                          </div>
                          <span className="text-[12px] text-slate-500 whitespace-nowrap shrink-0">
                            {timeAgo(notif.createdAt)}
                          </span>
                        </div>
                        <p
                          className={`text-[13px] leading-relaxed ${
                            notif.read ? "text-slate-500" : "text-slate-300"
                          }`}
                        >
                          {notif.message}
                        </p>
                      </div>

                      {/* Unread Glowing Dot */}
                      {!notif.read && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#4C8EFF] mt-2 shrink-0 shadow-[0_0_8px_rgba(76,142,255,0.6)]" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default Notifications;