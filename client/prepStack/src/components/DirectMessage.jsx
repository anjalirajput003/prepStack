import React, { useState, useEffect, useRef } from "react";
import { fetchWithAuth } from "../api/api";

const formatMessageTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const formatDayLabel = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "long", day: "numeric" });
};

const MessageSkeleton = () => (
  <div className="flex flex-col gap-3 px-1 py-2">
    <div className="h-9 w-1/2 rounded-2xl bg-white/[0.05] animate-pulse self-start" />
    <div className="h-9 w-2/5 rounded-2xl bg-white/[0.05] animate-pulse self-end" />
    <div className="h-9 w-1/3 rounded-2xl bg-white/[0.05] animate-pulse self-start" />
  </div>
);

const SendIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const DirectMessage = ({ socket, currentUser, profileUserId, contact }) => {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const scrollAnchorRef = useRef(null);

  // 1. Fetch history when chat opens
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const data = await fetchWithAuth(`/messages/${profileUserId}`);
        setMessages(data);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    if (profileUserId) fetchHistory();
  }, [profileUserId]);

  // 2. Receive live messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMsg = (newMsg) => {
      if (
        newMsg.senderId === profileUserId ||
        newMsg.receiverId === profileUserId
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    socket.on("receive-direct-message", handleReceiveMsg);
    socket.on("message-sent-success", handleReceiveMsg);

    return () => {
      socket.off("receive-direct-message", handleReceiveMsg);
      socket.off("message-sent-success", handleReceiveMsg);
    };
  }, [socket, profileUserId]);

  // Keep the latest message in view
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, profileUserId]);

  // 3. Send message
  const sendDM = () => {
    if (!textInput.trim()) return;

    if (!socket || !currentUser) {
      alert(
        "Chat server is not connected. Please refresh or check your login.",
      );
      console.error("Socket is null!");
      return;
    }

    socket.emit("send-direct-message", {
      senderId: currentUser._id,
      receiverId: profileUserId,
      text: textInput,
    });

    setTextInput("");
  };

  const contactName = contact?.name || "this conversation";
  const contactAvatar =
    contact?.profilePicture ||
    (contact?.name &&
      `https://ui-avatars.com/api/?name=${contact.name}&background=2F7DFF&color=fff`);

  return (
    <div className="flex flex-col h-full w-full bg-transparent font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#070b14] border-b border-white/[0.07] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {contactAvatar ? (
            <img
              src={contactAvatar}
              alt={contact.name}
              className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 shrink-0" />
          )}
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-[14px] truncate">
              {contact?.name || "Live Chat"}
            </h3>
            {contact?.role && (
              <p className="text-slate-500 text-[11.5px] capitalize truncate">
                {contact.role}
              </p>
            )}
          </div>
        </div>
  
        {typeof contact?.isOnline === "boolean" && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 shrink-0">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                contact.isOnline
                  ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                  : "bg-slate-600"
              }`}
            />
            {contact.isOnline ? "Online" : "Offline"}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
        {isLoadingHistory ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
            <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 opacity-50"
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
            <p className="text-[13.5px] font-medium text-slate-400">
              No messages yet
            </p>
            <p className="text-[12px] text-slate-600 mt-1 max-w-[200px]">
              Say hello to {contactName} to start the conversation.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.senderId === currentUser._id;
            const prevMsg = messages[index - 1];
            const nextMsg = messages[index + 1];
            const startsGroup = !prevMsg || prevMsg.senderId !== msg.senderId;
            const endsGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
            const dayLabel = formatDayLabel(msg.createdAt);
            const prevDayLabel = formatDayLabel(prevMsg?.createdAt);
            const showDayDivider = dayLabel && dayLabel !== prevDayLabel;

            return (
              <React.Fragment key={msg._id || msg.id || index}>
                {showDayDivider && (
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span className="text-[11px] text-slate-600 shrink-0">
                      {dayLabel}
                    </span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>
                )}
                <div
                  className={`flex items-end gap-2 max-w-[75%] ${
                    isMine ? "self-end flex-row-reverse" : "self-start"
                  } ${startsGroup ? "mt-3" : "mt-0.5"}`}
                >
                  {!isMine && (
                    <div className="w-6 h-6 shrink-0">
                      {endsGroup &&
                        (contactAvatar ? (
                          <img
                            src={contactAvatar}
                            alt={contact?.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/10" />
                        ))}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div
                      className={`px-3.5 py-2 text-[13.5px] leading-snug break-words rounded-2xl ${
                        isMine
                          ? `bg-[#2F7DFF] text-white ${endsGroup ? "rounded-br-md" : ""}`
                          : `bg-white/[0.07] text-slate-200 ${endsGroup ? "rounded-bl-md" : ""}`
                      }`}
                    >
                      {msg.text}
                    </div>
                    {endsGroup && formatMessageTime(msg.createdAt) && (
                      <p
                        className={`text-[10.5px] text-slate-600 mt-1 ${
                          isMine ? "text-right" : "text-left"
                        }`}
                      >
                        {formatMessageTime(msg.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={scrollAnchorRef} />
      </div>

      {/* Composer */}
      <div className="p-3 bg-[#070b14] border-t border-white/[0.07] flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendDM()}
          placeholder="Type a message..."
          className="flex-1 bg-white/[0.05] border border-white/10 rounded-full px-4 py-2.5 text-[13.5px] text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#2F7DFF]/60 focus:border-[#2F7DFF]/60 transition-colors"
        />
        <button
          onClick={sendDM}
          disabled={!textInput.trim()}
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            textInput.trim()
              ? "bg-[#2F7DFF] text-white hover:bg-[#2F7DFF]/90"
              : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
          }`}
        >
          <SendIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DirectMessage;
