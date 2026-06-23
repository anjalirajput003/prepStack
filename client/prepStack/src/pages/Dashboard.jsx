import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { calculateProfileCompletion } from "../utils/profileCompletion";
import AvailabilityBadge from "../components/AvailabilityBadge";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        const data = await fetchWithAuth("/profile");
        setUser(data);

        const historyData = await fetchWithAuth("/interview/history");

        setHistoryCount(historyData?.interviews?.length);
      } catch (err) {
        console.log(err.message);
      }
    }

    getUser();
  }, []);

  async function handleRoleSwitch() {
    try {
      const data = await fetchWithAuth("/user/switch-role", {
        method: "PUT",
      });

      setUser((prev) => ({
        ...prev,
        role: data.role,
      }));

      alert(`Role changed to ${data.role}`);
    } catch (err) {
      alert(err.message);
    }
  }

  // function calculateProfileCompletion() {
  //   if (!user) return 0;

  //   let completed = 0;
  //   let total = 0;

  //   const commonFields = [
  //     user.name,
  //     user.bio,
  //     user.linkedin,
  //     user.github,
  //     user.profilePicture,
  //   ];

  //   total += commonFields.length;

  //   commonFields.forEach((field) => {
  //     if (field && field !== "" && field !== null) {
  //       completed++;
  //     }
  //   });

  //  if (user?.skills?.length > 0) {
  //    completed++;
  //  }

  //   total++;

  //   if (user.role === "interviewer") {
  //     total += 3;

  //     if (user.category) completed++;

  //     if (user.experience > 0) completed++;

  //     if (user.currentCompany) completed++;
  //   }

  //   return Math.round((completed / total) * 100);
  // }



  return (
    <div>
      <Navbar />
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
    </div>
  );
};

export default Dashboard;
