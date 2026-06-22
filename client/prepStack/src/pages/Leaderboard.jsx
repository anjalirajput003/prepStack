import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";

const Leaderboard = () => {
  const [interviewers, setInterviewers] = useState([]);

  useEffect(() => {
    async function getLeaderboard() {
      try {
        const data = await fetchWithAuth("/leaderboard");

        setInterviewers(data.interviewers);
      } catch (err) {
        alert(err.message);
      }
    }

    getLeaderboard();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>

      {interviewers.length === 0 ? (
        <p>No ranked interviewers yet</p>
      ) : (
        interviewers.map((user, index) => (
          <div key={user._id}>
            {/* <p>Rank #{index + 1}</p> */}
            {index === 0 && <h3>🥇 Rank #1</h3>}
            {index === 1 && <h3>🥈 Rank #2</h3>}
            {index === 2 && <h3>🥉 Rank #3</h3>}
            {index > 2 && <h3>Rank #{index + 1}</h3>}
            <p>Name: {user.name}</p>
            <p>Category: {user.category}</p>
            <p>Rating: {user.rating.toFixed(2)}</p>
            <p>Reviews: {user.interviewsTaken}</p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Leaderboard;
