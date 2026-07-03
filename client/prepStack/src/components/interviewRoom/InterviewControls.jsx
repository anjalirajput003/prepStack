import React from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
  FaStopCircle,
  FaPhoneSlash,
} from "react-icons/fa";

const InterviewControls = ({
  isMuted,
  toggleMute,
  isCameraOff,
  toggleCamera,
  isSharingScreen,
  shareScreen,
  stopScreenShare,
  handleEndInterview,
}) => {
  return (
    <div className="flex items-center justify-center gap-3 py-4 px-6">
      <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] rounded-full px-2.5 py-2">
        {/* Microphone Toggle */}
        <button
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
          className={`w-11 h-11 rounded-full flex items-center justify-center text-[15px] transition-all active:scale-90 ${
            isMuted
              ? "bg-[#FB7185]/15 text-[#FB7185] hover:bg-[#FB7185]/25"
              : "bg-white/[0.06] text-white hover:bg-white/[0.12]"
          }`}
        >
          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>

        {/* Camera Toggle */}
        <button
          onClick={toggleCamera}
          title={isCameraOff ? "Turn camera on" : "Turn camera off"}
          className={`w-11 h-11 rounded-full flex items-center justify-center text-[15px] transition-all active:scale-90 ${
            isCameraOff
              ? "bg-[#FB7185]/15 text-[#FB7185] hover:bg-[#FB7185]/25"
              : "bg-white/[0.06] text-white hover:bg-white/[0.12]"
          }`}
        >
          {isCameraOff ? <FaVideoSlash /> : <FaVideo />}
        </button>

        {/* Screen Share Toggle */}
        <button
          onClick={isSharingScreen ? stopScreenShare : shareScreen}
          title={isSharingScreen ? "Stop sharing" : "Share screen"}
          className={`w-11 h-11 rounded-full flex items-center justify-center text-[15px] transition-all active:scale-90 ${
            isSharingScreen
              ? "bg-[#5B8DEF]/20 text-[#8FB2FF] hover:bg-[#5B8DEF]/30 shadow-[0_0_14px_rgba(91,141,239,0.35)]"
              : "bg-white/[0.06] text-white hover:bg-white/[0.12]"
          }`}
        >
          {isSharingScreen ? <FaStopCircle /> : <FaDesktop />}
        </button>
      </div>

      {/* End Interview */}
      <button
        onClick={handleEndInterview}
        title="End interview"
        className="h-11 px-6 rounded-full bg-[#FB7185] hover:bg-[#f9637e] text-white font-bold text-[13px] flex items-center gap-2 shadow-[0_4px_18px_rgba(251,113,133,0.35)] transition-all active:scale-95"
      >
        <FaPhoneSlash className="text-[13px]" /> End
      </button>
    </div>
  );
};

export default InterviewControls;
