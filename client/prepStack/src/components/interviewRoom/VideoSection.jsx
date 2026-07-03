import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaMicrophoneSlash,
  FaVideoSlash,
  FaDesktop,
} from "react-icons/fa";

const VideoSection = ({
  localVideoRef,
  remoteVideoRef,
  screenPreviewRef,
  status = "",
  isMuted = false,
  isCameraOff = false,
  isSharingScreen = false,
  isRemoteMuted = false,
  isRemoteCameraOff = false,
  isRemoteSharingScreen = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const remoteConnected = /established|joined/i.test(status);

  useEffect(() => {
    if (!isExpanded) return;
    function handleEscape(e) {
      if (e.key === "Escape") setIsExpanded(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  const content = (
    <div className="relative w-full">
      {/* ── Main stage: remote participant ── */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#121b30] to-[#0a0f1d] border shadow-[0_8px_30px_rgba(0,0,0,0.45)] ${
          isExpanded ? "aspect-video" : "aspect-[4/3]"
        } ${
          isSharingScreen
            ? "border-[#5B8DEF]/40 shadow-[0_0_0_1px_rgba(91,141,239,0.25)]"
            : "border-white/[0.06]"
        }`}
      >
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {!remoteConnected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0f1d]/95 px-6 text-center z-10">
            <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white/[0.04] border border-white/10">
              <span className="absolute inset-0 rounded-full border border-[#5B8DEF]/40 animate-iv-pulse-ring" />
              <FaUser className="text-slate-500 text-xl" />
            </span>
            <p className="text-[13px] text-slate-500 font-medium leading-snug">
              {status || "Waiting for other participant…"}
            </p>
          </div>
        )}

        {/* Remote Camera Off Placeholder (Hides if they are screen sharing!) */}
        {!isRemoteSharingScreen && isRemoteCameraOff && remoteConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#121b30] z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center">
                <FaVideoSlash className="text-slate-500 text-2xl" />
              </div>
              <p className="text-[13px] text-slate-500 font-medium">
                Camera is off
              </p>
            </div>
          </div>
        )}

        {/* Remote Muted Badge */}
        {isRemoteMuted && remoteConnected && (
          <div className="absolute top-3 left-[150px] z-20 flex items-center gap-1.5 bg-[#FB7185]/90 backdrop-blur-md text-[11px] font-bold text-white px-2.5 py-1 rounded-full">
            <FaMicrophoneSlash className="text-white text-[10px]" />
            Muted
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-[11px] font-semibold text-slate-200 px-2.5 py-1 rounded-full border border-white/10 z-20">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              remoteConnected ? "bg-emerald-400" : "bg-slate-500"
            }`}
          />
          Remote Participant
        </div>

        {isSharingScreen && (
          <div className="absolute top-3 right-10 flex items-center gap-1.5 bg-[#5B8DEF]/90 backdrop-blur-md text-[11px] font-bold text-white px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(91,141,239,0.5)] z-20">
            <FaDesktop className="text-[10px]" />
            Presenting
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/35 to-transparent pointer-events-none z-10" />
      </div>

      {/* ── PiP: local participant (camera) ── */}
      <div
        className={`absolute bottom-3 right-3 z-20 min-w-[88px] aspect-video rounded-xl overflow-hidden border shadow-[0_4px_16px_rgba(0,0,0,0.55)] bg-[#0a0f1d] transition-all ${
          isExpanded ? "w-[22%] max-w-[220px]" : "w-[30%] max-w-[150px]"
        } ${
          isSharingScreen
            ? "border-[#5B8DEF]/70 shadow-[0_0_14px_rgba(91,141,239,0.45)]"
            : "border-white/15"
        }`}
      >
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity ${
            isCameraOff ? "opacity-0" : "opacity-100"
          }`}
        />

        {isCameraOff && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#121b30]">
            <FaVideoSlash className="text-slate-500 text-sm" />
          </div>
        )}

        <div className="absolute top-1.5 left-1.5 bg-black/55 backdrop-blur-sm text-[9px] font-semibold text-slate-200 px-1.5 py-0.5 rounded-md">
          You
        </div>

        {isMuted && (
          <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FB7185]/90 flex items-center justify-center">
            <FaMicrophoneSlash className="text-white text-[9px]" />
          </div>
        )}

        {isSharingScreen && (
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-[#5B8DEF]/90 backdrop-blur-sm rounded-md px-1.5 py-0.5">
            <FaDesktop className="text-white text-[7px]" />
            <span className="text-white text-[8px] font-bold leading-none">
              Sharing
            </span>
          </div>
        )}
      </div>

      {/* ── Self preview: the screen YOU are sharing ── */}
      <div
        className={`absolute bottom-3 left-3 z-20 min-w-[88px] aspect-video rounded-xl overflow-hidden border border-[#5B8DEF]/70 shadow-[0_0_14px_rgba(91,141,239,0.45)] bg-black transition-all ${
          isExpanded ? "w-[22%] max-w-[220px]" : "w-[30%] max-w-[150px]"
        } ${isSharingScreen ? "block" : "hidden"}`}
      >
        <video
          ref={screenPreviewRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
        />
        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-[#5B8DEF]/90 backdrop-blur-sm text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md">
          <FaDesktop className="text-[7px]" />
          Your Screen
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes ivExpandIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        .iv-expand-in { animation: ivExpandIn 0.18s ease-out; }
        @keyframes ivPulseRing {
          0%   { transform: scale(0.9); opacity: 0.8; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-iv-pulse-ring { animation: ivPulseRing 2.2s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .iv-expand-in, .animate-iv-pulse-ring { animation: none !important; }
        }
      `}</style>

      {isExpanded ? (
        <>
          <div className="aspect-[4/3] w-full rounded-2xl bg-white/[0.02] border border-white/[0.04]" />
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 iv-expand-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsExpanded(false);
            }}
          >
            <div className="w-full max-w-4xl">{content}</div>
          </div>
        </>
      ) : (
        content
      )}
    </>
  );
};

export default VideoSection;