import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [history, setHistory] = useState([]);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

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

  async function handleReviewSubmit(interviewId) {
    try {
      const data = await fetchWithAuth(`/interview/${interviewId}/review`, {
        method: "PUT",
        body: JSON.stringify({
          rating,
          feedback,
        }),
      });

      alert(data.message);

      setHistory((prevHistory) =>
        prevHistory.map((interview) =>
          interview._id === interviewId
            ? {
                ...interview,
                rating,
                feedback,
              }
            : interview,
        ),
      );

      setSelectedInterviewId(null);
      setRating(5);
      setFeedback("");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleRequestAgain(interviewerId, category) {
    console.log("ID:", interviewerId);
    console.log("CATEGORY:", category);
  try {
    await fetchWithAuth("/interview", {
      method: "POST",
      body: JSON.stringify({
        interviewerId,
        category,
      }),
    });

    alert("Interview requested successfully");
  } catch (err) {
    alert(err.message);
  }
}
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
            {/* <p>Level: {interview.level}</p> */}
            <p> Status: {interview.status} </p>
            {/* 6a0b0ddd70a0cbfacc66f658 */}
            <p>
              {" "}
              Scheduled At :{" "}
              {interview.scheduledAt
                ? new Date(interview.scheduledAt).toLocaleString()
                : "N/A"}
            </p>
            <p>Rating: {String(interview.rating)}</p>
            {/* <p>ID: {interview._id}</p> */}
            {!interview.rating && (
              <button
                onClick={() => {
                  setSelectedInterviewId(interview._id);
                }}
              >
                Leave Review
              </button>
            )}
            {selectedInterviewId === interview._id && (
              <div>
                <br />

                <label>Rating (1-5)</label>

                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                />

                <br />
                <br />

                <textarea
                  placeholder="Write your feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />

                <br />
                <br />

                <button onClick={() => handleReviewSubmit(interview._id)}>
                  Submit Review
                </button>
              </div>
            )}

            {/* <p>Feedback: {String(interview.feedback)}</p> */}
            {/* <button
              onClick={() =>
                window.open(`/interview-room/${interview._id}`, "_blank")
              }
            >
              Join Interview
            </button> */}
            <button
              onClick={() =>
                navigate(`/interviewers/${interview.interviewerId._id}`)
              }
            >
              View Profile
            </button>

            <button
              onClick={() =>
                handleRequestAgain(
                  interview.interviewerId._id,
                  interview.category,
                )
              }
            >
              Request Again
            </button>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default History;
