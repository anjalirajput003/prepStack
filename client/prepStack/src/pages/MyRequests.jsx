import React from "react";
import { fetchWithAuth } from "../api/api";
import { useState } from "react";
import { useEffect } from "react";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function getMyRequests() {
      try {
        const data = await fetchWithAuth("/interview/my");
        setRequests(data.requests);
      } catch (err) {
        console.log(err.message);
      }
    }
    getMyRequests();
  }, []);

  return (
    <div>
      <h2>My Intervieew Requests</h2>

      {requests.length === 0 ? (
        <p>No request sent yet</p>
      ) : (
        requests.map((request) => (
          <div key={request._id}>
            <p>Interviewer Name: {request.interviewerId.name}</p>
            <p>Category: {request.category}</p>
            <p>Status: {request.status}</p>
            <p>
              Scheduled At: {new Date(request.scheduledAt).toLocaleString()}
            </p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default MyRequests;
