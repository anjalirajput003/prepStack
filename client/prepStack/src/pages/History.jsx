import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { fetchWithAuth } from "../api/api";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function getHistory() {
      try {
        const data = await fetchWithAuth("/interview/history");
        setHistory(data.history);
      } catch (err) {
        alert(err.message);
      }
    }
    getHistory();
  }, []);
  return (
    <div>
      <h2>Interview History</h2>

      {history.length === 0 ? (
        <p>No completed interviews yet</p>
      ) : (
        history.map((interview) => (
          <div key={interview._id}>
            <p> Interviewer : {interview.interviewerId?.name}</p>
            <p> Interviewee : {interview.intervieweeId?.name}</p>
            <p> Category : {interview.category}</p>
            <p> Status: {interview.status} </p>
            6a0b0ddd70a0cbfacc66f658
            <p>
              {" "}
              Scheduled At :{" "}
              {interview.scheduledAt
                ? new Date(interview.scheduledAt).toLocaleString()
                : "N/A"}
            </p>
            <p>ID: {interview._id}</p>
            <button
              onClick={() =>
                window.open(`/interview-room/${interview._id}`, "_blank")
              }
            >
              Join Interview
            </button>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default History;
