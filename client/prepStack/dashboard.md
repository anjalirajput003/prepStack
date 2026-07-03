return (
    <DashboardLayout>
      <h1>Dashboard</h1>
      {user?.profilePicture && (
        <img
          src={user.profilePicture}
          alt="Profile"
          width="120"
          height="120"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
      <h2>Welcome {user?.name}</h2>

      <p>
        Current Role: <strong>{user?.role}</strong>
      </p>

      <p>Email: {user?.email}</p>

      <p>
        Profile Completion:
        {calculateProfileCompletion(user)}%
      </p>
      <div
        style={{
          width: "300px",
          height: "20px",
          border: "1px solid black",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${calculateProfileCompletion(user)}%`,
            height: "100%",
            backgroundColor: "green",
          }}
        />
      </div>

      <hr />

      <h3>My Stats</h3>

      {user?.role === "interviewer" && (
        <>
          <p>Interviews Taken: {user?.interviewsTaken || 0}</p>

          <p>
            Rating:
            {user?.rating > 0 ? user.rating.toFixed(2) : " No Ratings Yet"}
          </p>

          <p>
            Status:
            <AvailabilityBadge isAvailable={user?.isAvailable} />
          </p>
        </>
      )}

      {user?.role === "interviewee" && (
        <>
          <p>Completed Interviews: {historyCount}</p>
        </>
      )}

      {user?.role === "interviewer" && user?.skills?.length === 0 && (
        <p>Please complete your interviewer profile.</p>
      )}
      <h3>Profile</h3>
      <button onClick={() => navigate("/profile")}>My Profile</button>
      <hr />
      <h3>Interview Management</h3>
      {user?.role === "interviewee" && (
        <>
          <button onClick={() => navigate("/interviewers-list")}>
            Browse Interviewers
          </button>

          <button onClick={() => navigate("/my-requests")}>My Requests</button>
        </>
      )}

      {user?.role === "interviewer" && (
        <button onClick={() => navigate("/received-requests")}>
          Received Requests
        </button>
      )}
      <button onClick={() => navigate("/history")}>Interview History</button>
      <hr />
      <h3>Community</h3>
      <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
      <button onClick={handleRoleSwitch}>Switch Role</button>
    </DashboardLayout>
  );

  history og file 
  import React from "react";
// import { useEffect } from "react";
// import { useState } from "react";
// import { fetchWithAuth } from "../api/api";
// import { useNavigate } from "react-router-dom";

// const History = () => {
//   const [history, setHistory] = useState([]);
//   const [selectedInterviewId, setSelectedInterviewId] = useState(null);
//   const [rating, setRating] = useState(5);
//   const [feedback, setFeedback] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function getHistory() {
//       try {
//         const data = await fetchWithAuth("/interview/history");
//         setHistory(data.history);
//       } catch (err) {
//         alert(err.message);
//       }
//     }
//     getHistory();
//   }, []);

//   async function handleReviewSubmit(interviewId) {
//     try {
//       const data = await fetchWithAuth(`/interview/${interviewId}/review`, {
//         method: "PUT",
//         body: JSON.stringify({
//           rating,
//           feedback,
//         }),
//       });

//       alert(data.message);

//       setHistory((prevHistory) =>
//         prevHistory.map((interview) =>
//           interview._id === interviewId
//             ? {
//                 ...interview,
//                 rating,
//                 feedback,
//               }
//             : interview,
//         ),
//       );

//       setSelectedInterviewId(null);
//       setRating(5);
//       setFeedback("");
//     } catch (err) {
//       alert(err.message);
//     }
//   }

//   async function handleRequestAgain(interviewerId, category) {
//   try {
//     await fetchWithAuth("/interview", {
//       method: "POST",
//       body: JSON.stringify({
//         interviewerId,
//         category,
//       }),
//     });

//     alert("Interview requested successfully");
//   } catch (err) {
//     alert(err.message);
//   }
// }
//   return (
//     <div>
//       <h2>Interview History</h2>

//       {history.length === 0 ? (
//         <p>No completed interviews yet</p>
//       ) : (
//         history.map((interview) => (
//           <div key={interview._id}>
//             <p> Interviewer : {interview.interviewerId?.name}</p>
//             <p> Interviewee : {interview.intervieweeId?.name}</p>
//             <p> Category : {interview.category}</p>
//             <p> Status: {interview.status} </p>
//             <p>
//               {" "}
//               Scheduled At :{" "}
//               {interview.scheduledAt
//                 ? new Date(interview.scheduledAt).toLocaleString()
//                 : "N/A"}
//             </p>
//             <p>Rating: {String(interview.rating)}</p>
//             {!interview.rating && (
//               <button
//                 onClick={() => {
//                   setSelectedInterviewId(interview._id);
//                 }}
//               >
//                 Leave Review
//               </button>
//             )}
//             {selectedInterviewId === interview._id && (
//               <div>
//                 <br />

//                 <label>Rating (1-5)</label>

//                 <input
//                   type="number"
//                   min="1"
//                   max="5"
//                   value={rating}
//                   onChange={(e) => setRating(Number(e.target.value))}
//                 />

//                 <br />
//                 <br />

//                 <textarea
//                   placeholder="Write your feedback..."
//                   value={feedback}
//                   onChange={(e) => setFeedback(e.target.value)}
//                 />

//                 <br />
//                 <br />

//                 <button onClick={() => handleReviewSubmit(interview._id)}>
//                   Submit Review
//                 </button>
//               </div>
//             )}

//             <button
//               onClick={() =>
//                 navigate(`/interviewers/${interview.interviewerId._id}`)
//               }
//             >
//               View Profile
//             </button>

//             <button
//               onClick={() =>
//                 handleRequestAgain(
//                   interview.interviewerId._id,
//                   interview.category,
//                 )
//               }
//             >
//               Request Again
//             </button>
//             <hr />
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default History;


* {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(76, 142, 255, 0.35) transparent;
}

*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(76, 142, 255, 0.35);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}

*::-webkit-scrollbar-thumb:hover {
  background-color: rgba(76, 142, 255, 0.55);
  background-clip: content-box;
}



ort React, { useEffect, useRef, useState } from "react";
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
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
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
      window.location.href = "/history";
    } catch (err) {
      console.log(err);
      alert("Failed to complete interview");
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#060A18] text-white overflow-hidden font-sans">
      {/* ── LEFT COLUMN: CODE & OUTPUT ── */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0b1221]">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold tracking-tight">
              Technical Interview
            </h2>
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/5 text-slate-400">
              ID: {interviewId.slice(0, 8)}
            </span>
            <span
              className={`text-[11px] font-semibold flex items-center gap-1.5 ${connectionStatus === "Connected" ? "text-green-400" : "text-yellow-400"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${connectionStatus === "Connected" ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" : "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse"}`}
              ></div>
              {connectionStatus}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-400">
              Time Left
            </span>
            <div className="px-4 py-1.5 rounded-lg bg-[#2F7DFF]/10 border border-[#2F7DFF]/20 text-[#4C8EFF] font-mono font-bold tracking-wider">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#080e1a]">
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

      {/* ── RIGHT COLUMN: VIDEO, CHAT & CONTROLS ── */}
      <div className="w-[380px] xl:w-[450px] flex flex-col shrink-0 bg-[#0b1221] shadow-2xl z-10">
        {/* Status indicator */}
        <div className="px-4 py-2 text-xs font-semibold text-slate-400 bg-white/5 border-b border-white/5 truncate">
          {status}
        </div>

        {/* Videos */}
        <div className="p-4 border-b border-white/10">
          <VideoSection
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
          />
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatSection
            messages={messages}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            handleSendMessage={handleSendMessage}
          />
        </div>

        {/* Controls */}
        <div className="border-t border-white/10 bg-[#060A18]">
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
        </div>
      </div>

      {/* Overlay if ended */}
      {interviewEnded && (
        <div className="absolute inset-0 bg-[#060A18]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Interview Ended
          </h2>
          <p className="text-slate-400">Redirecting to history...</p>
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { FaCheck } from "react-icons/fa";
import VideoSection from "../components/interviewRoom/VideoSection";
import ChatSection from "../components/interviewRoom/ChatSection";
import CodeEditorSection from "../components/interviewRoom/CodeEditorSection";
import InterviewControls from "../components/interviewRoom/InterviewControls";

const socket = io("http://localhost:8080");

// Nominal session length, used only to drive the timer ring's fill %.
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
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
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
      window.location.href = "/history";
    } catch (err) {
      console.log(err);
      alert("Failed to complete interview");
    }
  }

  // ── Derived values for the cockpit-style timer ring ──
  const timePct = Math.max(0, Math.min(1, timeLeft / TOTAL_SECONDS));
  const timerColor =
    timePct > 0.5 ? "#5B8DEF" : timePct > 0.2 ? "#F5A623" : "#FB7185";
  const ringRadius = 17;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - timePct);

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
        {/* ── LEFT COLUMN: CODE & OUTPUT ── */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.06]">
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06] bg-[#0b1221]">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#5B8DEF]/15 border border-[#5B8DEF]/25 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#5B8DEF]" />
              </div>
              <div>
                <h2
                  className="text-[17px] font-semibold tracking-tight text-white leading-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Technical Interview
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
                      connectionStatus === "Connected"
                        ? "text-emerald-400"
                        : "text-amber-400"
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
                  <circle
                    cx="20"
                    cy="20"
                    r={ringRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r={ringRadius}
                    fill="none"
                    stroke={timerColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    className={timePct <= 0.2 ? "animate-pulse" : ""}
                    style={{
                      transition:
                        "stroke-dashoffset 1s linear, stroke 0.6s ease",
                    }}
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

          {/* Code Editor Area */}
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

        {/* ── RIGHT COLUMN: VIDEO, CHAT & CONTROLS ── */}
        <div className="w-[380px] xl:w-[440px] flex flex-col shrink-0 bg-[#0b1221] shadow-2xl z-10">
          {/* Videos */}
          <div className="p-4 border-b border-white/[0.06]">
            <VideoSection
              localVideoRef={localVideoRef}
              remoteVideoRef={remoteVideoRef}
              status={status}
              isMuted={isMuted}
              isCameraOff={isCameraOff}
            />
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col min-h-0">
            <ChatSection
              messages={messages}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              handleSendMessage={handleSendMessage}
            />
          </div>

          {/* Controls */}
          <div className="border-t border-white/[0.06] bg-[#070b14]">
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
          </div>
        </div>

        {/* Overlay if ended */}
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
            <p className="text-slate-500 text-[14px]">
              Redirecting to history…
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default InterviewRoom;



//ChatSection.jsx
// const ChatSection = ({
//   messages,
//   messageInput,
//   setMessageInput,
//   handleSendMessage,
// }) => {
//   return (
//     <>
//       <h3>Chat</h3>
//       <div>
//         {messages.map((msg, index) => (
//           <p key={index}>
//             <strong>{msg.sender}:</strong> {msg.text}
//           </p>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={messageInput}
//         onChange={(e) => setMessageInput(e.target.value)}
//         placeholder="Type message..."
//       />
//       <button onClick={handleSendMessage}>Send</button> <br />
//     </>
//   );
// };

// export default ChatSection;

// import React, { useRef, useEffect } from "react";
// import { FaPaperPlane } from "react-icons/fa";

// const ChatSection = ({
//   messages,
//   messageInput,
//   setMessageInput,
//   handleSendMessage,
// }) => {
//   const scrollRef = useRef(null);

//   // Auto-scroll to bottom when new message arrives
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-[#0b1221]">
//       <div className="px-4 py-2 border-b border-white/5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
//         Session Chat
//       </div>

//       {/* Messages Area */}
//       <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.length === 0 ? (
//           <p className="text-center text-slate-500 text-sm mt-4 italic">
//             No messages yet...
//           </p>
//         ) : (
//           messages.map((msg, index) => {
//             const isMe = msg.sender === "me";
//             return (
//               <div
//                 key={index}
//                 className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
//               >
//                 <span className="text-[10px] text-slate-500 mb-1 px-1">
//                   {isMe ? "You" : "Participant"}
//                 </span>
//                 <div
//                   className={`px-4 py-2 rounded-2xl max-w-[85%] text-[14px] ${isMe ? "bg-[#2F7DFF] text-white rounded-br-sm" : "bg-white/10 text-slate-200 rounded-bl-sm"}`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Input Area */}
//       <div className="p-4 bg-[#131d30]/50 border-t border-white/5">
//         <div className="flex items-end gap-2">
//           <textarea
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type a message..."
//             className="flex-1 bg-[#080e1a] border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white focus:border-[#4C8EFF] focus:ring-1 focus:ring-[#4C8EFF]/50 outline-none resize-none min-h-[48px] max-h-[120px]"
//             rows="1"
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={!messageInput.trim()}
//             className="w-12 h-12 shrink-0 rounded-xl bg-[#2F7DFF] hover:bg-[#4C8EFF] disabled:bg-white/5 disabled:text-slate-500 text-white flex items-center justify-center transition-colors shadow-lg"
//           >
//             <FaPaperPlane className="text-sm" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatSection;


//CodeEditorSection

// import React from "react";
// import { Editor } from "@monaco-editor/react";
// import LanguageSelector from "../LanguageSelector"; // Assuming this exists in your project
// import { FaPlay, FaTerminal } from "react-icons/fa";

// const CodeEditorSection = ({
//   selectedLanguage,
//   setSelectedLanguage,
//   code,
//   handleCodeChange,
//   output,
//   handleRunCode,
//   isExecuting,
// }) => {
//   return (
//     <div className="flex flex-col h-full w-full">
//       {/* Editor Toolbar */}
//       <div className="flex justify-between items-center px-4 py-2 border-b border-white/10 bg-[#131d30]/40">
//         <div className="flex items-center gap-3">
//           {/* Note: Ensure LanguageSelector is styled nicely on its own! */}
//           <LanguageSelector
//             selectedLanguage={selectedLanguage}
//             onLanguageChange={setSelectedLanguage}
//           />
//         </div>
//         <button
//           onClick={handleRunCode}
//           disabled={isExecuting}
//           className="px-5 py-2 bg-[#27c281]/20 text-[#27c281] hover:bg-[#27c281]/30 hover:text-white rounded-lg flex items-center gap-2 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-[#27c281]/30"
//         >
//           {isExecuting ? (
//             <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
//           ) : (
//             <FaPlay className="text-[10px]" />
//           )}
//           {isExecuting ? "Executing..." : "Run Code"}
//         </button>
//       </div>

//       {/* Monaco Editor */}
//       <div className="flex-1 relative w-full">
//         <Editor
//           key={selectedLanguage}
//           language={selectedLanguage}
//           theme="vs-dark"
//           value={code}
//           onChange={handleCodeChange}
//           options={{
//             minimap: { enabled: false },
//             fontSize: 14,
//             padding: { top: 16 },
//             scrollBeyondLastLine: false,
//           }}
//           loading={<div className="text-slate-500 p-4">Loading editor...</div>}
//         />
//       </div>

//       {/* Output Console */}
//       <div className="h-[250px] border-t border-white/10 bg-[#060A18] flex flex-col shrink-0">
//         <div className="px-4 py-2 bg-[#0b1221] border-b border-white/5 flex items-center gap-2">
//           <FaTerminal className="text-slate-500 text-xs" />
//           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
//             Output Console
//           </span>
//         </div>
//         <div className="flex-1 p-4 font-mono text-[13px] text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed">
//           {output || (
//             <span className="text-slate-600">
//               Waiting for code execution...
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CodeEditorSection;


//InterviewControls.jsx
// import React from "react";
// import {
//   FaMicrophone,
//   FaMicrophoneSlash,
//   FaVideo,
//   FaVideoSlash,
//   FaDesktop,
//   FaStopCircle,
//   FaPhoneSlash,
// } from "react-icons/fa";

// const InterviewControls = ({
//   isMuted,
//   toggleMute,
//   isCameraOff,
//   toggleCamera,
//   isSharingScreen,
//   shareScreen,
//   stopScreenShare,
//   handleEndInterview,
// }) => {
//   return (
//     <div className="flex items-center justify-center gap-4 py-4 px-6">
//       {/* Microphone Toggle */}
//       <button
//         onClick={toggleMute}
//         title={isMuted ? "Unmute" : "Mute"}
//         className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all ${
//           isMuted
//             ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30"
//             : "bg-white/10 text-white hover:bg-white/20 border border-white/5"
//         }`}
//       >
//         {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
//       </button>

//       {/* Camera Toggle */}
//       <button
//         onClick={toggleCamera}
//         title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
//         className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all ${
//           isCameraOff
//             ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30"
//             : "bg-white/10 text-white hover:bg-white/20 border border-white/5"
//         }`}
//       >
//         {isCameraOff ? <FaVideoSlash /> : <FaVideo />}
//       </button>

//       {/* Screen Share Toggle */}
//       <button
//         onClick={isSharingScreen ? stopScreenShare : shareScreen}
//         title={isSharingScreen ? "Stop Sharing" : "Share Screen"}
//         className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all ${
//           isSharingScreen
//             ? "bg-[#2F7DFF]/20 text-[#4C8EFF] hover:bg-[#2F7DFF]/30 border border-[#2F7DFF]/30 shadow-[0_0_15px_rgba(47,125,255,0.3)]"
//             : "bg-white/10 text-white hover:bg-white/20 border border-white/5"
//         }`}
//       >
//         {isSharingScreen ? <FaStopCircle /> : <FaDesktop />}
//       </button>

//       <div className="w-px h-8 bg-white/10 mx-2"></div>

//       {/* End Interview */}
//       <button
//         onClick={handleEndInterview}
//         className="h-12 px-6 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-colors"
//       >
//         <FaPhoneSlash /> End
//       </button>
//     </div>
//   );
// };

// export default InterviewControls;



//VideoSection.jsx
// import React, { useState, useEffect } from "react";
// import {
//   FaUser,
//   FaMicrophoneSlash,
//   FaVideoSlash,
//   FaExpand,
//   FaCompress,
//   FaDesktop,
// } from "react-icons/fa";

// const VideoSection = ({
//   localVideoRef,
//   remoteVideoRef,
//   screenPreviewRef,
//   status = "",
//   isMuted = false,
//   isCameraOff = false,
//   isSharingScreen = false,
//   isRemoteMuted = false,
//   isRemoteCameraOff = false,
//   isRemoteSharingScreen = false,
// }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const remoteConnected = /established|joined/i.test(status);

//   useEffect(() => {
//     if (!isExpanded) return;
//     function handleEscape(e) {
//       if (e.key === "Escape") setIsExpanded(false);
//     }
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [isExpanded]);

//   const content = (
//     <div className="relative w-full">
//       {/* ── Main stage: remote participant ── */}
//       <div
//         className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#121b30] to-[#0a0f1d] border shadow-[0_8px_30px_rgba(0,0,0,0.45)] ${
//           isExpanded ? "aspect-video" : "aspect-[4/3]"
//         } ${
//           isSharingScreen
//             ? "border-[#5B8DEF]/40 shadow-[0_0_0_1px_rgba(91,141,239,0.25)]"
//             : "border-white/[0.06]"
//         }`}
//       >
//         <video
//           ref={remoteVideoRef}
//           autoPlay
//           playsInline
//           className="w-full h-full object-cover"
//         />

//         {/* NEW: Remote Camera Off Placeholder */}
//         {!isRemoteSharingScreen && isRemoteCameraOff && remoteConnected && (
//           <div className="absolute inset-0 flex items-center justify-center bg-[#121b30] z-10">
//             <div className="flex flex-col items-center gap-3">
//               <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center">
//                 <FaVideoSlash className="text-slate-500 text-2xl" />
//               </div>
//               <p className="text-[13px] text-slate-500 font-medium">
//                 Camera is off
//               </p>
//             </div>
//           </div>
//         )}

//         {/* NEW: Remote Muted Badge (Placed next to the 'Remote Participant' label) */}
//         {isRemoteMuted && remoteConnected && (
//           <div className="absolute top-3 left-[150px] z-20 flex items-center gap-1.5 bg-[#FB7185]/90 backdrop-blur-md text-[11px] font-bold text-white px-2.5 py-1 rounded-full">
//             <FaMicrophoneSlash className="text-white text-[10px]" />
//             Muted
//           </div>
//         )}

//         {/* Waiting / not-yet-connected placeholder */}
//         {!remoteConnected && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0f1d]/95 px-6 text-center">
//             <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white/[0.04] border border-white/10">
//               <span className="absolute inset-0 rounded-full border border-[#5B8DEF]/40 animate-iv-pulse-ring" />
//               <FaUser className="text-slate-500 text-xl" />
//             </span>
//             <p className="text-[13px] text-slate-500 font-medium leading-snug">
//               {status || "Waiting for other participant…"}
//             </p>
//           </div>
//         )}

//         {/* Remote participant label */}
//         <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-[11px] font-semibold text-slate-200 px-2.5 py-1 rounded-full border border-white/10">
//           <span
//             className={`w-1.5 h-1.5 rounded-full ${
//               remoteConnected ? "bg-emerald-400" : "bg-slate-500"
//             }`}
//           />
//           Remote Participant
//         </div>

//         {isSharingScreen && (
//           <div className="absolute top-3 right-10 flex items-center gap-1.5 bg-[#5B8DEF]/90 backdrop-blur-md text-[11px] font-bold text-white px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(91,141,239,0.5)]">
//             <FaDesktop className="text-[10px]" />
//             Presenting
//           </div>
//         )}

//         {/* Expand / collapse toggle */}
//         <button
//           type="button"
//           onClick={() => setIsExpanded((prev) => !prev)}
//           title={isExpanded ? "Exit full view" : "Expand video"}
//           className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-200 text-[12px] transition-colors"
//         >
//           {isExpanded ? <FaCompress /> : <FaExpand />}
//         </button>

//         {/* Bottom scrim */}
//         <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
//       </div>

//       <div
//         className={`absolute bottom-3 right-3 z-20 min-w-[88px] aspect-video rounded-xl overflow-hidden border shadow-[0_4px_16px_rgba(0,0,0,0.55)] bg-[#0a0f1d] transition-all ${
//           isExpanded ? "w-[22%] max-w-[220px]" : "w-[30%] max-w-[150px]"
//         } ${
//           // Pulsing blue border signals that screen sharing is live
//           isSharingScreen
//             ? "border-[#5B8DEF]/70 shadow-[0_0_14px_rgba(91,141,239,0.45)]"
//             : "border-white/15"
//         }`}
//       >
//         <video
//           ref={localVideoRef}
//           autoPlay
//           playsInline
//           muted
//           className={`w-full h-full object-cover transition-opacity ${
//             isCameraOff ? "opacity-0" : "opacity-100"
//           }`}
//         />

//         {isCameraOff && (
//           <div className="absolute inset-0 flex items-center justify-center bg-[#121b30]">
//             <FaVideoSlash className="text-slate-500 text-sm" />
//           </div>
//         )}

//         {/* "You" label */}
//         <div className="absolute top-1.5 left-1.5 bg-black/55 backdrop-blur-sm text-[9px] font-semibold text-slate-200 px-1.5 py-0.5 rounded-md">
//           You
//         </div>

//         {/* Mute badge */}
//         {isMuted && (
//           <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FB7185]/90 flex items-center justify-center">
//             <FaMicrophoneSlash className="text-white text-[9px]" />
//           </div>
//         )}

//         {isSharingScreen && (
//           <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-[#5B8DEF]/90 backdrop-blur-sm rounded-md px-1.5 py-0.5">
//             <FaDesktop className="text-white text-[7px]" />
//             <span className="text-white text-[8px] font-bold leading-none">
//               Sharing
//             </span>
//           </div>
//         )}
//       </div>

//       <div
//         className={`absolute bottom-3 left-3 z-20 min-w-[88px] aspect-video rounded-xl overflow-hidden border border-[#5B8DEF]/70 shadow-[0_0_14px_rgba(91,141,239,0.45)] bg-black transition-all ${
//           isExpanded ? "w-[22%] max-w-[220px]" : "w-[30%] max-w-[150px]"
//         } ${isSharingScreen ? "block" : "hidden"}`}
//       >
//         <video
//           ref={screenPreviewRef}
//           autoPlay
//           playsInline
//           muted
//           className="w-full h-full object-contain"
//         />
//         <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-[#5B8DEF]/90 backdrop-blur-sm text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md">
//           <FaDesktop className="text-[7px]" />
//           Your Screen
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <style>{`
//         @keyframes ivExpandIn {
//           from { opacity: 0; transform: scale(0.97); }
//           to   { opacity: 1; transform: scale(1); }
//         }
//         .iv-expand-in { animation: ivExpandIn 0.18s ease-out; }
//         @keyframes ivPulseRing {
//           0%   { transform: scale(0.9); opacity: 0.8; }
//           70%  { transform: scale(1.6); opacity: 0; }
//           100% { transform: scale(1.6); opacity: 0; }
//         }
//         .animate-iv-pulse-ring { animation: ivPulseRing 2.2s ease-out infinite; }
//         @media (prefers-reduced-motion: reduce) {
//           .iv-expand-in, .animate-iv-pulse-ring { animation: none !important; }
//         }
//       `}</style>

//       {isExpanded ? (
//         <>
//           {/* Placeholder keeps the sidebar from collapsing */}
//           <div className="aspect-[4/3] w-full rounded-2xl bg-white/[0.02] border border-white/[0.04]" />

//           <div
//             className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 iv-expand-in"
//             onClick={(e) => {
//               if (e.target === e.currentTarget) setIsExpanded(false);
//             }}
//           >
//             <div className="w-full max-w-4xl">{content}</div>
//           </div>
//         </>
//       ) : (
//         content
//       )}
//     </>
//   );
// };

// export default VideoSection;



//Sidebar.jsx
// import {
//   FaHome,
//   FaThLarge,
//   FaHistory,
//   FaUserTie,
//   FaTrophy,
//   FaComments,
//   FaUser,
//   FaBars,
// } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";

// function Sidebar({ isOpen, toggleSidebar }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   return (
//     <aside
//       className={`glass-sidebar ${isOpen ? "w-[160px]" : "w-[80px]"} h-screen shrink-0 transition-all duration-300 flex flex-col border-r border-white/5`}
//     >
//       <div
//         className={`h-24 flex items-center ${isOpen ? "px-5" : "justify-center"}`}
//       >
//         <button
//           onClick={toggleSidebar}
//           className={`w-12 h-12 glass-panel rounded-xl flex items-center justify-center hover:bg-white/10 transition-all ${isOpen ? "ml-2" : ""}`}
//         >
//           <FaBars className="text-slate-300" />
//         </button>
//       </div>

//       <div
//         className={`pt-6 flex flex-col gap-2 ${isOpen ? "px-3" : "items-center"}`}
//       >
//         {/* New Home Button (Navigates to public landing page) */}
//         <SidebarButton
//           icon={<FaHome />}
//           text="Home"
//           isOpen={isOpen}
//           active={location.pathname === "/"}
//           onClick={() => navigate("/")}
//         />

//         {/* Dashboard Button (Icon changed to FaThLarge grid) */}
//         <SidebarButton
//           icon={<FaThLarge />}
//           text="Dashboard"
//           isOpen={isOpen}
//           active={location.pathname === "/dashboard"}
//           onClick={() => navigate("/dashboard")}
//         />

//         <SidebarButton
//           icon={<FaHistory />}
//           text="History"
//           isOpen={isOpen}
//           active={location.pathname === "/history"}
//           onClick={() => navigate("/history")}
//         />

//         <SidebarButton
//           icon={<FaUserTie />}
//           text="Interviewers"
//           isOpen={isOpen}
//           active={location.pathname === "/interviewers-list"}
//           onClick={() => navigate("/interviewers-list")}
//         />

//         <SidebarButton
//           icon={<FaTrophy />}
//           text="Leaderboard"
//           isOpen={isOpen}
//           active={location.pathname === "/leaderboard"}
//           onClick={() => navigate("/leaderboard")}
//         />

//         {/* Placeholder for messages if you have a route for it later */}
//         <SidebarButton
//           icon={<FaComments />}
//           text="Messages"
//           isOpen={isOpen}
//           active={location.pathname === "/messages"}
//         />

//         <SidebarButton
//           icon={<FaUser />}
//           text="Profile"
//           isOpen={isOpen}
//           active={location.pathname === "/profile"}
//           onClick={() => navigate("/profile")}
//         />
//       </div>
//     </aside>
//   );
// }

// function SidebarButton({ icon, text, isOpen, active = false, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`h-12 transition-all duration-300 flex items-center rounded-xl
//         ${isOpen ? "w-full px-5 gap-4 justify-start" : "w-12 h-12 justify-center"}
//         ${active ? "bg-[#2B66FF]/20 text-white border border-[#4F8CFF]/20" : "text-slate-300 hover:bg-white/5"}`}
//     >
//       <span className="text-[20px]">{icon}</span>
//       {isOpen && <span className="font-medium whitespace-nowrap">{text}</span>}
//     </button>
//   );
// }

// export default Sidebar;


//Topbar.jsx
// import { FaBell, FaEnvelope, FaCog, FaBars } from "react-icons/fa";
// import Logo from "./Logo";

// function Topbar() {
//   return (
//     <header
//   className="
//     h-16
//     border-b
//     border-white/5
//     px-10
//     flex
//     items-center
//     justify-between
//   "
// >
//   {/* Left Side */}
//   <div className="flex items-center gap-5">

//     <Logo />
//   </div>

//   {/* Right Side */}
//   <div className="flex items-center gap-4">
//     <IconButton className="top-button">
//       <FaBell />
//     </IconButton>

//     <IconButton className="top-button">
//       <FaEnvelope />
//     </IconButton>

//     <IconButton className="top-button">
//       <FaCog />
//     </IconButton>
//   </div>
// </header>
//   );
// }

// function IconButton({ children, className = "" }) {
//   return <button className={className}>{children}</button>;
// }

// export default Topbar;



//InterviewerProfile.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchWithAuth } from "../api/api";
// import DashboardLayout from "../layouts/DashboardLayout";
// import DashboardContainer from "../components/dashboard/DashboardContainer";
// import {
//   FaStar,
//   FaBriefcase,
//   FaCode,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaArrowLeft,
//   FaAward,
// } from "react-icons/fa";
// import { useToast } from "../context/ToastContext";

// const InterviewerProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   const [interviewer, setInterviewer] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [isRequesting, setIsRequesting] = useState(false);

//   useEffect(() => {
//     async function getProfile() {
//       try {
//         const data = await fetchWithAuth(`/interviewers/${id}`);
//         const reviewData = await fetchWithAuth(`/interviewers/${id}/reviews`);
//         setReviews(reviewData.reviews);
//         setInterviewer(data);
//       } catch (err) {
//         showToast(err.message, "error");
//       }
//     }
//     getProfile();
//   }, [id, showToast]);

//   if (!interviewer) {
//     return (
//       <DashboardLayout>
//         <DashboardContainer>
//           <div className="flex items-center justify-center h-[40vh]">
//             <p className="text-slate-400 text-xl animate-pulse">
//               Loading profile...
//             </p>
//           </div>
//         </DashboardContainer>
//       </DashboardLayout>
//     );
//   }

//   async function handleInterviewRequest() {
//     try {
//       setIsRequesting(true);
//       await fetchWithAuth("/interview", {
//         method: "POST",
//         body: JSON.stringify({
//           interviewerId: interviewer._id,
//           category: interviewer.category,
//         }),
//       });
//       showToast("Interview request sent successfully!", "success");
//       navigate("/my-requests");
//     } catch (err) {
//       showToast(err.message || "Failed to send request", "error");
//     } finally {
//       setIsRequesting(false);
//     }
//   }

//   const renderStars = (rating) => {
//     const safeRating = rating || 0;
//     return (
//       <div className="flex gap-0.5">
//         {[1, 2, 3, 4, 5].map((num) => (
//           <FaStar
//             key={num}
//             className={`text-[13px] ${
//               safeRating >= num ? "text-amber-400" : "text-slate-700"
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };

//   const skills =
//     interviewer?.skills?.length > 0
//       ? interviewer.skills
//       : interviewer.category
//         ? [interviewer.category]
//         : ["General Interviewer"];

//   const stats = [
//     {
//       label: "Rating",
//       value: interviewer.rating ? interviewer.rating.toFixed(1) : "—",
//     },
//     {
//       label: "Experience",
//       value: `${interviewer.experience || 0}yr${
//         interviewer.experience !== 1 ? "s" : ""
//       }`,
//     },
//     { label: "Reviews", value: reviews.length },
//   ];

//   return (
//     <DashboardLayout>
//       <DashboardContainer>
//         <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 mt-2 pb-16">
//           {/* ── Back button ── */}
//           <button
//             onClick={() => navigate("/interviewers-list")}
//             className="flex items-center gap-2 text-slate-400 hover:text-[#4C8EFF] w-fit transition-colors text-[14px] font-medium group"
//           >
//             <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
//             Back to Interviewers
//           </button>

//           <h1 className="text-[28px] font-bold text-white tracking-tight">
//             Interviewer's Profile
//           </h1>

//           {/* ── Profile hero card ── */}
//           <div
//             className="relative rounded-[22px] overflow-hidden border border-white/[0.07] shadow-2xl"
//             style={{ background: "#0c1628" }}
//           >
//             {/* Thin gradient accent bar along the top */}
//             <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1A62DA] via-[#5fa0ff] to-[#1A62DA]" />

//             {/* Subtle radial glow behind avatar */}
//             <div
//               className="absolute inset-0 pointer-events-none"
//               style={{
//                 backgroundImage:
//                   "radial-gradient(ellipse at 15% 60%, rgba(47,125,255,0.12) 0%, transparent 55%)",
//               }}
//             />

//             {/* Top section: avatar + info */}
//             <div className="relative p-7 flex flex-col sm:flex-row gap-6 items-start">
//               {/* Avatar with availability ring */}
//               <div className="relative shrink-0">
//                 <img
//                   src={
//                     interviewer.profilePicture ||
//                     `https://ui-avatars.com/api/?name=${
//                       interviewer.name || "I"
//                     }&background=2F7DFF&color=fff&rounded=true&size=256`
//                   }
//                   alt={interviewer.name}
//                   className={`w-36 h-36 sm:w-40 sm:h-40 rounded-2xl object-cover bg-[#08111f] ${
//                     interviewer.isAvailable
//                       ? "ring-2 ring-emerald-500/50 shadow-[0_0_22px_rgba(16,185,129,0.2)]"
//                       : "ring-2 ring-slate-700/60"
//                   }`}
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = `https://ui-avatars.com/api/?name=${
//                       interviewer.name || "I"
//                     }&background=2F7DFF&color=fff&rounded=true&size=256`;
//                   }}
//                 />
//                 {/* Online/offline dot */}
//                 <span
//                   className={`absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full border-2 border-[#0c1628] ${
//                     interviewer.isAvailable ? "bg-emerald-400" : "bg-slate-600"
//                   }`}
//                 />
//               </div>

//               {/* Name, rating, meta */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between gap-3 flex-wrap">
//                   <div>
//                     <h2 className="text-2xl sm:text-[28px] font-bold text-white leading-tight tracking-tight">
//                       {interviewer.name}
//                     </h2>
//                     <div className="flex items-center gap-2 mt-2">
//                       {renderStars(interviewer.rating)}
//                       <span className="text-white font-semibold text-sm">
//                         {interviewer.rating
//                           ? interviewer.rating.toFixed(1)
//                           : "0.0"}
//                       </span>
//                       <span className="text-slate-500 text-xs">
//                         · {reviews.length}{" "}
//                         {reviews.length === 1 ? "review" : "reviews"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Availability pill */}
//                   {interviewer.isAvailable ? (
//                     <span className="flex items-center gap-1.5 text-emerald-400 text-[12px] font-semibold bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full shrink-0">
//                       <FaCheckCircle className="text-[10px]" /> Available
//                     </span>
//                   ) : (
//                     <span className="flex items-center gap-1.5 text-rose-400 text-[12px] font-semibold bg-rose-500/10 border border-rose-500/25 px-3 py-1.5 rounded-full shrink-0">
//                       <FaTimesCircle className="text-[10px]" /> Unavailable
//                     </span>
//                   )}
//                 </div>

//                 {/* Experience */}
//                 <div className="flex items-center gap-2.5 mt-4 text-slate-300 text-[14px]">
//                   <FaBriefcase className="text-[#4C8EFF] shrink-0 text-[13px]" />
//                   <span>
//                     <span className="text-white font-medium">
//                       {interviewer.experience || 0} yr
//                       {interviewer.experience !== 1 ? "s" : ""}
//                     </span>{" "}
//                     experience
//                     {interviewer.currentCompany && (
//                       <>
//                         {" "}
//                         ·{" "}
//                         <span className="text-slate-400">
//                           at {interviewer.currentCompany}
//                         </span>
//                       </>
//                     )}
//                   </span>
//                 </div>

//                 {/* Skills as pill badges */}
//                 <div className="flex items-start gap-2.5 mt-3">
//                   <FaCode className="text-[#4C8EFF] shrink-0 text-[13px] mt-[3px]" />
//                   <div className="flex flex-wrap gap-1.5">
//                     {skills.map((skill, i) => (
//                       <span
//                         key={i}
//                         className="bg-[#2F7DFF]/10 border border-[#2F7DFF]/25 text-[#7fb3ff] text-[11px] font-semibold px-2.5 py-1 rounded-full"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Bio with left accent */}
//                 {interviewer.bio && (
//                   <div className="mt-5 pl-4 border-l-2 border-[#2F7DFF]/40">
//                     <p className="text-slate-400 text-[13px] italic leading-relaxed">
//                       {interviewer.bio}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Stats bar */}
//             <div className="relative border-t border-white/[0.06] grid grid-cols-3 divide-x divide-white/[0.06]">
//               {stats.map(({ label, value }) => (
//                 <div
//                   key={label}
//                   className="flex flex-col items-center py-5 gap-0.5"
//                 >
//                   <span className="text-[22px] font-bold text-white leading-none">
//                     {value}
//                   </span>
//                   <span className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-medium">
//                     {label}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ── Reviews section ── */}
//           <div className="w-full">
//             <div className="flex items-center gap-2.5 mb-5">
//               <h3 className="text-[18px] font-bold text-white">Reviews</h3>
//               {reviews.length > 0 && (
//                 <span className="bg-[#2F7DFF]/10 border border-[#2F7DFF]/25 text-[#7fb3ff] text-[11px] font-semibold px-2 py-0.5 rounded-full">
//                   {reviews.length}
//                 </span>
//               )}
//             </div>

//             {reviews.length === 0 ? (
//               <div className="p-10 rounded-2xl text-center border border-white/[0.06] bg-[#0c1628]">
//                 <FaAward className="mx-auto text-3xl text-slate-700 mb-3" />
//                 <p className="text-slate-400 text-[14px]">No reviews yet.</p>
//                 <p className="text-slate-600 text-[12px] mt-1">
//                   Be the first after your interview!
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {reviews.map((review) => {
//                   const initial = review.intervieweeId?.name
//                     ? review.intervieweeId.name.charAt(0).toUpperCase()
//                     : "U";

//                   return (
//                     <div
//                       key={review._id}
//                       className="rounded-2xl border border-white/[0.06] bg-[#0c1628] p-5 flex gap-4 items-start"
//                     >
//                       {/* Avatar */}
//                       <div className="shrink-0 w-10 h-10 rounded-full bg-[#2F7DFF]/10 flex items-center justify-center text-[#4C8EFF] font-bold text-[15px] border border-[#2F7DFF]/20">
//                         {initial}
//                       </div>

//                       {/* Content */}
//                       <div className="flex-1 min-w-0">
//                         <p className="text-white font-semibold text-[14px] leading-tight">
//                           {review.intervieweeId?.name || "Anonymous"}
//                         </p>
//                         <div className="mt-1.5 mb-2.5">
//                           {renderStars(review.rating)}
//                         </div>
//                         <p className="text-slate-400 text-[13px] leading-relaxed">
//                           {review.feedback}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* ── CTA button ── */}
//           <div className="w-full mt-2">
//             {interviewer.isAvailable ? (
//               <button
//                 onClick={handleInterviewRequest}
//                 disabled={isRequesting}
//                 className="w-full py-4 rounded-2xl font-semibold text-[15px] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #2F7DFF 0%, #1A62DA 100%)",
//                   boxShadow: "0 4px 28px rgba(47,125,255,0.35)",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.boxShadow =
//                     "0 4px 36px rgba(47,125,255,0.5)")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.boxShadow =
//                     "0 4px 28px rgba(47,125,255,0.35)")
//                 }
//               >
//                 {isRequesting ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg
//                       className="animate-spin h-4 w-4"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                       />
//                     </svg>
//                     Sending Request...
//                   </span>
//                 ) : (
//                   "Request Interview"
//                 )}
//               </button>
//             ) : (
//               <button
//                 disabled
//                 className="w-full py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-600 font-semibold text-[15px] cursor-not-allowed"
//               >
//                 Currently Unavailable
//               </button>
//             )}
//           </div>
//         </div>
//       </DashboardContainer>
//     </DashboardLayout>
//   );
// };

// export default InterviewerProfile;


// import React, { useEffect, useState } from "react";
// import { fetchWithAuth } from "../api/api";
// import { useNavigate } from "react-router-dom";
// import AvailabilityBadge from "../components/AvailabilityBadge";
// import { LEVELS } from "../constants/appConstants";
// import { CATEGORIES } from "../constants/appConstants";

// const InterviewersList = () => {
//   const [interviewers, setInterviewers] = useState([]);
//   const [requestSent, setRequestSent] = useState([]);

//   const [selectedCategory, setSelectedCategory] = useState("");

//   const [selectedLevel, setSelectedLevel] = useState("");
//   const navigate = useNavigate();

//   async function handleInterviewRequest(interviewerId) {
//     if (!selectedCategory || !selectedLevel) {
//       alert("Please select category and level");

//       return;
//     }
//     try {
//       const data = await fetchWithAuth("/interview", {
//         method: "POST",
//         body: JSON.stringify({
//           interviewerId,
//           category: selectedCategory,
//           level: selectedLevel,
//         }),
//       });
//       setRequestSent((prev) => [...prev, interviewerId]);
//     } catch (err) {
//       console.log(err.message);
//     }
//   }

//   function getInterviewerLevel(interviewer) {
//     if (interviewer.interviewsTaken >= 20 && interviewer.rating >= 4) {
//       return "Pro";
//     }

//     if (interviewer.interviewsTaken >= 5) {
//       return "Intermediate";
//     }

//     return "Beginner";
//   }

//   async function getInterviewers() {
//     try {
//       const data = await fetchWithAuth(
//         `/interviewers?category=${selectedCategory}`,
//       );

//       const filtered = data.filter((interviewer) => {
//         return getInterviewerLevel(interviewer) === selectedLevel;
//       });

//       setInterviewers(filtered);
//     } catch (err) {
//       console.log(err.message);
//     }
//   }

//   useEffect(() => {
//     async function getMyRequests() {
//       try {
//         const data = await fetchWithAuth("/interview/my");
//         const myRequests = data.requests;
//         const ids = myRequests
//           .filter((request) => request.interviewerId)
//           .map((request) => request.interviewerId._id);
//         setRequestSent(ids);
//       } catch (err) {
//         alert(err.message);
//       }
//     }
//     getMyRequests();
//   }, []);

//   return (
//     <div>
//       <div>
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//         >
//           <option value="">Select Category</option>
//           {CATEGORIES.map((category) => (
//             <option key={category} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>

//         <select
//           value={selectedLevel}
//           onChange={(e) => setSelectedLevel(e.target.value)}
//         >
//         <option value="">Select level</option>
//           {LEVELS.map((level) => (
//             <option key={level} value={level}>
//               {level}
//             </option>
//           ))}
//         </select>
//       </div>

//       <h2>InterviewersList</h2>

//       <button onClick={getInterviewers}>Search Interviewers</button>

//       {interviewers.map((interviewer) => (
//         <div key={interviewer._id}>
//           {interviewer.profilePicture && (
//             <img
//               src={interviewer.profilePicture}
//               alt="Profile"
//               width="80"
//               height="80"
//             />
//           )}

//           <p>Name: {interviewer.name} </p>
//           <p>
//             Status:
//             <AvailabilityBadge isAvailable={interviewer.isAvailable} />
//           </p>
//           <p>Category: {interviewer.category} </p>
//           <p>Level: {getInterviewerLevel(interviewer)}</p>
//           <p>
//             Skills:
//             {interviewer?.skills?.length > 0
//               ? interviewer.skills.join(", ")
//               : "No skills added"}
//           </p>
//           {interviewer.isAvailable ? (
//             <button
//               onClick={() => handleInterviewRequest(interviewer._id)}
//               disabled={requestSent.includes(interviewer._id)}
//             >
//               {requestSent.includes(interviewer._id)
//                 ? "Request Sent"
//                 : "Request Interview"}
//             </button>
//           ) : (
//             <button disabled>Unavailable</button>
//           )}
//           <button onClick={() => navigate(`/interviewers/${interviewer._id}`)}>
//             View Profile
//           </button>
//         </div>
//       ))}
//       <button onClick={() => navigate("/my-requests")}>View My Requests</button>
//       <button onClick={() => navigate("/received-requests")}>
//         View Received Requests
//       </button>
//     </div>
//   );
// };

// export default InterviewersList;


// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// import { FaCheck } from "react-icons/fa";
// import VideoSection from "../components/interviewRoom/VideoSection";
// import ChatSection from "../components/interviewRoom/ChatSection";
// import CodeEditorSection from "../components/interviewRoom/CodeEditorSection";
// import InterviewControls from "../components/interviewRoom/InterviewControls";

// const socket = io("http://localhost:8080");
// const TOTAL_SECONDS = 3600;

// const InterviewRoom = () => {
//   const { interviewId } = useParams();

//   const [status, setStatus] = useState("Waiting for other participant...");
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [isMuted, setIsMuted] = useState(false);
//   const [isCameraOff, setIsCameraOff] = useState(false);
//   const [isSharingScreen, setIsSharingScreen] = useState(false);
//   const [code, setCode] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("javascript");
//   const [output, setOutput] = useState("");
//   const [timeLeft, setTimeLeft] = useState(3600);
//   const [connectionStatus, setConnectionStatus] = useState("Connected");
//   const [isExecuting, setIsExecuting] = useState(false);
//   const [interviewEnded, setInterviewEnded] = useState(false);

//   const [interviewCategory, setInterviewCategory] = useState(null);
//   const [isCategoryLoading, setIsCategoryLoading] = useState(true);

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const screenShareRef = useRef(null);

//   useEffect(() => {
//     async function fetchInterviewDetails() {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `http://localhost:8080/interview/${interviewId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const data = await response.json();
//         if (response.ok) {
//           setInterviewCategory(data.category);
//         }
//       } catch (err) {
//         console.log("Failed to fetch interview details:", err);
//       } finally {
//         setIsCategoryLoading(false);
//       }
//     }
//     fetchInterviewDetails();
//   }, [interviewId]);

//   const isTechInterview =
//     interviewCategory?.toLowerCase().includes("tech") ?? false;

//   const sessionTitle = isTechInterview
//     ? "Technical Interview"
//     : interviewCategory
//     ? `${interviewCategory.charAt(0).toUpperCase()}${interviewCategory.slice(1)} Interview`
//     : "Interview Session";

//   useEffect(() => {
//     socket.on("user-joined", async () => {
//       setStatus("Other participant joined!");
//       setConnectionStatus("Connected");
//       const offer = await peerConnectionRef.current.createOffer();
//       await peerConnectionRef.current.setLocalDescription(offer);
//       socket.emit("offer", { interviewId, offer });
//     });

//     socket.on("receive-offer", async (offer) => {
//       setStatus("Incoming connection...");
//       await peerConnectionRef.current.setRemoteDescription(offer);
//       const answer = await peerConnectionRef.current.createAnswer();
//       await peerConnectionRef.current.setLocalDescription(answer);
//       setStatus("Connection established!");
//       socket.emit("answer", { interviewId, answer });
//     });

//     socket.on("receive-answer", async (answer) => {
//       await peerConnectionRef.current.setRemoteDescription(answer);
//       setStatus("Connection established!");
//     });

//     socket.on("receive-ice-candidate", async (candidate) => {
//       try {
//         await peerConnectionRef.current.addIceCandidate(candidate);
//       } catch (err) {
//         console.log("ICE ADD ERROR", err);
//       }
//     });

//     socket.on("receive-message", (message) => {
//       setMessages((prev) => [...prev, { text: message, sender: "other" }]);
//     });

//     socket.on("receive-code", (newCode) => setCode(newCode));
//     socket.on("receive-output", (output) => setOutput(output));
//     socket.on("timer-update", (time) => setTimeLeft(time));
//     socket.on("participant-disconnected", () =>
//       setConnectionStatus("Other participant disconnected")
//     );

//     socket.on("interview-ended", () => {
//       cleanupInterview();
//       setInterviewEnded(true);
//       alert("Interview has been ended by the other participant");
//       window.location.href = "/history";
//     });

//     return () => {
//       socket.off("user-joined");
//       socket.off("receive-offer");
//       socket.off("receive-answer");
//       socket.off("receive-ice-candidate");
//       socket.off("receive-message");
//       socket.off("receive-code");
//       socket.off("receive-output");
//       socket.off("timer-update");
//       socket.off("participant-disconnected");
//       socket.off("interview-ended");
//     };
//   }, [interviewId]);

//   useEffect(() => {
//     async function startMedia() {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         localStreamRef.current = stream;
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;

//         const peer = new RTCPeerConnection({
//           iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//         });
//         peerConnectionRef.current = peer;

//         peer.onicecandidate = (event) => {
//           if (event.candidate)
//             socket.emit("ice-candidate", {
//               interviewId,
//               candidate: event.candidate,
//             });
//         };

//         socket.emit("join-room", interviewId);
//         stream.getTracks().forEach((track) => peer.addTrack(track, stream));
//         peer.ontrack = (event) => {
//           if (remoteVideoRef.current)
//             remoteVideoRef.current.srcObject = event.streams[0];
//         };
//       } catch (err) {
//         console.log("MEDIA ERROR:", err);
//         alert("Camera or microphone access denied");
//       }
//     }
//     startMedia();

//     return () => {
//       localStreamRef.current?.getTracks().forEach((t) => t.stop());
//       peerConnectionRef.current?.close();
//     };
//   }, []);

//   function handleSendMessage() {
//     if (!messageInput.trim()) return;
//     socket.emit("send-message", { interviewId, message: messageInput });
//     setMessages((prev) => [...prev, { text: messageInput, sender: "me" }]);
//     setMessageInput("");
//   }

//   function toggleMute() {
//     const audioTrack = localStreamRef.current?.getAudioTracks()[0];
//     if (!audioTrack) return;
//     audioTrack.enabled = !audioTrack.enabled;
//     setIsMuted(!audioTrack.enabled);
//   }

//   function toggleCamera() {
//     const videoTrack = localStreamRef.current?.getVideoTracks()[0];
//     if (!videoTrack) return;
//     videoTrack.enabled = !videoTrack.enabled;
//     setIsCameraOff(!videoTrack.enabled);
//   }

//   async function shareScreen() {
//     try {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//       });
//       const screenTrack = screenStream.getVideoTracks()[0];

//       // When the user stops sharing via the browser's native "Stop sharing" button
//       screenTrack.onended = async () => {
//         const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
//         const sender = peerConnectionRef.current
//           ?.getSenders()
//           .find((s) => s.track?.kind === "video");
//         // Restore camera track in WebRTC so remote sees camera again
//         if (sender && cameraTrack) await sender.replaceTrack(cameraTrack);
//         // localVideoRef already shows the camera stream — no change needed
//         setIsSharingScreen(false);
//       };

//       screenShareRef.current = screenTrack;

//       // ── KEY FIX ──────────────────────────────────────────────────────────
//       // Do NOT set localVideoRef.srcObject = screenStream here.
//       // That caused the local "You" PiP to display the screen share, which
//       // created an infinite recursive mirror when the shared page was this
//       // same interview room.
//       // The PiP continues to show the camera stream (localStreamRef) so the
//       // user can still monitor their own appearance while sharing.
//       // ─────────────────────────────────────────────────────────────────────

//       // Only swap the track sent to the remote participant via WebRTC
//       const sender = peerConnectionRef.current
//         .getSenders()
//         .find((s) => s.track?.kind === "video");
//       if (sender) await sender.replaceTrack(screenTrack);

//       setIsSharingScreen(true);
//     } catch (err) {
//       console.log("SCREEN SHARE ERROR", err);
//     }
//   }

//   async function stopScreenShare() {
//     const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
//     const sender = peerConnectionRef.current
//       ?.getSenders()
//       .find((s) => s.track?.kind === "video");
//     // Restore camera track in WebRTC
//     if (sender && cameraTrack) await sender.replaceTrack(cameraTrack);
//     // localVideoRef was never changed — still shows camera, nothing to restore
//     screenShareRef.current?.stop();
//     setIsSharingScreen(false);
//   }

//   function handleCodeChange(value) {
//     const newCode = value || "";
//     setCode(newCode);
//     socket.emit("code-change", { interviewId, code: newCode });
//   }

//   async function handleRunCode() {
//     if (isExecuting) return;
//     try {
//       setIsExecuting(true);
//       setOutput("Running...");
//       const response = await fetch("http://localhost:8080/execute", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sourceCode: code, language: selectedLanguage }),
//       });
//       const data = await response.json();
//       setOutput(data.output);
//       socket.emit("output-change", { interviewId, output: data.output });
//     } catch (err) {
//       console.log(err);
//       setOutput("Failed to connect to server");
//     } finally {
//       setIsExecuting(false);
//     }
//   }

//   function formatTime(seconds) {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
//   }

//   function cleanupInterview() {
//     localStreamRef.current?.getTracks().forEach((t) => t.stop());
//     peerConnectionRef.current?.close();
//     if (localVideoRef.current) localVideoRef.current.srcObject = null;
//     if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
//   }

//   async function handleEndInterview() {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `http://localhost:8080/interview/${interviewId}/complete`,
//         { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
//       );
//       const data = await response.json();
//       if (!response.ok) { alert(data.message); return; }
//       socket.emit("end-interview", interviewId);
//       cleanupInterview();
//       setInterviewEnded(true);
//       alert("Interview completed");
//       window.location.href = "/history";
//     } catch (err) {
//       console.log(err);
//       alert("Failed to complete interview");
//     }
//   }

//   const timePct = Math.max(0, Math.min(1, timeLeft / TOTAL_SECONDS));
//   const timerColor =
//     timePct > 0.5 ? "#5B8DEF" : timePct > 0.2 ? "#F5A623" : "#FB7185";
//   const ringRadius = 17;
//   const ringCircumference = 2 * Math.PI * ringRadius;
//   const ringOffset = ringCircumference * (1 - timePct);

//   // Pass isSharingScreen so VideoSection can show a badge on the PiP
//   const videoProps = {
//     localVideoRef,
//     remoteVideoRef,
//     status,
//     isMuted,
//     isCameraOff,
//     isSharingScreen,
//   };
//   const chatProps = { messages, messageInput, setMessageInput, handleSendMessage };
//   const controlProps = {
//     isMuted, toggleMute, isCameraOff, toggleCamera,
//     isSharingScreen, shareScreen, stopScreenShare, handleEndInterview,
//   };

//   function renderSessionHeader() {
//     return (
//       <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06] bg-[#0b1221] shrink-0">
//         <div className="flex items-center gap-3.5">
//           <div className="w-9 h-9 rounded-xl bg-[#5B8DEF]/15 border border-[#5B8DEF]/25 flex items-center justify-center">
//             <span className="w-2 h-2 rounded-full bg-[#5B8DEF]" />
//           </div>
//           <div>
//             <h2
//               className="text-[17px] font-semibold tracking-tight text-white leading-tight"
//               style={{ fontFamily: "'Space Grotesk', sans-serif" }}
//             >
//               {sessionTitle}
//             </h2>
//             <div className="flex items-center gap-2 mt-0.5">
//               <span
//                 className="text-[10.5px] font-medium text-slate-500 tracking-wide"
//                 style={{ fontFamily: "'JetBrains Mono', monospace" }}
//               >
//                 {interviewId.slice(0, 8).toUpperCase()}
//               </span>
//               <span className="w-1 h-1 rounded-full bg-slate-600" />
//               <span
//                 className={`flex items-center gap-1.5 text-[10.5px] font-semibold ${
//                   connectionStatus === "Connected" ? "text-emerald-400" : "text-amber-400"
//                 }`}
//               >
//                 <span
//                   className={`w-1.5 h-1.5 rounded-full ${
//                     connectionStatus === "Connected"
//                       ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]"
//                       : "bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(245,166,35,0.7)]"
//                   }`}
//                 />
//                 {connectionStatus}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
//             Time Left
//           </span>
//           <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
//             <svg viewBox="0 0 40 40" className="w-12 h-12 -rotate-90">
//               <circle cx="20" cy="20" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
//               <circle
//                 cx="20" cy="20" r={ringRadius} fill="none" stroke={timerColor} strokeWidth="3"
//                 strokeLinecap="round" strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
//                 className={timePct <= 0.2 ? "animate-pulse" : ""}
//                 style={{ transition: "stroke-dashoffset 1s linear, stroke 0.6s ease" }}
//               />
//             </svg>
//           </div>
//           <div
//             className="px-3.5 py-1.5 rounded-lg border font-bold tracking-wider text-[15px]"
//             style={{
//               fontFamily: "'JetBrains Mono', monospace",
//               color: timerColor,
//               backgroundColor: `${timerColor}1A`,
//               borderColor: `${timerColor}33`,
//             }}
//           >
//             {formatTime(timeLeft)}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isCategoryLoading) {
//     return (
//       <div
//         className="flex h-screen w-full items-center justify-center bg-[#070B14]"
//         style={{ fontFamily: "'Inter', sans-serif" }}
//       >
//         <div className="flex flex-col items-center gap-4">
//           <span className="w-10 h-10 rounded-full border-2 border-[#5B8DEF]/40 border-t-[#5B8DEF] animate-spin" />
//           <p className="text-slate-500 text-sm">Setting up your interview room…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
//         @keyframes ivPulseRing {
//           0% { transform: scale(0.9); opacity: 0.8; }
//           70% { transform: scale(1.6); opacity: 0; }
//           100% { transform: scale(1.6); opacity: 0; }
//         }
//         .animate-iv-pulse-ring { animation: ivPulseRing 2.2s ease-out infinite; }
//         @keyframes ivMsgIn {
//           from { opacity: 0; transform: translateY(6px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .iv-msg-in { animation: ivMsgIn 0.25s ease-out; }
//         @keyframes ivEndIn {
//           from { opacity: 0; transform: scale(0.96); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         .iv-end-in { animation: ivEndIn 0.4s ease-out; }
//         @media (prefers-reduced-motion: reduce) {
//           .animate-iv-pulse-ring, .iv-msg-in, .iv-end-in { animation: none !important; }
//         }
//       `}</style>

//       <div
//         className="flex h-screen w-full bg-[#070B14] text-white overflow-hidden"
//         style={{ fontFamily: "'Inter', sans-serif" }}
//       >
//         {isTechInterview ? (
//           <>
//             {/* ── TECH: code editor left, video/chat right ── */}
//             <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.06]">
//               {renderSessionHeader()}
//               <div className="flex-1 flex flex-col min-h-0 bg-[#070b14]">
//                 <CodeEditorSection
//                   selectedLanguage={selectedLanguage}
//                   setSelectedLanguage={setSelectedLanguage}
//                   code={code}
//                   handleCodeChange={handleCodeChange}
//                   output={output}
//                   handleRunCode={handleRunCode}
//                   isExecuting={isExecuting}
//                 />
//               </div>
//             </div>
//             <div className="w-[420px] xl:w-[480px] 2xl:w-[560px] flex flex-col shrink-0 bg-[#0b1221] shadow-2xl z-10">
//               <div className="p-4 border-b border-white/[0.06]">
//                 <VideoSection {...videoProps} />
//               </div>
//               <div className="flex-1 flex flex-col min-h-0">
//                 <ChatSection {...chatProps} />
//               </div>
//               <div className="border-t border-white/[0.06] bg-[#070b14]">
//                 <InterviewControls {...controlProps} />
//               </div>
//             </div>
//           </>
//         ) : (
//           /* ── NON-TECH: full-screen video call layout ── */
//           <div className="flex-1 flex flex-col min-h-0 bg-[#0b1221]">
//             {renderSessionHeader()}

//             <div className="flex-1 flex min-h-0">
//               {/* Video pane */}
//               <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#070b14] relative overflow-hidden">
//                 <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(91,141,239,0.06)_0%,transparent_70%)]" />
//                 <div className="w-full max-w-[680px] relative z-10">
//                   <VideoSection {...videoProps} />
//                 </div>
//                 <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
//                   <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-slate-400">
//                     {status}
//                   </span>
//                 </div>
//               </div>

//               {/* Chat sidebar */}
//               <div className="w-[340px] shrink-0 flex flex-col border-l border-white/[0.06] bg-[#0b1221]">
//                 <ChatSection {...chatProps} />
//               </div>
//             </div>

//             <div className="border-t border-white/[0.06] bg-[#070b14] shrink-0">
//               <InterviewControls {...controlProps} />
//             </div>
//           </div>
//         )}

//         {interviewEnded && (
//           <div className="absolute inset-0 bg-[#070B14]/85 backdrop-blur-md z-50 flex flex-col items-center justify-center iv-end-in">
//             <div className="w-16 h-16 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center mb-5">
//               <FaCheck className="text-[#34D399] text-2xl" />
//             </div>
//             <h2
//               className="text-3xl font-semibold text-white mb-2"
//               style={{ fontFamily: "'Space Grotesk', sans-serif" }}
//             >
//               Interview Ended
//             </h2>
//             <p className="text-slate-500 text-[14px]">Redirecting to history…</p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default InterviewRoom;



// import React, { useEffect, useState } from "react";
// import { fetchWithAuth } from "../api/api";
// import { useNavigate } from "react-router-dom";
// import DashboardLayout from "../layouts/DashboardLayout";
// import DashboardContainer from "../components/dashboard/DashboardContainer";
// import { useToast } from "../context/ToastContext";
// import {
//   FaTrophy,
//   FaStar,
//   FaMedal,
//   FaUserTie,
//   FaChevronRight,
// } from "react-icons/fa";

// const Leaderboard = () => {
//   const [interviewers, setInterviewers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   useEffect(() => {
//     async function getLeaderboard() {
//       try {
//         const data = await fetchWithAuth("/leaderboard");
//         setInterviewers(data.interviewers || []);
//       } catch (err) {
//         showToast(err.message || "Failed to load leaderboard", "error");
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     getLeaderboard();
//   }, [showToast]);

//   // Helper to render the specific medal/trophy colors
//   const getRankBadge = (index) => {
//     if (index === 0)
//       return (
//         <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(250,204,21,0.3)] border border-yellow-500/30">
//           <FaTrophy />
//         </div>
//       );
//     if (index === 1)
//       return (
//         <div className="w-10 h-10 rounded-full bg-slate-300/20 text-slate-300 flex items-center justify-center text-xl border border-slate-300/30">
//           <FaMedal />
//         </div>
//       );
//     if (index === 2)
//       return (
//         <div className="w-10 h-10 rounded-full bg-orange-400/20 text-orange-400 flex items-center justify-center text-xl border border-orange-400/30">
//           <FaMedal />
//         </div>
//       );
//     return (
//       <div className="w-10 h-10 rounded-full bg-white/5 text-slate-400 flex items-center justify-center text-lg font-bold border border-white/10">
//         #{index + 1}
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <DashboardLayout>
//         <DashboardContainer>
//           <div className="flex items-center justify-center h-[40vh]">
//             <p className="text-slate-400 text-xl animate-pulse">
//               Loading rankings...
//             </p>
//           </div>
//         </DashboardContainer>
//       </DashboardLayout>
//     );
//   }

//   const topThree = interviewers.slice(0, 3);
//   const theRest = interviewers.slice(3);

//   return (
//     <DashboardLayout>
//       <DashboardContainer>
//         <div className="flex flex-col w-full max-w-[1000px] mx-auto mt-2 pb-12">
//           {/* Header */}
//           <div className="flex flex-col gap-2 w-full mb-10 text-center items-center">
//             <div className="w-16 h-16 rounded-2xl bg-[#2F7DFF]/20 text-[#4C8EFF] flex items-center justify-center text-3xl mb-2 border border-[#2F7DFF]/30 shadow-[0_0_30px_rgba(47,125,255,0.2)]">
//               <FaTrophy />
//             </div>
//             <h1 className="text-[40px] font-extrabold text-white tracking-tight">
//               Top Interviewers
//             </h1>
//             <p className="text-slate-400 text-[16px] max-w-lg">
//               The highest-rated professionals on PrepStack, ranked by peer
//               reviews and interviews completed.
//             </p>
//           </div>

//           {interviewers.length === 0 ? (
//             <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 border border-white/5">
//               No ranked interviewers yet.
//             </div>
//           ) : (
//             <>
//               {/* TOP 3 PODIUM GRID */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//                 {topThree.map((user, index) => {
//                   let borderGlow = "border-white/5";
//                   if (index === 0)
//                     borderGlow =
//                       "border-yellow-500/40 shadow-[0_0_30px_rgba(250,204,21,0.15)] bg-gradient-to-b from-yellow-500/10 to-[#131d30]/60";
//                   if (index === 1)
//                     borderGlow =
//                       "border-slate-300/30 shadow-[0_0_20px_rgba(203,213,225,0.1)] bg-gradient-to-b from-slate-300/5 to-[#131d30]/60";
//                   if (index === 2)
//                     borderGlow =
//                       "border-orange-400/30 shadow-[0_0_20px_rgba(251,146,60,0.1)] bg-gradient-to-b from-orange-400/5 to-[#131d30]/60";

//                   return (
//                     <div
//                       key={user._id}
//                       onClick={() => navigate(`/interviewers/${user._id}`)}
//                       className={`glass-panel p-6 rounded-3xl border flex flex-col items-center text-center cursor-pointer hover:-translate-y-2 transition-transform duration-300 ${borderGlow} ${index === 0 ? "md:-mt-6" : ""}`}
//                     >
//                       <div className="absolute -top-4">
//                         {getRankBadge(index)}
//                       </div>

//                       <img
//                         src={
//                           user.profilePicture ||
//                           `https://ui-avatars.com/api/?name=${user.name || "U"}&background=202B46&color=fff&rounded=true&size=128`
//                         }
//                         alt={user.name}
//                         className={`w-24 h-24 rounded-full object-cover mt-4 mb-4 bg-[#08111f] shadow-lg border-2 ${index === 0 ? "border-yellow-400" : index === 1 ? "border-slate-300" : "border-orange-400"}`}
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = `https://ui-avatars.com/api/?name=${user.name || "U"}&background=202B46&color=fff&rounded=true&size=128`;
//                         }}
//                       />

//                       <h3 className="text-xl font-bold text-white mb-1 truncate w-full px-2">
//                         {user.name}
//                       </h3>
//                       <p className="text-[#4C8EFF] text-sm font-medium mb-4">
//                         {user.category || "General"}
//                       </p>

//                       <div className="flex w-full justify-between items-center bg-[#0b1425]/50 px-4 py-3 rounded-xl border border-white/5">
//                         <div className="flex flex-col items-start">
//                           <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
//                             Rating
//                           </span>
//                           <span className="text-white font-bold flex items-center gap-1">
//                             <FaStar className="text-yellow-400 text-xs" />{" "}
//                             {user.rating.toFixed(1)}
//                           </span>
//                         </div>
//                         <div className="h-6 w-px bg-white/10"></div>
//                         <div className="flex flex-col items-end">
//                           <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
//                             Reviews
//                           </span>
//                           <span className="text-white font-bold">
//                             {user.interviewsTaken}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* LIST FOR RANKS 4+ */}
//               {theRest.length > 0 && (
//                 <div className="flex flex-col gap-3">
//                   {theRest.map((user, index) => {
//                     const actualRank = index + 3; // +3 because they come after the top 3
//                     return (
//                       <div
//                         key={user._id}
//                         className="glass-panel px-6 py-4 rounded-2xl border border-white/5 bg-[#131d30]/40 flex items-center justify-between group hover:bg-[#131d30]/80 transition-colors"
//                       >
//                         <div className="flex items-center gap-5">
//                           {getRankBadge(actualRank)}

//                           <img
//                             src={
//                               user.profilePicture ||
//                               `https://ui-avatars.com/api/?name=${user.name || "U"}&background=202B46&color=fff&rounded=true&size=128`
//                             }
//                             alt={user.name}
//                             className="w-12 h-12 rounded-full object-cover border border-white/10"
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = `https://ui-avatars.com/api/?name=${user.name || "U"}&background=202B46&color=fff&rounded=true&size=128`;
//                             }}
//                           />

//                           <div className="flex flex-col">
//                             <h4 className="text-white font-bold text-[16px] leading-none mb-1">
//                               {user.name}
//                             </h4>
//                             <p className="text-slate-400 text-[13px]">
//                               {user.category}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-8">
//                           <div className="hidden sm:flex flex-col items-end">
//                             <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
//                               Rating
//                             </span>
//                             <span className="text-white font-medium flex items-center gap-1">
//                               <FaStar className="text-yellow-400 text-[10px]" />{" "}
//                               {user.rating.toFixed(2)}
//                             </span>
//                           </div>

//                           <div className="hidden sm:flex flex-col items-end">
//                             <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
//                               Sessions
//                             </span>
//                             <span className="text-white font-medium">
//                               {user.interviewsTaken}
//                             </span>
//                           </div>

//                           <button
//                             onClick={() =>
//                               navigate(`/interviewers/${user._id}`)
//                             }
//                             className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#2F7DFF] text-slate-400 hover:text-white flex items-center justify-center transition-all group-hover:bg-[#2F7DFF]/20 group-hover:text-[#4C8EFF]"
//                           >
//                             <FaChevronRight />
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </DashboardContainer>
//     </DashboardLayout>
//   );
// };

// export default Leaderboard;



/ import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useToast } from "../context/ToastContext";
// import { FaEnvelope, FaLock, FaPlay } from "react-icons/fa";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   async function handleLogin(e) {
//     e.preventDefault();
//     if (!email || !password) {
//       showToast("Please fill in all fields", "error");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const res = await fetch("http://localhost:8080/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         showToast(data.message, "error");
//         setIsLoading(false);
//         return;
//       }

//       localStorage.setItem("token", data.token);
//       showToast("Welcome back!", "success");
//       navigate("/dashboard");
//     } catch (err) {
//       showToast("Failed to connect to server", "error");
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
//       {/* Background ambient glow */}
//       <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#2F7DFF] blur-[150px] opacity-20 pointer-events-none"></div>

//       <div className="glass-card w-full max-w-md p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl bg-[#131d30]/80 relative z-10 animate-fade-in">
//         <div className="flex flex-col items-center mb-10">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F7DFF] to-[#1A62DA] flex items-center justify-center shadow-lg shadow-[#2F7DFF]/30 mb-4">
//             <FaPlay className="text-white ml-1" />
//           </div>
//           <h2 className="text-3xl font-bold text-white tracking-tight">
//             Welcome Back
//           </h2>
//           <p className="text-slate-400 mt-2 text-[15px]">
//             Sign in to continue to PrepStack
//           </p>
//         </div>

//         <form onSubmit={handleLogin} className="flex flex-col gap-5">
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#4C8EFF] transition-colors">
//               <FaEnvelope />
//             </div>
//             <input
//               type="email"
//               placeholder="Email address"
//               className="w-full bg-[#08111f]/50 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-[15px] text-white outline-none focus:border-[#4F8CFF] focus:ring-1 focus:ring-[#4F8CFF]/50 transition-all placeholder-slate-500"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#4C8EFF] transition-colors">
//               <FaLock />
//             </div>
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full bg-[#08111f]/50 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-[15px] text-white outline-none focus:border-[#4F8CFF] focus:ring-1 focus:ring-[#4F8CFF]/50 transition-all placeholder-slate-500"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full h-14 rounded-xl bg-gradient-to-r from-[#2F7DFF] to-[#1A62DA] hover:from-[#4C8EFF] hover:to-[#2F7DFF] text-white font-semibold text-[16px] transition-all shadow-[0_0_20px_rgba(47,125,255,0.3)] mt-2 disabled:opacity-50"
//           >
//             {isLoading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         <p className="text-center text-slate-400 mt-8 text-[15px]">
//           Don't have an account?{" "}
//           <Link
//             to="/signup"
//             className="text-[#4C8EFF] font-semibold hover:text-[#2F7DFF] transition-colors"
//           >
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;



// import React, { useEffect, useState } from "react";
// import { fetchWithAuth } from "../api/api";
// import { useNavigate } from "react-router-dom";
// import AvailabilityBadge from "../components/AvailabilityBadge";

// const MyProfile = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function getProfile() {
//       try {
//         const data = await fetchWithAuth("/profile");
//         setUser(data);
//       } catch (err) {
//         alert(err.message);
//       }
//     }

//     getProfile();
//   }, []);

//   if (!user) {
//     return <p>Loading profile...</p>;
//   }

//   return (
//     <div>
//       <h2>My Profile</h2>

//       {
//     user.role === "interviewer" &&
//       (!user.category || !user.skills || user.skills.length === 0) && (
//         <div>
//           <p>⚠ Your interviewer profile is incomplete.</p>

//           <button onClick={() => navigate("/edit-profile")}>
//             Complete Profile
//           </button>
//         </div>
//       )
//   }

//       {user.profilePicture ? (
//         <img src={user.profilePicture} alt="Profile" width="150" />
//       ) : (
//         <p>No Profile Picture</p>
//       )}

//       <p>Name: {user.name}</p>

//       <p>Email: {user.email}</p>

//       <p>Role: {user.role}</p>

//       <p>Bio: {user.bio || "No bio added"}</p>

//       <p>
//         Skills:{" "}
//         {user.skills?.length > 0 ? user.skills.join(", ") : "No skills added"}
//       </p>

//       <p>
//         LinkedIn:{" "}
//         {user.linkedin ? (
//           <a href={user.linkedin} target="_blank" rel="noreferrer">
//             View LinkedIn
//           </a>
//         ) : (
//           "Not Added"
//         )}
//       </p>

//       <p>
//         GitHub:{" "}
//         {user.github ? (
//           <a href={user.github} target="_blank" rel="noreferrer">
//             View GitHub
//           </a>
//         ) : (
//           "Not Added"
//         )}
//       </p>

//       {user.role === "interviewer" && (
//         <>
//           <p>
//             Category:
//             {user.category || "Not Selected"}
//           </p>

//           <p>
//             Experience:
//             {user.experience || 0} Years
//           </p>

//           <p>
//             Current Company:
//             {user.currentCompany || "Not Added"}
//           </p>

//           <p>
//             Rating:
//             {user.rating ? user.rating.toFixed(2) : "No Ratings Yet"}
//           </p>

//           <p>
//             Interviews Taken:
//             {user.interviewsTaken}
//           </p>

//           <p>
//             Status:
//              <AvailabilityBadge
//                isAvailable={user.isAvailable}
//                />
//           </p>
//         </>
//       )}
//       <div>
//   <button
//     onClick={() =>
//       navigate("/edit-profile")
//     }
//   >
//     Edit Profile
//   </button>

//   <button
//     onClick={() =>
//       navigate("/change-password")
//     }
//   >
//     Change Password
//   </button>
// </div>
//     </div>
//   );
// };

// export default MyProfile;

// import React, { useEffect, useState } from "react";
// import { fetchWithAuth } from "../api/api";
// import { useNavigate } from "react-router-dom";
// import DashboardLayout from "../layouts/DashboardLayout";
// import DashboardContainer from "../components/dashboard/DashboardContainer";
// import { useToast } from "../context/ToastContext";
// import {
//   FaEnvelope,
//   FaGithub,
//   FaLinkedin,
//   FaBriefcase,
//   FaCode,
//   FaStar,
//   FaEdit,
//   FaKey,
//   FaExclamationTriangle,
//   FaCheckCircle,
//   FaTimesCircle,
// } from "react-icons/fa";

// const MyProfile = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   useEffect(() => {
//     async function getProfile() {
//       try {
//         const data = await fetchWithAuth("/profile");
//         setUser(data);
//       } catch (err) {
//         showToast(err.message || "Failed to load profile", "error");
//       }
//     }

//     getProfile();
//   }, [showToast]);

//   if (!user) {
//     return (
//       <DashboardLayout>
//         <DashboardContainer>
//           <div className="flex items-center justify-center h-[40vh]">
//             <p className="text-slate-400 text-xl animate-pulse">
//               Loading profile...
//             </p>
//           </div>
//         </DashboardContainer>
//       </DashboardLayout>
//     );
//   }

//   const isIncompleteInterviewer =
//     user.role === "interviewer" &&
//     (!user.category || !user.skills || user.skills.length === 0);

//   return (
//     <DashboardLayout>
//       <DashboardContainer>
//         <div className="flex flex-col w-full max-w-[1000px] mx-auto gap-6 mt-2 pb-12">
//           {/* Header */}
//           <div className="flex flex-col gap-2 w-full mb-2">
//             <h1 className="text-[36px] font-bold text-white tracking-tight">
//               My Profile
//             </h1>
//             <p className="text-slate-400 text-[15px]">
//               Manage your personal information and platform settings.
//             </p>
//           </div>

//           {/* Warning Banner for Incomplete Interviewers */}
//           {isIncompleteInterviewer && (
//             <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
//                   <FaExclamationTriangle className="text-lg" />
//                 </div>
//                 <div>
//                   <h3 className="text-orange-400 font-semibold text-[15px]">
//                     Profile Incomplete
//                   </h3>
//                   <p className="text-slate-300 text-sm mt-0.5">
//                     Your interviewer profile is missing key details like your
//                     category or skills.
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => navigate("/edit-profile")}
//                 className="shrink-0 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/20 w-full sm:w-auto"
//               >
//                 Complete Profile
//               </button>
//             </div>
//           )}

//           {/* Top Profile Card (Avatar & Bio) */}
//           <div className="glass-card rounded-[24px] p-8 flex flex-col md:flex-row gap-8 border border-white/5 shadow-2xl bg-[#131d30]/60 items-start">
//             {/* Avatar */}
//             <img
//               src={
//                 user.profilePicture ||
//                 `https://ui-avatars.com/api/?name=${user.name || "U"}&background=2F7DFF&color=fff&rounded=true&size=256`
//               }
//               alt={user.name}
//               className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-2 border-white/10 shadow-lg bg-[#08111f] shrink-0"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = `https://ui-avatars.com/api/?name=${user.name || "U"}&background=2F7DFF&color=fff&rounded=true&size=256`;
//               }}
//             />

//             {/* Core Info */}
//             <div className="flex-1 flex flex-col w-full">
//               <div className="flex flex-wrap items-center gap-4 mb-2">
//                 <h2 className="text-3xl font-bold text-white tracking-tight">
//                   {user.name}
//                 </h2>
//                 <span className="bg-white/10 border border-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
//                   {user.role}
//                 </span>
//               </div>

//               <div className="flex items-center gap-2 text-[#4C8EFF] font-medium text-[15px] mb-4">
//                 <FaEnvelope /> {user.email}
//               </div>

//               <div className="bg-[#0b1425]/50 p-4 rounded-xl border border-white/5 mt-2">
//                 <p className="text-slate-300 text-[15px] leading-relaxed">
//                   {user.bio ? (
//                     `"${user.bio}"`
//                   ) : (
//                     <span className="italic text-slate-500">
//                       No bio added yet. Tell us a bit about yourself!
//                     </span>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
//             {/* Basic Details Card */}
//             <div className="glass-panel p-8 rounded-[24px] border border-white/5 bg-[#131d30]/40 flex flex-col h-full">
//               <h3 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">
//                 Contact & Socials
//               </h3>

//               <div className="space-y-5 flex-1">
//                 <div className="flex flex-col gap-1.5">
//                   <span className="text-[12px] text-slate-500 uppercase tracking-wider font-semibold">
//                     LinkedIn Profile
//                   </span>
//                   {user.linkedin ? (
//                     <a
//                       href={user.linkedin}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="flex items-center gap-2 text-[#4C8EFF] hover:text-[#2F7DFF] transition-colors font-medium"
//                     >
//                       <FaLinkedinIn className="text-lg" /> View LinkedIn Profile
//                     </a>
//                   ) : (
//                     <span className="text-slate-400 text-[15px]">
//                       Not provided
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <span className="text-[12px] text-slate-500 uppercase tracking-wider font-semibold">
//                     GitHub Profile
//                   </span>
//                   {user.github ? (
//                     <a
//                       href={user.github}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="flex items-center gap-2 text-white hover:text-slate-300 transition-colors font-medium"
//                     >
//                       <FaGithub className="text-lg" /> View GitHub Profile
//                     </a>
//                   ) : (
//                     <span className="text-slate-400 text-[15px]">
//                       Not provided
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Interviewer Specific Card (Only renders if interviewer) */}
//             {user.role === "interviewer" && (
//               <div className="glass-panel p-8 rounded-[24px] border border-white/5 bg-[#131d30]/40 flex flex-col h-full">
//                 <h3 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">
//                   Interviewer Stats
//                 </h3>

//                 <div className="space-y-4 flex-1">
//                   <div className="flex items-center justify-between">
//                     <span className="text-slate-400 text-[14px]">Status</span>
//                     {user.isAvailable ? (
//                       <span className="flex items-center gap-1.5 text-green-400 text-[13px] font-semibold bg-green-500/10 px-3 py-1 rounded-full">
//                         <FaCheckCircle /> Available
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-1.5 text-red-400 text-[13px] font-semibold bg-red-500/10 px-3 py-1 rounded-full">
//                         <FaTimesCircle /> Unavailable
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-slate-400 text-[14px]">Category</span>
//                     <span className="text-white font-medium">
//                       {user.category || "Not Selected"}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-slate-400 text-[14px]">
//                       Experience
//                     </span>
//                     <span className="text-white font-medium flex items-center gap-2">
//                       <FaBriefcase className="text-slate-500" />{" "}
//                       {user.experience || 0} Years
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-slate-400 text-[14px]">Company</span>
//                     <span className="text-white font-medium">
//                       {user.currentCompany || "Not Added"}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-slate-400 text-[14px]">Rating</span>
//                     <span className="text-white font-medium flex items-center gap-1.5">
//                       <FaStar className="text-yellow-400" />{" "}
//                       {user.rating ? user.rating.toFixed(2) : "New"}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-slate-400 text-[14px]">
//                       Interviews Taken
//                     </span>
//                     <span className="text-white font-medium">
//                       {user.interviewsTaken || 0}
//                     </span>
//                   </div>

//                   <div className="pt-2 border-t border-white/5">
//                     <span className="block text-[12px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
//                       Skills
//                     </span>
//                     <p className="text-slate-300 text-[14px]">
//                       {user.skills?.length > 0
//                         ? user.skills.join(" • ")
//                         : "No skills added"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
//             <button
//               onClick={() => navigate("/edit-profile")}
//               className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#2F7DFF] to-[#1A62DA] hover:from-[#4C8EFF] hover:to-[#2F7DFF] text-white font-semibold text-[16px] transition-all shadow-[0_0_20px_rgba(47,125,255,0.3)] flex justify-center items-center gap-2"
//             >
//               <FaEdit /> Edit Profile
//             </button>
//             <button
//               onClick={() => navigate("/change-password")}
//               className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-[16px] transition-all flex justify-center items-center gap-2"
//             >
//               <FaKey /> Change Password
//             </button>
//           </div>
//         </div>
//       </DashboardContainer>
//     </DashboardLayout>
//   );
// };

// export default MyProfile;



// import React from "react";
// import { fetchWithAuth } from "../api/api";
// import { useState } from "react";
// import { useEffect } from "react";

// const MyRequests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     async function getMyRequests() {
//       try {
//         const data = await fetchWithAuth("/interview/my");
//         setRequests(data.requests);
//       } catch (err) {
//         console.log(err.message);
//       }
//     }
//     getMyRequests();
//   }, []);

//   async function handleCancel(interviewId) {
//     try {
//       await fetchWithAuth(`/interview/${interviewId}/cancel`, {
//         method: "PUT",
//       });

//       setRequests((prevRequests) =>
//         prevRequests.map((request) =>
//           request._id === interviewId
//             ? { ...request, status: "cancelled" }
//             : request,
//         ),
//       );
//     } catch (err) {
//       alert(err.message);
//     }
//   }

//   return (
//     <div>
//       <h2>My Interview Requests</h2>

//       {requests.length === 0 ? (
//         <p>No request sent yet</p>
//       ) : (
//         requests.map((request) => (
//           <div key={request._id}>
//             <p>Interviewer Name: {request.interviewerId?.name}</p>
//             <p>Category: {request.category}</p>
//             <p>Level: {request.level}</p>
//             <p>Status: {request.status}</p>
//             <p>
//               Scheduled At:{" "}
//               {request.scheduledAt
//                 ? new Date(request.scheduledAt).toLocaleString()
//                 : "Not scheduled yet"}
//             </p>
//             <p>
//               Requested At:{" "}
//               {request.requestedAt
//                 ? new Date(request.requestedAt).toLocaleString()
//                 : "Older request (timestamp unavailable)"}
//             </p>

//             {request.status === "cancelled" ? (
//               <button disabled>Interview cancelled</button>
//             ) : (
//               request.status !== "completed" &&
//               request.status !== "rejected" && (
//                 <button onClick={() => handleCancel(request._id)}>
//                   Cancel Interview
//                 </button>
//               )
//             )}
//             <hr />
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MyRequests;







// import React, { useEffect, useState } from "react";
// import { fetchWithAuth } from "../api/api";

// const ReceivedRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [selectedInterviewId, setSelectedInterviewId] = useState(null);
//   const [scheduledDateTime, setScheduledDateTime] = useState("");

//   useEffect(() => {
//     async function getReceiveRequests() {
//       try {
//         const data = await fetchWithAuth("/interview/received");
//         setRequests(data.requests);
//       } catch (err) {
//         console.log(err.message);
//       }
//     }

//     getReceiveRequests();
//   }, []);

//   async function handleStatusUpdate(interviewId, status) {
//     try {
//       await fetchWithAuth(`/interview/${interviewId}`, {
//         method: "PUT",
//         body: JSON.stringify({ status }),
//       });

//       setRequests((prevRequests) =>
//         prevRequests.map((request) =>
//           request._id === interviewId ? { ...request, status } : request,
//         ),
//       );
//     } catch (err) {
//       alert(err.message);
//     }
//   }

//   function openScheduleForm(interviewId) {
//     setSelectedInterviewId(interviewId);
//     setScheduledDateTime("");
//   }

//   async function handleScheduleSubmit() {
//     if (!scheduledDateTime) {
//       alert("Please select a date and time");
//       return;
//     }

//     try {
//       const data = await fetchWithAuth(
//         `/interview/${selectedInterviewId}/schedule`,
//         {
//           method: "PUT",
//           body: JSON.stringify({
//             scheduledAt: scheduledDateTime,
//           }),
//         },
//       );

//       setRequests((prevRequests) =>
//         prevRequests.map((request) =>
//           request._id === selectedInterviewId
//             ? {
//                 ...request,
//                 scheduledAt: data.interview.scheduledAt,
//                 status: data.interview.status,
//               }
//             : request,
//         ),
//       );

//       setSelectedInterviewId(null);
//       setScheduledDateTime("");
//     } catch (err) {
//       alert(err.message);
//     }
//   }

//   async function handleCancel(interviewId) {
//     try {
//       await fetchWithAuth(`/interview/${interviewId}/cancel`, {
//         method: "PUT",
//       });

//       setRequests((prevRequests) =>
//         prevRequests.map((request) =>
//           request._id === interviewId
//             ? { ...request, status: "cancelled" }
//             : request,
//         ),
//       );
//     } catch (err) {
//       alert(err.message);
//     }
//   }

//   return (
//     <div>
//       <h2>Received Interview Requests</h2>

//       {requests.length === 0 ? (
//         <p>No interview requests received yet</p>
//       ) : (
//         requests.map((request) => (
//           <div key={request._id}>
//             <p>Candidate name: {request.intervieweeId?.name}</p>
//             <p>Candidate email: {request.intervieweeId?.email}</p>
//             <p>Category applied for: {request.category}</p>
//             <p>Status: {request.status}</p>

//             <p>
//               Requested At:
//               {new Date(request.requestedAt).toLocaleString()}
//             </p>

//             <p>
//               Scheduled At:
//               {request.scheduledAt
//                 ? new Date(request.scheduledAt).toLocaleString()
//                 : "Not scheduled yet"}
//             </p>

//             {request.status === "pending" && (
//               <>
//                 <button
//                   onClick={() => handleStatusUpdate(request._id, "accepted")}
//                 >
//                   Accept
//                 </button>

//                 <button
//                   onClick={() => handleStatusUpdate(request._id, "rejected")}
//                 >
//                   Reject
//                 </button>
//               </>
//             )}

//             {request.status === "accepted" &&
//               selectedInterviewId !== request._id && (
//                 <button onClick={() => openScheduleForm(request._id)}>
//                   Schedule Interview
//                 </button>
//               )}

//             {selectedInterviewId === request._id && (
//               <div>
//                 <input
//                   type="datetime-local"
//                   value={scheduledDateTime}
//                   onChange={(e) => setScheduledDateTime(e.target.value)}
//                 />

//                 <button onClick={handleScheduleSubmit}>Confirm Schedule</button>
//               </div>
//             )}


//             {request.status === "scheduled" && (
//               <button
//                 onClick={() =>
//                   window.open(`/interview-room/${request._id}`, "_blank")
//                 }
//               >
//                 Join Interview
//               </button>
//             )}

//             {request.status === "cancelled" ? (
//               <button disabled>Interview cancelled</button>
//             ) : (
//               request.status !== "completed" &&
//               request.status !== "rejected" && (
//                 <button onClick={() => handleCancel(request._id)}>
//                   Cancel Interview
//                 </button>
//               )
//             )}

//             <hr />
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ReceivedRequests;








// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CATEGORIES } from "../constants/appConstants";

// const Signup = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "interviewee",
//     category: "",
//   });

//   function handleChange(e) {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   }

//   async function handleSignup() {
//     try {
//       const response = await fetch("http://localhost:8080/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//           role: formData.role,
//           category: formData.category,
//           // skills: formData.skills.split(",").map((skill) => skill.trim()),
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         alert(data.message);
//         return;
//       }

//       alert("Signup successful");

//       navigate("/login");
//     } catch (err) {
//       console.log(err);

//       alert("Signup failed");
//     }
//   }

//   return (
//     <div>
//       <h2>Signup</h2>

//       <input
//         type="text"
//         name="name"
//         placeholder="Enter name"
//         value={formData.name}
//         onChange={handleChange}
//       />

//       <br />

//       <input
//         type="email"
//         name="email"
//         placeholder="Enter email"
//         value={formData.email}
//         onChange={handleChange}
//       />

//       <br />

//       <input
//         type="password"
//         name="password"
//         placeholder="Enter password"
//         value={formData.password}
//         onChange={handleChange}
//       />

//       <br />

//       <select
//         value={formData.role}
//         onChange={(e) =>
//           setFormData({
//             ...formData,
//             role: e.target.value,
//             category: "",
//           })
//         }
//       >
//         <option value="interviewee">Interviewee</option>

//         <option value="interviewer">Interviewer</option>
//       </select>

//       <br />

//       {formData.role === "interviewer" && (
//         <select
//           value={formData.category}
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               category: e.target.value,
//             })
//           }
//         >
//           <option value="">Select Category</option>

//           {CATEGORIES.map((category) => (
//             <option key={category} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>
//       )}

//       <button onClick={handleSignup}>Signup</button>
//     </div>
//   );
// };

// export default Signup;



// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { CATEGORIES } from "../constants/appConstants";
// import { useToast } from "../context/ToastContext";
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaPlay,
//   FaChevronDown,
// } from "react-icons/fa";

// const Signup = () => {
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "interviewee",
//     category: "",
//   });

//   function handleChange(e) {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   }

//   async function handleSignup(e) {
//     e.preventDefault();

//     if (!formData.name || !formData.email || !formData.password) {
//       showToast("Please fill in all required fields", "error");
//       return;
//     }

//     if (formData.role === "interviewer" && !formData.category) {
//       showToast(
//         "Please select a category for your interviewer profile",
//         "error",
//       );
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await fetch("http://localhost:8080/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         showToast(data.message, "error");
//         setIsLoading(false);
//         return;
//       }

//       showToast("Account created successfully! Please log in.", "success");
//       navigate("/login");
//     } catch (err) {
//       showToast("Failed to connect to server", "error");
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden py-12">
//       <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-[#27c281] blur-[150px] opacity-10 pointer-events-none"></div>

//       <div className="glass-card w-full max-w-md p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl bg-[#131d30]/80 relative z-10 animate-fade-in">
//         <div className="flex flex-col items-center mb-8">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#27c281] to-[#1e9a66] flex items-center justify-center shadow-lg shadow-[#27c281]/30 mb-4">
//             <FaPlay className="text-white ml-1" />
//           </div>
//           <h2 className="text-3xl font-bold text-white tracking-tight">
//             Create Account
//           </h2>
//           <p className="text-slate-400 mt-2 text-[15px]">
//             Join PrepStack and start practicing
//           </p>
//         </div>

//         <form onSubmit={handleSignup} className="flex flex-col gap-4">
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#27c281] transition-colors">
//               <FaUser />
//             </div>
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               className="w-full bg-[#08111f]/50 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-[15px] text-white outline-none focus:border-[#27c281] focus:ring-1 focus:ring-[#27c281]/50 transition-all placeholder-slate-500"
//               value={formData.name}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#27c281] transition-colors">
//               <FaEnvelope />
//             </div>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email address"
//               className="w-full bg-[#08111f]/50 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-[15px] text-white outline-none focus:border-[#27c281] focus:ring-1 focus:ring-[#27c281]/50 transition-all placeholder-slate-500"
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#27c281] transition-colors">
//               <FaLock />
//             </div>
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               className="w-full bg-[#08111f]/50 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-[15px] text-white outline-none focus:border-[#27c281] focus:ring-1 focus:ring-[#27c281]/50 transition-all placeholder-slate-500"
//               value={formData.password}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Role Selection Toggle */}
//           <div className="flex bg-[#08111f]/50 p-1 rounded-xl border border-white/10 mt-2">
//             <button
//               type="button"
//               onClick={() =>
//                 setFormData({ ...formData, role: "interviewee", category: "" })
//               }
//               className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
//                 formData.role === "interviewee"
//                   ? "bg-[#27c281] text-white shadow-md"
//                   : "text-slate-400 hover:text-white"
//               }`}
//             >
//               Interviewee
//             </button>
//             <button
//               type="button"
//               onClick={() => setFormData({ ...formData, role: "interviewer" })}
//               className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
//                 formData.role === "interviewer"
//                   ? "bg-[#27c281] text-white shadow-md"
//                   : "text-slate-400 hover:text-white"
//               }`}
//             >
//               Interviewer
//             </button>
//           </div>

//           {/* Conditional Category Dropdown for Interviewers */}
//           {formData.role === "interviewer" && (
//             <div className="relative group mt-1 animate-fade-in">
//               <select
//                 value={formData.category}
//                 onChange={(e) =>
//                   setFormData({ ...formData, category: e.target.value })
//                 }
//                 className="appearance-none w-full bg-[#08111f]/50 border border-white/10 rounded-xl h-14 px-5 pr-12 text-[15px] text-white outline-none focus:border-[#27c281] focus:ring-1 focus:ring-[#27c281]/50 transition-all cursor-pointer"
//               >
//                 <option value="" className="bg-[#08111f] text-slate-500">
//                   Select your expertise...
//                 </option>
//                 {CATEGORIES.map((category) => (
//                   <option
//                     key={category}
//                     value={category}
//                     className="bg-[#08111f]"
//                   >
//                     {category}
//                   </option>
//                 ))}
//               </select>
//               <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none group-focus-within:text-[#27c281]" />
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full h-14 rounded-xl bg-gradient-to-r from-[#27c281] to-[#1e9a66] hover:from-[#21a870] hover:to-[#27c281] text-white font-semibold text-[16px] transition-all shadow-[0_0_20px_rgba(39,194,129,0.3)] mt-4 disabled:opacity-50"
//           >
//             {isLoading ? "Creating Account..." : "Sign Up"}
//           </button>
//         </form>

//         <p className="text-center text-slate-400 mt-8 text-[15px]">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="text-[#27c281] font-semibold hover:text-[#1e9a66] transition-colors"
//           >
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;




