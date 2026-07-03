import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import { useToast } from "../context/ToastContext";
import {
  FaCalendarAlt,
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaUserTie,
  FaBan,
  FaVideo, // Added the video icon import!
} from "react-icons/fa";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    async function getMyRequests() {
      try {
        const data = await fetchWithAuth("/interview/my");
        setRequests(data.requests);
      } catch (err) {
        showToast(err.message, "error");
      }
    }
    getMyRequests();
  }, [showToast]);

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
      showToast("Interview cancelled successfully", "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1.5 text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <FaClock /> Pending
          </span>
        );
      case "accepted":
      case "scheduled":
        return (
          <span className="flex items-center gap-1.5 text-[#4C8EFF] bg-[#2F7DFF]/10 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <FaCalendarAlt /> {status}
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-1.5 text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <FaCheckCircle /> Completed
          </span>
        );
      case "cancelled":
      case "rejected":
        return (
          <span className="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <FaBan /> {status}
          </span>
        );
      default:
        return (
          <span className="text-slate-400 text-xs uppercase">{status}</span>
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
              My Requests
            </h1>
            <p className="text-slate-400 text-[15px]">
              Manage your sent interview requests and their current statuses.
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="glass-panel p-16 rounded-3xl text-center text-slate-400 border border-white/5 flex flex-col items-center">
              <div className="w-20 h-20 bg-[#131d30] rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                <FaCalendarAlt className="text-3xl text-slate-500" />
              </div>
              <h3 className="text-xl text-white font-semibold mb-2">
                No Requests Found
              </h3>
              <p className="text-[15px]">
                You haven't sent any interview requests yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="glass-card p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all flex flex-col bg-[#131d30]/60 relative overflow-hidden shadow-xl group"
                >
                  {/* Status Badge */}
                  <div className="absolute top-5 right-5">
                    {getStatusBadge(request.status)}
                  </div>

                  {/* Interviewer Info */}
                  <div className="flex items-center gap-4 mb-6 mt-2">
                    <img
                      src={
                        request.interviewerId?.profilePicture ||
                        `https://ui-avatars.com/api/?name=${request.interviewerId?.name || "I"}&background=202B46&color=fff&rounded=true&size=128`
                      }
                      alt=""
                      className="w-14 h-14 rounded-full object-cover border border-white/10 bg-[#08111f] shrink-0 shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${request.interviewerId?.name || "I"}&background=202B46&color=fff&rounded=true&size=128`;
                      }}
                    />
                    <div>
                      <p className="text-[11px] text-[#4C8EFF] font-bold uppercase tracking-wider mb-1">
                        Interviewer
                      </p>
                      <h3 className="text-lg font-bold text-white leading-none">
                        {request.interviewerId?.name || "Unknown User"}
                      </h3>
                    </div>
                  </div>

                  {/* Details Box */}
                  <div className="flex flex-col gap-3 mb-6 bg-[#0b1425]/50 p-5 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-slate-400">Category</span>
                      <span className="text-white font-medium">
                        {request.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-slate-400">Level</span>
                      <span className="text-white font-medium">
                        {request.level || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-slate-400">Date</span>
                      <span className="text-white font-medium">
                        {request.scheduledAt
                          ? new Date(request.scheduledAt).toLocaleString([], {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "Pending Schedule"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex flex-col gap-3">
                    {/* 1. SCHEDULED STATE: Show Join Room & Cancel buttons */}
                    {request.status === "scheduled" &&
                      (() => {
                        const scheduledTime = new Date(
                          request.scheduledAt,
                        ).getTime();
                        const isPastWindow =
                          Date.now() > scheduledTime + 30 * 60 * 1000;

                        return isPastWindow ? (
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
                        );
                      })()}

                    {/* 2. PENDING / ACCEPTED STATE: Only show Cancel Request */}
                    {["pending", "accepted"].includes(request.status) && (
                      <button
                        onClick={() => handleCancel(request._id)}
                        className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all font-medium flex items-center justify-center gap-2 group-hover:border-white/20"
                      >
                        <FaTimes /> Cancel Request
                      </button>
                    )}

                    {/* 3. TERMINAL STATES (Cancelled/Rejected/Completed): Show disabled state block */}
                    {["cancelled", "rejected", "completed"].includes(
                      request.status,
                    ) && (
                      <button
                        disabled
                        className={`w-full py-3.5 rounded-xl font-medium cursor-not-allowed border capitalize ${
                          request.status === "completed"
                            ? "bg-green-500/5 text-green-400/50 border-green-500/10"
                            : "bg-red-500/5 text-red-400/50 border-red-500/10"
                        }`}
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

export default MyRequests;