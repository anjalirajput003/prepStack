import React, { useRef, useEffect } from "react";
import { FaPaperPlane, FaCommentDots } from "react-icons/fa";

const ChatSection = ({
  messages,
  messageInput,
  setMessageInput,
  handleSendMessage,
}) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b1221]">
      <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
        <FaCommentDots className="text-slate-500 text-[11px]" />
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Session Chat
        </span>
        {messages.length > 0 && (
          <span className="ml-auto text-[10px] font-semibold text-slate-500 bg-white/[0.06] rounded-full px-2 py-0.5">
            {messages.length}
          </span>
        )}
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-6">
            <FaCommentDots className="text-slate-700 text-2xl" />
            <p className="text-slate-500 text-[13px]">
              No messages yet. Say hello to get started.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === "me";
            return (
              <div
                key={index}
                className={`flex items-end gap-2 iv-msg-in ${
                  isMe ? "flex-row-reverse" : ""
                }`}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isMe
                      ? "bg-[#5B8DEF]/20 text-[#8FB2FF]"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {isMe ? "Y" : "P"}
                </span>
                <div
                  className={`px-3.5 py-2 rounded-2xl max-w-[78%] text-[13.5px] leading-relaxed break-words ${
                    isMe
                      ? "bg-[#5B8DEF] text-white rounded-br-md"
                      : "bg-white/[0.07] text-slate-200 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#0e1526] border-t border-white/[0.06]">
        <div className="flex items-end gap-2">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            className="flex-1 bg-[#080e1a] border border-white/10 rounded-xl px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-slate-500 focus:border-[#5B8DEF]/60 focus:ring-1 focus:ring-[#5B8DEF]/30 outline-none resize-none min-h-[42px] max-h-[110px] transition-colors"
            rows="1"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="w-10 h-10 shrink-0 rounded-xl bg-[#5B8DEF] hover:bg-[#6F9CF5] disabled:bg-white/5 disabled:text-slate-600 text-white flex items-center justify-center transition-all active:scale-95"
          >
            <FaPaperPlane className="text-[13px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
