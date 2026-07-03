import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCommentDots,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaPaperPlane,
  FaInbox,
  FaSearch,
} from "react-icons/fa";
import Logo from "./Logo";
import { fetchWithAuth } from "../api/api";
import { useSocket } from "../context/SocketContext";
import { useToast } from "../context/ToastContext";

function Topbar({ user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Simulated Notification Count (You can wire this to your backend later)
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const socket = useSocket();

  // 1. Fetch initial unread count on load
  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const data = await fetchWithAuth("/notifications");
        // Count how many notifications have read: false
        const unread = data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to fetch notifications for topbar:", err);
      }
    }
    fetchUnreadCount();
  }, []);

  // 2. Listen for real-time notifications via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      // Increase the badge count by 1 instantly
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [socket]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live Search Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const data = await fetchWithAuth(
            `/users/search?query=${searchQuery}`,
          );
          setSearchResults(data || []);
          setShowSearchResults(true);
        } catch (err) {
          console.error("Search failed:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function getInitials(name) {
    if (!name || typeof name !== "string") return "U";
    const words = name.trim().split(" ");
    if (words.length === 0 || words[0] === "") return "U";
    return words
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function handleUserClick(userId) {
    setShowSearchResults(false);
    setSearchQuery("");
    navigate(`/interviewers/${userId}`);
  }

  return (
    <header className="h-16 border-b border-white/5 px-10 flex items-center justify-between shrink-0">
      {/* Left Side: Logo & Live Search */}
      <div className="flex items-center gap-8">
        <Logo />

        {/* Global Live Search Bar */}
        <div
          className="hidden md:flex relative left-38 items-center w-72"
          ref={searchRef}
        >
          {/* <FaSearch className="absolute left-4 text-slate-500 text-[13px] pointer-events-none z-10" /> */}

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim().length > 0) setShowSearchResults(true);
            }}
            placeholder="Search users..."
            className="bg-[#0d1625] border border-white/10 rounded-full h-9 pl-11 pr-4 text-[13px] text-white placeholder-slate-500 outline-none w-full hover:border-white/20 transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
          />
          {/* Live Search Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full mt-2 left-0 w-full bg-[#0d1625] border border-white/10 rounded-xl shadow-2xl py-2 z-50 flex flex-col max-h-[300px] overflow-y-auto">
              {isSearching ? (
                <div className="px-4 py-3 text-[12px] text-slate-500 text-center font-medium">
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((resultUser) => (
                  <button
                    key={resultUser._id}
                    onClick={() => handleUserClick(resultUser._id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left group"
                  >
                    {resultUser.profilePicture ? (
                      <img
                        src={resultUser.profilePicture}
                        alt={resultUser.name}
                        className="w-8 h-8 rounded-full object-cover bg-[#0b1221]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0">
                        {getInitials(resultUser.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white truncate group-hover:text-[#4C8EFF] transition-colors">
                        {resultUser.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate capitalize">
                        {resultUser.role}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-[12px] text-slate-500 text-center font-medium">
                  No users found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications Shortcut (Bell Icon with Numbered Badge) */}
        <IconButton onClick={() => navigate("/notifications")}>
          <FaBell className="text-slate-400 hover:text-white transition-colors text-[15px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full border-2 border-[#060a18]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </IconButton>

        {/* Messages Shortcut (Chat Icon) */}
        <IconButton onClick={() => navigate("/messages")}>
          <FaCommentDots className="text-slate-400 hover:text-white transition-colors text-[15px]" />
        </IconButton>

        <div className="w-px h-5 bg-white/15 mx-1.5" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-xl hover:bg-white/5 transition-colors group"
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user?.name || "User"}
                className="w-8 h-8 rounded-full object-cover border border-white/10 bg-[#0b1221]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[11px] font-semibold text-blue-400 flex-shrink-0">
                {getInitials(user?.name)}
              </div>
            )}

            <span className="hidden md:block text-[13px] font-medium text-slate-300 group-hover:text-white transition-colors max-w-[120px] truncate">
              {user?.name || "Account"}
            </span>

            <svg
              className={`text-slate-500 text-[10px] w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0d1625] border border-white/10 rounded-xl shadow-2xl py-2 z-50 flex flex-col">
              <div className="px-4 py-2.5 border-b border-white/5 mb-1">
                <p className="text-[13px] font-semibold text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || ""}
                </p>
              </div>

              <DropdownItem
                icon={<FaUser className="text-[12px]" />}
                label="Profile"
                onClick={() => {
                  navigate("/profile");
                  setDropdownOpen(false);
                }}
              />

              <DropdownItem
                icon={<FaPaperPlane className="text-[12px]" />}
                label="My Requests"
                onClick={() => {
                  navigate("/my-requests");
                  setDropdownOpen(false);
                }}
              />

              <DropdownItem
                icon={<FaInbox className="text-[12px]" />}
                label="Received Requests"
                onClick={() => {
                  navigate("/received-requests");
                  setDropdownOpen(false);
                }}
              />

              <div className="my-1 border-t border-white/5" />

              <DropdownItem
                icon={<FaSignOutAlt className="text-[12px]" />}
                label="Log out"
                onClick={handleLogout}
                danger
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function IconButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors relative"
    >
      {children}
    </button>
  );
}

function DropdownItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium transition-colors text-left
        ${
          danger
            ? "text-rose-400 hover:bg-rose-500/10"
            : "text-slate-300 hover:text-white hover:bg-white/5"
        }`}
    >
      <span className={danger ? "text-rose-400" : "text-slate-500"}>
        {icon}
      </span>
      {label}
    </button>
  );
}

export default Topbar;

