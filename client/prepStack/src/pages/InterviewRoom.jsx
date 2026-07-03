import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { FaCheck } from "react-icons/fa";
import VideoSection from "../components/interviewRoom/VideoSection";
import ChatSection from "../components/interviewRoom/ChatSection";
import CodeEditorSection from "../components/interviewRoom/CodeEditorSection";
import InterviewControls from "../components/interviewRoom/InterviewControls";
import { fetchWithAuth } from "../api/api";

const socket = io("http://localhost:8080");
const TOTAL_SECONDS = 3600;

const InterviewRoom = () => {
  const { interviewId } = useParams();

  const [status, setStatus] = useState("Waiting for other participant...");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [timeLeft, setTimeLeft] = useState(3600);
  const [connectionStatus, setConnectionStatus] = useState("Connected");
  const [isExecuting, setIsExecuting] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);

  const [interviewCategory, setInterviewCategory] = useState(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isRemoteMuted, setIsRemoteMuted] = useState(false);
  const [isRemoteCameraOff, setIsRemoteCameraOff] = useState(false);
  const [isRemoteSharingScreen, setIsRemoteSharingScreen] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const screenShareRef = useRef(null);
  const screenPreviewRef = useRef(null);

  useEffect(() => {
    async function fetchInterviewDetails() {
      try {
        const data = await fetchWithAuth(`/interview/${interviewId}`);

        console.log("INTERVIEW DATA:", data);

        setInterviewCategory(data.interview.category);
      } catch (err) {
        console.log("Failed to fetch interview details:", err);
      } finally {
        setIsCategoryLoading(false);
      }
    }
    fetchInterviewDetails();
  }, [interviewId]);

  const isTechInterview =
    interviewCategory?.toLowerCase().includes("tech") ?? false;

  const sessionTitle = isTechInterview
    ? "Technical Interview"
    : interviewCategory
    ? `${interviewCategory.charAt(0).toUpperCase()}${interviewCategory.slice(1)} Interview`
    : "Interview Session";

  useEffect(() => {
    socket.on("user-joined", async () => {
      setStatus("Other participant joined!");
      setConnectionStatus("Connected");
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("offer", { interviewId, offer });
    });

    socket.on("receive-offer", async (offer) => {
      setStatus("Incoming connection...");
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      setStatus("Connection established!");
      socket.emit("answer", { interviewId, answer });
    });

    socket.on("receive-answer", async (answer) => {
      await peerConnectionRef.current.setRemoteDescription(answer);
      setStatus("Connection established!");
    });

    socket.on("receive-ice-candidate", async (candidate) => {
      try {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.log("ICE ADD ERROR", err);
      }
    });

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, { text: message, sender: "other" }]);
    });

    socket.on("receive-code", (newCode) => setCode(newCode));
    socket.on("receive-output", (output) => setOutput(output));
    socket.on("timer-update", (time) => setTimeLeft(time));
    socket.on("participant-disconnected", () =>
      setConnectionStatus("Other participant disconnected"),
    );

    socket.on("interview-ended", () => {
      cleanupInterview();
      setInterviewEnded(true);
      alert("Interview has been ended by the other participant");
      window.location.href = "/history";
    });

    socket.on("peer-toggled-mute", (mutedState) =>
      setIsRemoteMuted(mutedState),
    );
    socket.on("peer-toggled-camera", (cameraState) =>
      setIsRemoteCameraOff(cameraState),
    );

    socket.on("peer-toggled-screen-share", (state) =>
      setIsRemoteSharingScreen(state),
    );

    return () => {
      socket.off("user-joined");
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-ice-candidate");
      socket.off("receive-message");
      socket.off("receive-code");
      socket.off("receive-output");
      socket.off("timer-update");
      socket.off("participant-disconnected");
      socket.off("interview-ended");
      socket.off("peer-toggled-mute");
      socket.off("peer-toggled-camera");
      socket.off("peer-toggled-screen-share");
    };
  }, [interviewId]);

  useEffect(() => {
    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        const peer = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peerConnectionRef.current = peer;

        peer.onicecandidate = (event) => {
          if (event.candidate)
            socket.emit("ice-candidate", {
              interviewId,
              candidate: event.candidate,
            });
        };

        socket.emit("join-room", interviewId);
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));
        peer.ontrack = (event) => {
          if (remoteVideoRef.current)
            remoteVideoRef.current.srcObject = event.streams[0];
        };
      } catch (err) {
        console.log("MEDIA ERROR:", err);
        alert("Camera or microphone access denied");
      }
    }
    startMedia();

    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      peerConnectionRef.current?.close();
    };
  }, []);

  function handleSendMessage() {
    if (!messageInput.trim()) return;
    socket.emit("send-message", { interviewId, message: messageInput });
    setMessages((prev) => [...prev, { text: messageInput, sender: "me" }]);
    setMessageInput("");
  }

  function toggleMute() {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    const newState = !audioTrack.enabled;
    setIsMuted(newState);
    socket.emit("toggle-mute", { interviewId, isMuted: newState });
  }

  function toggleCamera() {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    const newState = !videoTrack.enabled;
    setIsCameraOff(newState);
    socket.emit("toggle-camera", { interviewId, isCameraOff: newState });
  }


  async function shareScreen() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = screenStream.getVideoTracks()[0];

      screenTrack.onended = async () => {
        const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
        const sender = peerConnectionRef.current
          ?.getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender && cameraTrack) await sender.replaceTrack(cameraTrack);
        if (screenPreviewRef.current) screenPreviewRef.current.srcObject = null;

        setIsSharingScreen(false);
        // Tell remote peer you stopped sharing
        socket.emit("toggle-screen-share", {
          interviewId,
          isSharingScreen: false,
        });
      };

      screenShareRef.current = screenTrack;

      if (screenPreviewRef.current) {
        screenPreviewRef.current.srcObject = screenStream;
      }

      const sender = peerConnectionRef.current
        .getSenders()
        .find((s) => s.track?.kind === "video");
      if (sender) await sender.replaceTrack(screenTrack);

      setIsSharingScreen(true);
      // Tell remote peer you started sharing
      socket.emit("toggle-screen-share", {
        interviewId,
        isSharingScreen: true,
      });
    } catch (err) {
      console.log("SCREEN SHARE ERROR", err);
    }
  }

  async function stopScreenShare() {
    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
    const sender = peerConnectionRef.current
      ?.getSenders()
      .find((s) => s.track?.kind === "video");
    if (sender && cameraTrack) await sender.replaceTrack(cameraTrack);
    screenShareRef.current?.stop();
    if (screenPreviewRef.current) screenPreviewRef.current.srcObject = null;

    setIsSharingScreen(false);
    // Tell remote peer you stopped sharing
    socket.emit("toggle-screen-share", { interviewId, isSharingScreen: false });
  }
  function handleCodeChange(value) {
    const newCode = value || "";
    setCode(newCode);
    socket.emit("code-change", { interviewId, code: newCode });
  }

  async function handleRunCode() {
    if (isExecuting) return;
    try {
      setIsExecuting(true);
      setOutput("Running...");
      const response = await fetch("http://localhost:8080/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceCode: code, language: selectedLanguage }),
      });
      const data = await response.json();
      setOutput(data.output);
      socket.emit("output-change", { interviewId, output: data.output });
    } catch (err) {
      console.log(err);
      setOutput("Failed to connect to server");
    } finally {
      setIsExecuting(false);
    }
  }

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function cleanupInterview() {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenShareRef.current?.stop();
    peerConnectionRef.current?.close();
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (screenPreviewRef.current) screenPreviewRef.current.srcObject = null;
  }
async function handleEndInterview() {
  try {
    await fetchWithAuth(`/interview/${interviewId}/complete`, {
      method: "PUT",
    });

    socket.emit("end-interview", interviewId);

    cleanupInterview();

    setInterviewEnded(true);

    alert("Interview completed");

    window.location.href = "/history";
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
}

  const timePct = Math.max(0, Math.min(1, timeLeft / TOTAL_SECONDS));
  const timerColor =
    timePct > 0.5 ? "#5B8DEF" : timePct > 0.2 ? "#F5A623" : "#FB7185";
  const ringRadius = 17;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - timePct);

  // Pass isSharingScreen so VideoSection can show a badge on the PiP
  const videoProps = {
    localVideoRef,
    remoteVideoRef,
    screenPreviewRef,
    status,
    isMuted,
    isCameraOff,
    isSharingScreen,
    isRemoteMuted,
    isRemoteCameraOff,
    isRemoteSharingScreen,
  };
  const chatProps = { messages, messageInput, setMessageInput, handleSendMessage };
  const controlProps = {
    isMuted, toggleMute, isCameraOff, toggleCamera,
    isSharingScreen, shareScreen, stopScreenShare, handleEndInterview,
  };

  function renderSessionHeader() {
    return (
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06] bg-[#0b1221] shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#5B8DEF]/15 border border-[#5B8DEF]/25 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#5B8DEF]" />
          </div>
          <div>
            <h2
              className="text-[17px] font-semibold tracking-tight text-white leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {sessionTitle}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[10.5px] font-medium text-slate-500 tracking-wide"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {interviewId.slice(0, 8).toUpperCase()}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span
                className={`flex items-center gap-1.5 text-[10.5px] font-semibold ${
                  connectionStatus === "Connected" ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    connectionStatus === "Connected"
                      ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]"
                      : "bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(245,166,35,0.7)]"
                  }`}
                />
                {connectionStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
            Time Left
          </span>
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 40 40" className="w-12 h-12 -rotate-90">
              <circle cx="20" cy="20" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle
                cx="20" cy="20" r={ringRadius} fill="none" stroke={timerColor} strokeWidth="3"
                strokeLinecap="round" strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
                className={timePct <= 0.2 ? "animate-pulse" : ""}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.6s ease" }}
              />
            </svg>
          </div>
          <div
            className="px-3.5 py-1.5 rounded-lg border font-bold tracking-wider text-[15px]"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: timerColor,
              backgroundColor: `${timerColor}1A`,
              borderColor: `${timerColor}33`,
            }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    );
  }

  if (isCategoryLoading) {
    return (
      <div
        className="flex h-screen w-full items-center justify-center bg-[#070B14]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 rounded-full border-2 border-[#5B8DEF]/40 border-t-[#5B8DEF] animate-spin" />
          <p className="text-slate-500 text-sm">Setting up your interview room…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes ivPulseRing {
          0% { transform: scale(0.9); opacity: 0.8; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-iv-pulse-ring { animation: ivPulseRing 2.2s ease-out infinite; }
        @keyframes ivMsgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .iv-msg-in { animation: ivMsgIn 0.25s ease-out; }
        @keyframes ivEndIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .iv-end-in { animation: ivEndIn 0.4s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .animate-iv-pulse-ring, .iv-msg-in, .iv-end-in { animation: none !important; }
        }
      `}</style>

      <div
        className="flex h-screen w-full bg-[#070B14] text-white overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {isTechInterview ? (
          <>
            {/* ── TECH: code editor left, video/chat right ── */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.06]">
              {renderSessionHeader()}
              <div className="flex-1 flex flex-col min-h-0 bg-[#070b14]">
                <CodeEditorSection
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  code={code}
                  handleCodeChange={handleCodeChange}
                  output={output}
                  handleRunCode={handleRunCode}
                  isExecuting={isExecuting}
                />
              </div>
            </div>
            <div className="w-[420px] xl:w-[480px] 2xl:w-[560px] flex flex-col shrink-0 bg-[#0b1221] shadow-2xl z-10">
              <div className="p-4 border-b border-white/[0.06]">
                <VideoSection {...videoProps} />
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <ChatSection {...chatProps} />
              </div>
              <div className="border-t border-white/[0.06] bg-[#070b14]">
                <InterviewControls {...controlProps} />
              </div>
            </div>
          </>
        ) : (
          /* ── NON-TECH: full-screen video call layout ── */
          <div className="flex-1 flex flex-col min-h-0 bg-[#0b1221]">
            {renderSessionHeader()}

            <div className="flex-1 flex min-h-0">
              {/* Video pane */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#070b14] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(91,141,239,0.06)_0%,transparent_70%)]" />
                <div className="w-full max-w-[680px] relative z-10">
                  <VideoSection {...videoProps} />
                </div>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-slate-400">
                    {status}
                  </span>
                </div>
              </div>

              {/* Chat sidebar */}
              <div className="w-[340px] shrink-0 flex flex-col border-l border-white/[0.06] bg-[#0b1221]">
                <ChatSection {...chatProps} />
              </div>
            </div>

            <div className="border-t border-white/[0.06] bg-[#070b14] shrink-0">
              <InterviewControls {...controlProps} />
            </div>
          </div>
        )}

        {interviewEnded && (
          <div className="absolute inset-0 bg-[#070B14]/85 backdrop-blur-md z-50 flex flex-col items-center justify-center iv-end-in">
            <div className="w-16 h-16 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center mb-5">
              <FaCheck className="text-[#34D399] text-2xl" />
            </div>
            <h2
              className="text-3xl font-semibold text-white mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Interview Ended
            </h2>
            <p className="text-slate-500 text-[14px]">Redirecting to history…</p>
          </div>
        )}
      </div>
    </>
  );
};

export default InterviewRoom;
