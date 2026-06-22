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

  async function handleCancel(interviewId) {
    try {
      await fetchWithAuth(`/interview/${interviewId}/cancel`, {
        method: "PUT",
      });

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === interviewId
            ? { ...request, status: "cancelled" }
            : request,
        ),
      );
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>My Interview Requests</h2>

      {requests.length === 0 ? (
        <p>No request sent yet</p>
      ) : (
        requests.map((request) => (
          <div key={request._id}>
            <p>Interviewer Name: {request.interviewerId?.name}</p>
            <p>Category: {request.category}</p>
            <p>Level: {request.level}</p>
            <p>Status: {request.status}</p>
            <p>
              Scheduled At:{" "}
              {request.scheduledAt
                ? new Date(request.scheduledAt).toLocaleString()
                : "Not scheduled yet"}
            </p>
            <p>
              Requested At:{" "}
              {request.requestedAt
                ? new Date(request.requestedAt).toLocaleString()
                : "Older request (timestamp unavailable)"}
            </p>

            {request.status === "cancelled" ? (
              <button disabled>Interview cancelled</button>
            ) : (
              request.status !== "completed" &&
              request.status !== "rejected" && (
                <button onClick={() => handleCancel(request._id)}>
                  Cancel Interview
                </button>
              )
            )}
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default MyRequests;
