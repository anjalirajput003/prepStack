import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      try {
        const data = await fetchWithAuth("/profile");
        setUser(data);
      } catch (err) {
        alert(err.message);
      }
    }

    getProfile();
  }, []);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  {
    user.role === "interviewer" &&
      (!user.category || !user.skills || user.skills.length === 0) && (
        <div>
          <p>⚠ Your interviewer profile is incomplete.</p>

          <button onClick={() => navigate("/edit-profile")}>
            Complete Profile
          </button>
        </div>
      );
  }

  return (
    <div>
      <h2>My Profile</h2>

      {user.profilePicture ? (
        <img src={user.profilePicture} alt="Profile" width="150" />
      ) : (
        <p>No Profile Picture</p>
      )}

      <p>Name: {user.name}</p>

      <p>Email: {user.email}</p>

      <p>Role: {user.role}</p>

      <p>Bio: {user.bio || "No bio added"}</p>

      <p>
        Skills:{" "}
        {user.skills?.length > 0 ? user.skills.join(", ") : "No skills added"}
      </p>

      {/* <p>
        Status:
        {user.isAvailable ? " Available 🟢" : " Unavailable 🔴"}
      </p> */}

      <p>
        LinkedIn:{" "}
        {user.linkedin ? (
          <a href={user.linkedin} target="_blank" rel="noreferrer">
            View LinkedIn
          </a>
        ) : (
          "Not Added"
        )}
      </p>

      <p>
        GitHub:{" "}
        {user.github ? (
          <a href={user.github} target="_blank" rel="noreferrer">
            View GitHub
          </a>
        ) : (
          "Not Added"
        )}
      </p>

      {user.role === "interviewer" && (
        <>
          <p>
            Category:
            {user.category || "Not Selected"}
          </p>

          <p>
            Experience:
            {user.experience || 0} Years
          </p>

          <p>
            Current Company:
            {user.currentCompany || "Not Added"}
          </p>

          <p>
            Rating:
            {user.rating ? user.rating.toFixed(2) : "No Ratings Yet"}
          </p>

          <p>
            Interviews Taken:
            {user.interviewsTaken}
          </p>

              <p>
                Status:
                {user.isAvailable ? " Available 🟢" : " Unavailable 🔴"}
              </p>
            
        </>
      )}
      <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
    </div>
  );
};

export default MyProfile;
