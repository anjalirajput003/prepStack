import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";

const InterviewersList = () => {
  const [interviewers, setInterviewers] = useState([]);
  const [requestSent, setRequestSent] = useState([]);
  const navigate = useNavigate();

  async function handleInterviewRequest(interviewerId) {
    try {
      const data = await fetchWithAuth("/interview", {
        method: "POST",
        body: JSON.stringify({
          interviewerId,
          category: "HR",
        }),
      });
      setRequestSent((prev) => [...prev, interviewerId]);
      console.log("Request sent: ", data);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    async function getInterviewers() {
      try {
        const data = await fetchWithAuth("/interviewers");
        setInterviewers(data);
      } catch (err) {
        console.log(err.message);
      }
    }
    getInterviewers();

    async function getMyRequests() {
      try {
        const data = await fetchWithAuth("/interview/my");
        const myRequests = data.requests;
        const ids = myRequests.map((request) => {
          return request.interviewerId._id;
        });
        setRequestSent(ids);
      } catch (err) {
        alert(err.message);
      }
    }
    getMyRequests();
  }, []);
  console.log(requestSent);

  return (
    <div>
      <h2>InterviewersList</h2>
      {interviewers.map((interviewer) => (
        <div key={interviewer._id}>
          <p>Name: {interviewer.name} </p>
          <p>Category: {interviewer.category} </p>
          <p>Skills: {interviewer.skills.join(", ")} </p>
          <button
            onClick={() => handleInterviewRequest(interviewer._id)}
            disabled={requestSent.includes(interviewer._id)}
          >
            {requestSent.includes(interviewer._id)
              ? "Request sent"
              : "Request interview"}
          </button>
        </div>
      ))}
      <button onClick={() => navigate("/my-requests")}>View My Requests</button>
      <button onClick={() => navigate("/received-requests")}>
        View Received Requests
      </button>
    </div>
  );
};

export default InterviewersList;
