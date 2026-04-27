import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";

const InterviewersList = () => {
  const [interviewers, setInterviewers] = useState([]);

  async function handleInterviewRequest(interviewerId) {
    try {
      const data = await fetchWithAuth("/interview/request", {
        method: "POST",
        body: JSON.stringify({
          interviewerId,
          category: "HR",
        }),
      });
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
  }, []);

  return (
    <div>
      <h2>InterviewersList</h2>
      {interviewers.map((interviewer) => (
        <div key={interviewer._id}>
          <p>Name: {interviewer.name} </p>
          <p>Category: {interviewer.category} </p>
          <p>Skills: {interviewer.skills.join(", ")} </p>
          <button onClick={() => handleInterviewRequest(interviewer._id)}>
            Request Interview
          </button>
        </div>
      ))}
    </div>
  );
};

export default InterviewersList;
