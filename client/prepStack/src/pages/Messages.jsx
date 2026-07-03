import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import DirectMessage from "../components/DirectMessage";
import { useSocket } from "../context/SocketContext";
import { fetchWithAuth } from "../api/api";

const ROLE_STYLES = {
  interviewer: "bg-[#2F7DFF]/15 text-[#7DAEFF]",
  candidate: "bg-emerald-500/15 text-emerald-300",
  default: "bg-white/10 text-slate-400",
};

const getRoleStyle = (role) => {
  if (!role) return ROLE_STYLES.default;
  return ROLE_STYLES[role.toLowerCase()] || ROLE_STYLES.default;
};

const formatTimestamp = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  const diffDays = Math.round((now - date) / 86400000);
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const ContactSkeleton = () => (
  <div className="flex items-center gap-3 p-4 border-b border-white/[0.03]">
    <div className="w-11 h-11 rounded-full bg-white/[0.06] animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-2/3 rounded bg-white/[0.06] animate-pulse" />
      <div className="h-2.5 w-1/3 rounded bg-white/[0.04] animate-pulse" />
    </div>
  </div>
);

const Messages = () => {
  const socket = useSocket();
  const location = useLocation();
  const newContact = location.state?.newContact;

  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const convData = await fetchWithAuth("/conversations");
        const userData = await fetchWithAuth("/profile");

        let updatedConvs = [...convData];

        // If we came from a profile page, ensure they are in the sidebar!
        if (newContact) {
          const exists = updatedConvs.find((c) => c._id === newContact._id);
          if (!exists) {
            updatedConvs = [newContact, ...updatedConvs]; // Add to top
          }
          setActiveContact(exists || newContact); // Auto-open their chat
          setShowChatOnMobile(true);
        }

        setConversations(updatedConvs);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [newContact?._id]);

  const filteredConversations = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.trim().toLowerCase();
    return conversations.filter((c) => c.name?.toLowerCase().includes(q));
  }, [conversations, query]);

  const handleSelectContact = (contact) => {
    if (activeContact && activeContact._id === contact._id) {
      setActiveContact(null);
      setShowChatOnMobile(false);
    } else {
      setActiveContact(contact);
      setShowChatOnMobile(true);
    }
  };

  return (
    <DashboardLayout>
      <DashboardContainer>
        {/* items-center reliably centers the panel even if the parent's
            own width/flex setup makes a plain mx-auto unreliable */}
        <div className="w-full flex flex-col items-center min-h-[85vh] h-full pb-8 font-sans">
          <div className="w-full max-w-6xl flex-1 flex flex-col">
            <div className="mb-6 mt-2">
              <h1 className="text-[28px] font-bold text-white tracking-tight">
                Inbox
              </h1>
              <p className="text-slate-500 text-[13px] mt-1">
                Conversations with your interviewers and candidates
              </p>
            </div>

            {/* Dual-Pane Layout */}
            <div className="flex-1 flex bg-[#0c1628] border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl">
              {/* ── LEFT PANE: Contacts List ── */}
              <div
                className={`w-full sm:w-[320px] sm:flex border-r border-white/[0.07] flex-col bg-[#070b14] ${
                  showChatOnMobile ? "hidden" : "flex"
                }`}
              >
                <div className="p-5 border-b border-white/[0.07] space-y-3">
                  <h2 className="text-white font-semibold">
                    Recent Conversations
                  </h2>
                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-[#2F7DFF]/60 focus-within:border-[#2F7DFF]/60 transition-colors">
                    <svg
                      className="w-4 h-4 text-slate-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search conversations"
                      className="flex-1 min-w-0 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <ContactSkeleton key={i} />
                      ))}
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center text-center px-6 py-12">
                      <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mb-3">
                        <svg
                          className="w-6 h-6 text-slate-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-400 text-[14px] font-medium">
                        {query ? "No matches" : "No messages yet"}
                      </p>
                      <p className="text-slate-600 text-[12px] mt-1 max-w-[200px]">
                        {query
                          ? "Try a different name."
                          : "Conversations with interviewers will appear here."}
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((contact) => {
                      const isActive = activeContact?._id === contact._id;
                      const timestamp = formatTimestamp(
                        contact.lastMessage?.createdAt || contact.updatedAt,
                      );
                      return (
                        <button
                          key={contact._id}
                          onClick={() => handleSelectContact(contact)}
                          className={`w-full flex items-center gap-3 p-4 border-b border-white/[0.03] transition-all text-left ${
                            isActive
                              ? "bg-[#2F7DFF]/15 border-l-4 border-l-[#2F7DFF]"
                              : "hover:bg-white/[0.025] border-l-4 border-l-transparent"
                          }`}
                        >
                          <div className="relative shrink-0">
                            <img
                              src={
                                contact.profilePicture ||
                                `https://ui-avatars.com/api/?name=${contact.name}&background=2F7DFF&color=fff`
                              }
                              alt={contact.name}
                              className="w-11 h-11 rounded-full object-cover border border-white/10"
                            />
                            {contact.isOnline && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#070b14]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-white font-medium text-[15px] truncate">
                                {contact.name}
                              </p>
                              {timestamp && (
                                <span className="text-slate-600 text-[11px] shrink-0 tabular-nums">
                                  {timestamp}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-1">
                              {contact.lastMessage?.text ? (
                                <p className="text-slate-500 text-[12.5px] truncate">
                                  {contact.lastMessage.text}
                                </p>
                              ) : (
                                <span
                                  className={`inline-block px-1.5 py-0.5 rounded text-[11px] capitalize ${getRoleStyle(
                                    contact.role,
                                  )}`}
                                >
                                  {contact.role || "User"}
                                </span>
                              )}
                              {contact.unreadCount > 0 && (
                                <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#2F7DFF] text-white text-[10px] font-semibold flex items-center justify-center">
                                  {contact.unreadCount > 9
                                    ? "9+"
                                    : contact.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ── RIGHT PANE: Active Chat ── */}
              <div
                className={`flex-1 bg-[#0b1221] flex-col relative ${
                  showChatOnMobile ? "flex" : "hidden sm:flex"
                }`}
              >
                {activeContact && currentUser ? (
                  <div className="absolute inset-0 flex flex-col">
                    <button
                      onClick={() => setShowChatOnMobile(false)}
                      className="sm:hidden flex items-center gap-2 px-4 py-3 border-b border-white/[0.07] text-slate-400 text-[13px] shrink-0"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back to conversations
                    </button>
                    {/* min-h-0 lets DirectMessage's own h-full behave inside this flex column */}
                    <div className="flex-1 min-h-0">
                      <DirectMessage
                        socket={socket}
                        currentUser={currentUser}
                        profileUserId={activeContact._id}
                        contact={activeContact}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 px-6">
                    <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        ></path>
                      </svg>
                    </div>
                    <p className="font-medium text-[15px] text-center">
                      Select a conversation to start messaging
                    </p>
                    <p className="text-slate-600 text-[12.5px] mt-1 text-center max-w-[240px]">
                      Pick someone from the list to pick up where you left off.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default Messages;
