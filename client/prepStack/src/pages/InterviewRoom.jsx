import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "../components/LanguageSelector";

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
      // console.log("USER JOINED EVENT");

      // console.log("CREATING OFFER");

      const offer = await peerConnectionRef.current.createOffer();

      // console.log("OFFER CREATED");

      await peerConnectionRef.current.setLocalDescription(offer);

      socket.emit("offer", {
        interviewId,
        offer,
      });
      console.log("OFFER SENT");
    });

    socket.on("receive-offer", async (offer) => {
      setStatus("Incoming connection...");
      console.log("OFFER RECEIVED");

      await peerConnectionRef.current.setRemoteDescription(offer);
      console.log("REMOTE DESCRIPTION SET");

      const answer = await peerConnectionRef.current.createAnswer();
      console.log("ANSWER CREATED");

      await peerConnectionRef.current.setLocalDescription(answer);
      setStatus("Connection established!");
      console.log("LOCAL DESCRIPTION SET");

      socket.emit("answer", {
        interviewId,
        answer,
      });
      console.log("ANSWER SENT");
    });

    socket.on("receive-answer", async (answer) => {
      console.log("ANSWER RECEIVED");
      await peerConnectionRef.current.setRemoteDescription(answer);
      console.log("CONNECTION ESTABLISHED");

      setStatus("Connection established!");
    });

    console.log("REGISTERING MESSAGE LISTENER");
    socket.on("receive-ice-candidate", async (candidate) => {
      console.log("ICE CANDIDATE RECEIVED");
      try {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.log("ICE ADD ERROR", err);
      }
    });
    socket.on("receive-message", (message) => {
      // console.log("MESSAGE LISTENER FIRED", message);
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
            console.log("ICE CANDIDATE GENERATED");

            socket.emit("ice-candidate", {
              interviewId,
              candidate: event.candidate,
            });
          }
        };
        console.log("PEER CONNECTION CREATED");
        socket.emit("join-room", interviewId);

        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream);
        });

        peer.ontrack = (event) => {
          console.log("REMOTE TRACK RECEIVED");

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
    console.log("SEND BUTTON CLICKED");
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
        console.log("SCREEN SHARE ENDED");

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
      console.log(selectedLanguage);
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
      <h3>Your Camera Preview</h3>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        width="400"
        height="300"
      />
      <h3>Remote Participant</h3>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        width="400"
        height="300"
      />
      <h3>Chat</h3>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type message..."
      />
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      {/* <p>Selected Language: {selectedLanguage}</p> */}
      <Editor
        key={selectedLanguage}
        height="600px"
        language={selectedLanguage}
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange}
      />
      <h3>Output</h3>
      <div
        style={{
          border: "1px solid gray",
          minHeight: "150px",
          padding: "10px",
          whiteSpace: "pre-wrap",
        }}
      >
        {output || "No output yet"}
      </div>
      <button onClick={handleSendMessage}>Send</button> <br />
      <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button> <br />
      <button onClick={toggleCamera}>
        {isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
      </button>{" "}
      <button onClick={isSharingScreen ? stopScreenShare : shareScreen}>
        {" "}
        {isSharingScreen ? "Stop sharing" : "Share screen"}{" "}
      </button>
      <br />
      <button onClick={handleRunCode} disabled={isExecuting}>
        {isExecuting ? "Running..." : "Run Code"}
      </button>
      <button onClick={handleEndInterview}>End Interview</button>
      {/*<button onClick={() => setOutput("Hello from output console")}>
        Test Output
      </button>*/}
    </div>
  );
};

export default InterviewRoom;
