import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";
import AvailabilityBadge from "../components/AvailabilityBadge";
import { LEVELS } from "../constants/appConstants";
import { CATEGORIES } from "../constants/appConstants";

const InterviewersList = () => {
  const [interviewers, setInterviewers] = useState([]);
  const [requestSent, setRequestSent] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedLevel, setSelectedLevel] = useState("");
  const navigate = useNavigate();

  async function handleInterviewRequest(interviewerId) {
    if (!selectedCategory || !selectedLevel) {
      alert("Please select category and level");

      return;
    }
    try {
      const data = await fetchWithAuth("/interview", {
        method: "POST",
        body: JSON.stringify({
          interviewerId,
          category: selectedCategory,
          level: selectedLevel,
        }),
      });
      setRequestSent((prev) => [...prev, interviewerId]);
    } catch (err) {
      console.log(err.message);
    }
  }

  function getInterviewerLevel(interviewer) {
    if (interviewer.interviewsTaken >= 20 && interviewer.rating >= 4) {
      return "Pro";
    }

    if (interviewer.interviewsTaken >= 5) {
      return "Intermediate";
    }

    return "Beginner";
  }

  async function getInterviewers() {
    try {
      const data = await fetchWithAuth(
        `/interviewers?category=${selectedCategory}`,
      );

      const filtered = data.filter((interviewer) => {
        return getInterviewerLevel(interviewer) === selectedLevel;
      });

      setInterviewers(filtered);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    async function getMyRequests() {
      try {
        const data = await fetchWithAuth("/interview/my");
        const myRequests = data.requests;
        const ids = myRequests
          .filter((request) => request.interviewerId)
          .map((request) => request.interviewerId._id);
        setRequestSent(ids);
      } catch (err) {
        alert(err.message);
      }
    }
    getMyRequests();
  }, []);

  return (
    <div>
      <div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
        <option value="">Select level</option>
          {LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <h2>InterviewersList</h2>

      <button onClick={getInterviewers}>Search Interviewers</button>

      {interviewers.map((interviewer) => (
        <div key={interviewer._id}>
          {interviewer.profilePicture && (
            <img
              src={interviewer.profilePicture}
              alt="Profile"
              width="80"
              height="80"
            />
          )}

          <p>Name: {interviewer.name} </p>
          <p>
            Status:
            <AvailabilityBadge isAvailable={interviewer.isAvailable} />
          </p>
          <p>Category: {interviewer.category} </p>
          <p>Level: {getInterviewerLevel(interviewer)}</p>
          <p>
            Skills:
            {interviewer?.skills?.length > 0
              ? interviewer.skills.join(", ")
              : "No skills added"}
          </p>
          {interviewer.isAvailable ? (
            <button
              onClick={() => handleInterviewRequest(interviewer._id)}
              disabled={requestSent.includes(interviewer._id)}
            >
              {requestSent.includes(interviewer._id)
                ? "Request Sent"
                : "Request Interview"}
            </button>
          ) : (
            <button disabled>Unavailable</button>
          )}
          <button onClick={() => navigate(`/interviewers/${interviewer._id}`)}>
            View Profile
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
