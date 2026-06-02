import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

const InterviewRoom = () => {
  const { interviewId } = useParams();

  const [status, setStatus] = useState("Waiting for other participant...");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    socket.on("user-joined", async () => {
      setStatus("Other participant joined!");
      console.log("USER JOINED EVENT");

      console.log("CREATING OFFER");

      const offer = await peerConnectionRef.current.createOffer();

      console.log("OFFER CREATED");

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

    socket.on("receive-ice-candidate", async (candidate) => {
      console.log("ICE CANDIDATE RECEIVED");

      try {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.log("ICE ADD ERROR", err);
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-ice-candidate");
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

  return (
    <div>
      <h2>Interview Room</h2>

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
    </div>
  );
};

export default InterviewRoom;
