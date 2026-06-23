import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import VideoSection from "../components/interviewRoom/VideoSection";
import ChatSection from "../components/interviewRoom/ChatSection";
import CodeEditorSection from "../components/interviewRoom/CodeEditorSection";
import InterviewControls from "../components/interviewRoom/InterviewControls";

const socket = io("http://localhost:8080");

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

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const screenShareRef = useRef(null);

  useEffect(() => {
    socket.on("user-joined", async () => {
      setStatus("Other participant joined!");
      setConnectionStatus("Connected");

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      socket.emit("offer", {
        interviewId,
        offer,
      });
    });

    socket.on("receive-offer", async (offer) => {
      setStatus("Incoming connection...");

      await peerConnectionRef.current.setRemoteDescription(offer);

      const answer = await peerConnectionRef.current.createAnswer();

      await peerConnectionRef.current.setLocalDescription(answer);
      setStatus("Connection established!");

      socket.emit("answer", {
        interviewId,
        answer,
      });
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
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          sender: "other",
        },
      ]);
    });

    socket.on("receive-code", (newCode) => {
      setCode(newCode);
    });

    socket.on("receive-output", (output) => {
      setOutput(output);
    });

    socket.on("timer-update", (time) => {
      setTimeLeft(time);
    });

    socket.on("participant-disconnected", () => {
      setConnectionStatus("Other participant disconnected");
    });

    socket.on("interview-ended", () => {
      cleanupInterview();

      setInterviewEnded(true);

      alert("Interview has been ended by the other participant");

      window.location.href = "/history";
    });

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

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.l.google.com:19302",
            },
          ],
        });

        peerConnectionRef.current = peer;
        peer.onicecandidate = (event) => {
          if (event.candidate) {

            socket.emit("ice-candidate", {
              interviewId,
              candidate: event.candidate,
            });
          }
        };
        socket.emit("join-room", interviewId);

        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream);
        });

        peer.ontrack = (event) => {

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
      } catch (err) {
        console.log("MEDIA ERROR:", err);
        alert("Camera or microphone access denied");
      }
    }

    startMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  function handleSendMessage() {
    if (!messageInput.trim()) return;

    socket.emit("send-message", {
      interviewId,
      message: messageInput,
    });

    setMessages((prev) => [
      ...prev,
      {
        text: messageInput,
        sender: "me",
      },
    ]);
    setMessageInput("");
  }

  function toggleMute() {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setIsMuted(!audioTrack.enabled);
  }

  function toggleCamera() {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;

    setIsCameraOff(!videoTrack.enabled);
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
          .find((sender) => sender.track?.kind === "video");

        if (sender && cameraTrack) {
          await sender.replaceTrack(cameraTrack);
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }

        setIsSharingScreen(false);
      };
      screenShareRef.current = screenTrack;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      const sender = peerConnectionRef.current
        .getSenders()
        .find((sender) => sender.track?.kind === "video");

      if (sender) {
        await sender.replaceTrack(screenTrack);
      }

      setIsSharingScreen(true);
    } catch (err) {
      console.log("SCREEN SHARE ERROR", err);
    }
  }

  async function stopScreenShare() {
    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];

    const sender = peerConnectionRef.current
      ?.getSenders()
      .find((sender) => sender.track?.kind === "video");

    if (sender && cameraTrack) {
      await sender.replaceTrack(cameraTrack);
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    if (screenShareRef.current) {
      screenShareRef.current.stop();
    }

    setIsSharingScreen(false);
  }

  function handleCodeChange(value) {
    const newCode = value || "";
    setCode(newCode);
    socket.emit("code-change", {
      interviewId,
      code: newCode,
    });
  }

  async function handleRunCode() {
    if (isExecuting) return;
    try {
      setIsExecuting(true);
      setOutput("Running...");
      const response = await fetch("http://localhost:8080/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode: code,
          language: selectedLanguage,
        }),
      });

      const data = await response.json();

      setOutput(data.output);

      socket.emit("output-change", {
        interviewId,
        output: data.output,
      });
    } catch (err) {
      console.log(err);

      setOutput("Failed to connect to server");
    } finally {
      setIsExecuting(false);
    }
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  function cleanupInterview() {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }

  async function handleEndInterview() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/interview/${interviewId}/complete`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      socket.emit("end-interview", interviewId);

      cleanupInterview();

      setInterviewEnded(true);

      alert("Interview completed");

      // optional redirect
      window.location.href = "/history";
    } catch (err) {
      console.log(err);

      alert("Failed to complete interview");
    }
  }

  return (
    <div>
      <h2>Interview Room</h2>
      <h3>
        Time Left:
        {formatTime(timeLeft)}
      </h3>
      <p>
        Connection Status:
        {connectionStatus}
      </p>
      {interviewEnded && <h2>Interview Ended</h2>}
      <p>Interview ID: {interviewId}</p>
      <p>Status: {status}</p>
      <VideoSection
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
      />
      <ChatSection
        messages={messages}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
      />
      <CodeEditorSection
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        code={code}
        handleCodeChange={handleCodeChange}
        output={output}
        handleRunCode={handleRunCode}
        isExecuting={isExecuting}
      />

      <InterviewControls
        isMuted={isMuted}
        toggleMute={toggleMute}
        isCameraOff={isCameraOff}
        toggleCamera={toggleCamera}
        isSharingScreen={isSharingScreen}
        shareScreen={shareScreen}
        stopScreenShare={stopScreenShare}
        handleEndInterview={handleEndInterview}
      />

      {/* <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button> <br />
      <button onClick={toggleCamera}>
        {isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
      </button>{" "}
      <button onClick={isSharingScreen ? stopScreenShare : shareScreen}>
        {" "}
        {isSharingScreen ? "Stop sharing" : "Share screen"}{" "}
      </button>
      <br />
      <button onClick={handleEndInterview}>End Interview</button> */}
    </div>
  );
};

export default InterviewRoom;
