import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";

const ReceivedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [scheduledDateTime, setScheduledDateTime] = useState("");

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

  async function handleStatusUpdate(interviewId, status) {
    try {
      await fetchWithAuth(`/interview/${interviewId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === interviewId ? { ...request, status } : request,
        ),
      );
    } catch (err) {
      alert(err.message);
    }
  }

  function openScheduleForm(interviewId) {
    setSelectedInterviewId(interviewId);
    setScheduledDateTime("");
  }

  async function handleScheduleSubmit() {
    if (!scheduledDateTime) {
      alert("Please select a date and time");
      return;
    }

    try {
      const data = await fetchWithAuth(
        `/interview/${selectedInterviewId}/schedule`,
        {
          method: "PUT",
          body: JSON.stringify({
            scheduledAt: scheduledDateTime,
          }),
        },
      );

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === selectedInterviewId
            ? {
                ...request,
                scheduledAt: data.interview.scheduledAt,
                status: data.interview.status,
              }
            : request,
        ),
      );

      setSelectedInterviewId(null);
      setScheduledDateTime("");
    } catch (err) {
      alert(err.message);
    }
  }

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
      <h2>Received Interview Requests</h2>

      {requests.length === 0 ? (
        <p>No interview requests received yet</p>
      ) : (
        requests.map((request) => (
          <div key={request._id}>
            <p>Candidate name: {request.intervieweeId?.name}</p>
            <p>Candidate email: {request.intervieweeId?.email}</p>
            <p>Category applied for: {request.category}</p>
            <p>Status: {request.status}</p>

            <p>
              Requested At:
              {new Date(request.requestedAt).toLocaleString()}
            </p>

            <p>
              Scheduled At:
              {request.scheduledAt
                ? new Date(request.scheduledAt).toLocaleString()
                : "Not scheduled yet"}
            </p>

            {request.status === "pending" && (
              <>
                <button
                  onClick={() => handleStatusUpdate(request._id, "accepted")}
                >
                  Accept
                </button>

                <button
                  onClick={() => handleStatusUpdate(request._id, "rejected")}
                >
                  Reject
                </button>
              </>
            )}

            {request.status === "accepted" &&
              selectedInterviewId !== request._id && (
                <button onClick={() => openScheduleForm(request._id)}>
                  Schedule Interview
                </button>
              )}

            {selectedInterviewId === request._id && (
              <div>
                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                />

                <button onClick={handleScheduleSubmit}>Confirm Schedule</button>
              </div>
            )}


            {request.status === "scheduled" && (
              <button
                onClick={() =>
                  window.open(`/interview-room/${request._id}`, "_blank")
                }
              >
                Join Interview
              </button>
            )}

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

export default ReceivedRequests;
