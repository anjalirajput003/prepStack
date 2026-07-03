import {
  FaHome,
  FaThLarge,
  FaHistory,
  FaUserTie,
  FaTrophy,
  FaComments,
  FaUser,
  FaBars,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext"; 

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 2. SETUP SOCKET & STATE
  const socket = useSocket();
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // 3. LISTEN FOR NEW MESSAGES
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      setHasUnreadMessages(true);
    };

    socket.on("receive-direct-message", handleNewMessage);

    return () => {
      socket.off("receive-direct-message", handleNewMessage);
    };
  }, [socket]);

  return (
    <aside
      className={`glass-sidebar ${isOpen ? "w-[160px]" : "w-[80px]"} h-screen shrink-0 transition-all duration-300 flex flex-col border-r border-white/5`}
    >
      <div
        className={`h-24 flex items-center ${isOpen ? "px-5" : "justify-center"}`}
      >
        <button
          onClick={toggleSidebar}
          className={`w-12 h-12 glass-panel rounded-xl flex items-center justify-center hover:bg-white/10 transition-all ${isOpen ? "ml-2" : ""}`}
        >
          <FaBars className="text-slate-300" />
        </button>
      </div>

      <div
        className={`pt-6 flex flex-col gap-2 ${isOpen ? "px-3" : "items-center"}`}
      >
        <SidebarButton
          icon={<FaHome />}
          text="Home"
          isOpen={isOpen}
          active={location.pathname === "/"}
          onClick={() => navigate("/")}
        />

        <SidebarButton
          icon={<FaThLarge />}
          text="Dashboard"
          isOpen={isOpen}
          active={location.pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        />

        <SidebarButton
          icon={<FaHistory />}
          text="History"
          isOpen={isOpen}
          active={location.pathname === "/history"}
          onClick={() => navigate("/history")}
        />

        <SidebarButton
          icon={<FaUserTie />}
          text="Interviewers"
          isOpen={isOpen}
          active={location.pathname === "/interviewers-list"}
          onClick={() => navigate("/interviewers-list")}
        />

        <SidebarButton
          icon={<FaTrophy />}
          text="Leaderboard"
          isOpen={isOpen}
          active={location.pathname === "/leaderboard"}
          onClick={() => navigate("/leaderboard")}
        />

        {/* 4. PASS BADGE STATE TO MESSAGES BUTTON */}
        <SidebarButton
          icon={<FaComments />}
          text="Messages"
          isOpen={isOpen}
          active={location.pathname === "/messages"}
          hasBadge={hasUnreadMessages}
          onClick={() => {
            setHasUnreadMessages(false); 
            navigate("/messages"); 
          }}
        />

        <SidebarButton
          icon={<FaUser />}
          text="Profile"
          isOpen={isOpen}
          active={location.pathname === "/profile"}
          onClick={() => navigate("/profile")}
        />
      </div>
    </aside>
  );
}

// 5. ADD BADGE UI TO THE BUTTON COMPONENT
function SidebarButton({
  icon,
  text,
  isOpen,
  active = false,
  onClick,
  hasBadge = false,
}) {
  return (
    <button
      onClick={onClick}
      className={`relative h-12 transition-all duration-300 flex items-center rounded-xl 
        ${isOpen ? "w-full px-5 gap-4 justify-start" : "w-12 h-12 justify-center"}
        ${active ? "bg-[#2B66FF]/20 text-white border border-[#4F8CFF]/20" : "text-slate-300 hover:bg-white/5"}`}
    >
      <span className="text-[20px]">{icon}</span>
      {isOpen && <span className="font-medium whitespace-nowrap">{text}</span>}

      {/* The Red Notification Dot */}
      {hasBadge && (
        <span
          className={`absolute rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse 
          ${isOpen ? "w-2 h-2 top-1/2 -translate-y-1/2 right-4" : "w-2.5 h-2.5 top-2 right-2 border-2 border-[#0b1221]"}`}
        />
      )}
    </button>
  );
}

export default Sidebar;