import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import { useToast } from "../context/ToastContext";
import {
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaVideo,
  FaEnvelope,
  FaUserGraduate,
  FaClock,
  FaCalendarCheck,
} from "react-icons/fa";

const ReceivedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    async function getReceiveRequests() {
      try {
        const data = await fetchWithAuth("/interview/received");
        setRequests(data.requests);
      } catch (err) {
        showToast(err.message, "error");
      }
    }
    getReceiveRequests();
  }, [showToast]);

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
      showToast(
        `Request ${status} successfully!`,
        status === "accepted" ? "success" : "error",
      );
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  function openScheduleForm(interviewId) {
    // Toggle off if already open, else open it
    if (selectedInterviewId === interviewId) {
      setSelectedInterviewId(null);
    } else {
      setSelectedInterviewId(interviewId);
      setScheduledDateTime("");
    }
  }

  async function handleScheduleSubmit() {
    if (!scheduledDateTime) {
      showToast("Please select a date and time to schedule.", "error");
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

      showToast("Interview scheduled successfully!", "success");
      setSelectedInterviewId(null);
      setScheduledDateTime("");
    } catch (err) {
      showToast(err.message, "error");
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
      showToast("Interview cancelled.", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  // Dynamic helper for rendering colored status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Accepted (Needs Scheduling)
          </span>
        );
      case "scheduled":
        return (
          <span className="text-[#27c281] bg-[#27c281]/10 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Scheduled
          </span>
        );
      case "cancelled":
      case "rejected":
        return (
          <span className="text-red-400 bg-red-500/10 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            {status}
          </span>
        );
      default:
        return (
          <span className="text-slate-400 bg-slate-500/10 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="flex flex-col w-full mt-2">
          {/* Header */}
          <div className="flex flex-col gap-3 w-full mb-8">
            <h1 className="text-[36px] font-bold text-white tracking-tight">
              Received Requests
            </h1>
            <p className="text-slate-400 text-[15px]">
              Manage incoming requests from candidates wanting to interview with
              you.
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="glass-panel p-16 rounded-3xl text-center text-slate-400 border border-white/5 flex flex-col items-center">
              <div className="w-20 h-20 bg-[#131d30] rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                <FaEnvelope className="text-3xl text-slate-500" />
              </div>
              <h3 className="text-xl text-white font-semibold mb-2">
                Inbox Empty
              </h3>
              <p className="text-[15px]">
                You don't have any pending interview requests right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="glass-card p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col bg-[#131d30]/60 relative shadow-xl"
                >
                  {/* Status Badge */}
                  <div className="absolute top-6 right-6">
                    {getStatusBadge(request.status)}
                  </div>

                  {/* Candidate Info */}
                  <div className="flex items-center gap-4 mb-5">
                    <img
                      src={
                        request.intervieweeId?.profilePicture ||
                        `https://ui-avatars.com/api/?name=${request.intervieweeId?.name || "C"}&background=202B46&color=fff&rounded=true&size=128`
                      }
                      alt=""
                      className="w-16 h-16 rounded-full object-cover border border-white/10 bg-[#08111f] shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${request.intervieweeId?.name || "C"}&background=202B46&color=fff&rounded=true&size=128`;
                      }}
                    />
                    <div>
                      <h3 className="text-[18px] font-bold text-white leading-tight mb-1">
                        {request.intervieweeId?.name || "Unknown Candidate"}
                      </h3>
                      <p className="text-[13px] text-slate-400 flex items-center gap-1.5">
                        <FaEnvelope className="text-slate-500" />{" "}
                        {request.intervieweeId?.email}
                      </p>
                    </div>
                  </div>

                  {/* Details Box */}
                  <div className="flex flex-col gap-3 mb-6 bg-[#0b1425]/50 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 text-[14px]">
                      <div className="w-8 h-8 rounded-lg bg-[#2F7DFF]/10 flex items-center justify-center text-[#4C8EFF]">
                        <FaUserGraduate />
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                          Applying For
                        </p>
                        <p className="text-white font-medium">
                          {request.category}
                        </p>
                      </div>
                    </div>

                    {request.scheduledAt ? (
                      <div className="flex items-center gap-3 text-[14px]">
                        <div className="w-8 h-8 rounded-lg bg-[#27c281]/10 flex items-center justify-center text-[#27c281]">
                          <FaCalendarCheck />
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                            Scheduled For
                          </p>
                          <p className="text-white font-medium">
                            {new Date(request.scheduledAt).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-[14px]">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                          <FaClock />
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                            Requested On
                          </p>
                          <p className="text-slate-300">
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Controls */}
                  <div className="mt-auto flex flex-col gap-3">
                    {/* Pending State -> Accept or Reject */}
                    {request.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id, "accepted")
                          }
                          className="flex-1 py-3 rounded-xl bg-[#2F7DFF] hover:bg-[#4C8EFF] text-white font-semibold transition-all shadow-[0_0_15px_rgba(47,125,255,0.2)] flex items-center justify-center gap-2"
                        >
                          <FaCheck /> Accept
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(request._id, "rejected")
                          }
                          className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-slate-300 hover:text-red-400 font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}

                    {/* Accepted State -> Schedule Button */}
                    {request.status === "accepted" &&
                      selectedInterviewId !== request._id && (
                        <button
                          onClick={() => openScheduleForm(request._id)}
                          className="w-full py-3 rounded-xl bg-[#27c281]/20 hover:bg-[#27c281]/30 border border-[#27c281]/30 text-[#27c281] font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <FaCalendarAlt /> Schedule Interview
                        </button>
                      )}

                    {/* Inline Scheduling Form */}
                    {selectedInterviewId === request._id && (
                      <div className="flex flex-col gap-3 bg-[#08111f] p-4 rounded-xl border border-white/10 animate-fade-in">
                        <label className="text-[13px] text-slate-400 font-medium">
                          Select Date & Time
                        </label>
                        {/* Adding color-scheme dark to make the native picker look better */}
                        <input
                          type="datetime-local"
                          className="w-full bg-[#131d30] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#4F8CFF] [color-scheme:dark]"
                          value={scheduledDateTime}
                          onChange={(e) => setScheduledDateTime(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => openScheduleForm(request._id)} // Toggle close
                            className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleScheduleSubmit}
                            className="flex-1 py-2 rounded-lg bg-[#27c281] hover:bg-[#21a870] text-white font-semibold transition-colors text-sm shadow-[0_0_15px_rgba(39,194,129,0.2)]"
                          >
                            Confirm Time
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Scheduled State -> Join or Cancel */}
                    {request.status === "scheduled" &&
                      (() => {
                        const scheduledTime = new Date(
                          request.scheduledAt,
                        ).getTime();
                        const isPastWindow =
                          Date.now() > scheduledTime + 30 * 60 * 1000;

                        return (
                          <div className="flex flex-col gap-3">
                            {isPastWindow ? (
                              <button
                                disabled
                                className="w-full py-3.5 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400/50 font-medium cursor-not-allowed text-[15px]"
                              >
                                Interview Window Expired
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    window.open(
                                      `/interview-room/${request._id}`,
                                      "_blank",
                                    )
                                  }
                                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2F7DFF] to-[#1A62DA] hover:from-[#4C8EFF] hover:to-[#2F7DFF] text-white font-semibold transition-all shadow-[0_0_15px_rgba(47,125,255,0.3)] flex items-center justify-center gap-2 text-[15px]"
                                >
                                  <FaVideo className="text-lg" /> Join Interview
                                  Room
                                </button>
                                <button
                                  onClick={() => handleCancel(request._id)}
                                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 font-medium transition-all text-sm"
                                >
                                  Cancel Scheduled Interview
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })()}

                    {/* Cancelled/Rejected/Completed State */}
                    {["cancelled", "rejected", "completed"].includes(
                      request.status,
                    ) && (
                      <button
                        disabled
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-slate-500 font-medium cursor-not-allowed capitalize"
                      >
                        Interview {request.status}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default ReceivedRequests;
