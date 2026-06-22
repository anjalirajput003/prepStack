import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "../api/api";

const InterviewerProfile = () => {
  const { id } = useParams();

  const [interviewer, setInterviewer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [requestSent, setRequestSent] = useState([]);
  
    const [selectedCategory, setSelectedCategory] = useState("");
  
    const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    async function getProfile() {
      try {
        const data = await fetchWithAuth(`/interviewers/${id}`);
        const reviewData = await fetchWithAuth(`/interviewers/${id}/reviews`);

        setReviews(reviewData.reviews);

        setInterviewer(data);
      } catch (err) {
        alert(err.message);
      }
    }

    getProfile();
  }, [id]);

  if (!interviewer) {
    return <p>Loading profile...</p>;
  }

  async function handleInterviewRequest() {
    console.log("INTERVIEWER:", interviewer);

    console.log(interviewer._id);
    console.log(interviewer.category);
    try {
      await fetchWithAuth("/interview", {
        method: "POST",
        body: JSON.stringify({
          interviewerId: interviewer._id,
          category: interviewer.category,
        }),
      });

      alert("Interview request sent");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Interviewer Profile</h2>

      {interviewer.profilePicture ? (
        <img src={interviewer.profilePicture} alt="Profile" width="150" />
      ) : (
        <p>No profile picture</p>
      )}

      <p>Name: {interviewer.name}</p>

      <p>Email: {interviewer.email}</p>

      <p>Role: {interviewer.role}</p>

      <p>Category: {interviewer.category}</p>

      <p>
        Status:
        {interviewer.isAvailable ? " Available 🟢" : " Unavailable 🔴"}
      </p>

      <p>
        Experience:
        {interviewer.experience || 0} Years
      </p>

      <p>
        Current Company:
        {interviewer.currentCompany || "Not specified"}
      </p>

      <p>
        Bio:
        {interviewer.bio || "No bio added yet"}
      </p>

      <p>
        LinkedIn:
        {interviewer.linkedin ? (
          <a href={interviewer.linkedin} target="_blank" rel="noreferrer">
            View Profile
          </a>
        ) : (
          " Not provided"
        )}
      </p>

      <p>
        GitHub:
        {interviewer.github ? (
          <a href={interviewer.github} target="_blank" rel="noreferrer">
            View GitHub
          </a>
        ) : (
          " Not provided"
        )}
      </p>

      <p>
        Skills:
        {interviewer.skills.join(", ")}
      </p>

      <p>
        Rating:
        {interviewer.rating ? interviewer.rating.toFixed(2) : "No ratings yet"}
      </p>

      <p>
        Interviews Taken:
        {interviewer.interviewsTaken}
      </p>

      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index}>
            <p>Rating: {review.rating}/5</p>

            <p>{review.feedback}</p>

            <p>By: {review.intervieweeId?.name}</p>

            <hr />
          </div>
        ))
      )}
      {interviewer.isAvailable ? (
        <button onClick={handleInterviewRequest}>Request Interview</button>
      ) : (
        <button disabled>Interviewer Unavailable</button>
      )}
    </div>
  );
};

export default InterviewerProfile;
