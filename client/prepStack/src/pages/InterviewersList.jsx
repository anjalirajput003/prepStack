import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";

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
      console.log("Request sent: ", data);
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
    // async function getInterviewers() {
    //   try {
    //     const data = await fetchWithAuth("/interviewers");
    //     setInterviewers(data);
    //   } catch (err) {
    //     console.log(err.message);
    //   }
    // }
    // getInterviewers();

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
  console.log(requestSent);

  return (
    <div>
      <div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>

          <option value="HR">HR</option>

          <option value="Tech">Tech</option>

          <option value="Finance">Finance</option>

          <option value="Marketing">Marketing</option>

          <option value="Healthcare">Healthcare</option>

          <option value="Non-Tech">Non-Tech</option>

          <option value="Others">Others</option>
        </select>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="">Select Level</option>

          <option value="Beginner">Beginner</option>

          <option value="Intermediate">Intermediate</option>

          <option value="Pro">Pro</option>
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
          {console.log(interviewer)}
          <p>Name: {interviewer.name} </p>
          <p>
            Status:
            {interviewer.isAvailable ? " Available 🟢" : " Unavailable 🔴"}
          </p>
          <p>Category: {interviewer.category} </p>
          <p>Level: {getInterviewerLevel(interviewer)}</p>
          <p>Skills: {interviewer.skills.join(", ")} </p>
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
