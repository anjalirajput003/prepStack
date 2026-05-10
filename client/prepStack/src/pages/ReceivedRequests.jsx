import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";

const ReceivedRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function getReceiveRequests() {
      try {
        const data = await fetchWithAuth("/interview/received");
        setRequests(data.requests);
      } catch (err) {
        console.log(err.message);
      }
    }
    getReceiveRequests();
  }, []);
  return (
    <div>
      <h2>Received Interview Requests</h2>
      {requests.length === 0 ? (
        <p>No interview requests received yet</p>
      ) : (
        requests.map((request) => (
          <div key={request._id}>
            <p>Candidate name: {request.intervieweeId?.name}</p>
            <p>Candidate email: {request.intervieweeId?.email} </p>
            <p>Category applied for: {request.category} </p>
            <p>Status: {request.status} </p>
            <p>
              Requested At:{" "}
              {new Date(request.scheduledAt).toLocaleString()}{" "}
            </p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default ReceivedRequests;
