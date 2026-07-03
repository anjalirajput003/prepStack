import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import {
  FaStar,
  FaBriefcase,
  FaCode,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaAward,
} from "react-icons/fa";
import { useToast } from "../context/ToastContext";
import DirectMessage from "../components/DirectMessage";
import { useSocket } from "../context/SocketContext";

const InterviewerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const socket = useSocket();

  const [interviewer, setInterviewer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function getProfile() {
      try {
        const data = await fetchWithAuth(`/interviewers/${id}`);
        const reviewData = await fetchWithAuth(`/interviewers/${id}/reviews`);
        const myProfile = await fetchWithAuth(`/profile`);
        setReviews(reviewData.reviews);
        setInterviewer(data);
        setCurrentUser(myProfile);
      } catch (err) {
        showToast(err.message, "error");
      }
    }
    getProfile();
  }, [id, showToast]);

  // Register the user to the socket once data is loaded
  useEffect(() => {
    if (socket && currentUser) {
      socket.emit("register-user", currentUser._id);
    }
  }, [socket, currentUser]);

  if (!interviewer) {
    return (
      <DashboardLayout>
        <DashboardContainer>
          <div className="flex items-center justify-center h-[40vh]">
            <p className="text-slate-400 text-xl animate-pulse">
              Loading profile...
            </p>
          </div>
        </DashboardContainer>
      </DashboardLayout>
    );
  }

  async function handleInterviewRequest() {
    try {
      setIsRequesting(true);
      await fetchWithAuth("/interview", {
        method: "POST",
        body: JSON.stringify({
          interviewerId: interviewer._id,
          category: interviewer.category,
        }),
      });
      showToast("Interview request sent successfully!", "success");
      navigate("/my-requests");
    } catch (err) {
      showToast(err.message || "Failed to send request", "error");
    } finally {
      setIsRequesting(false);
    }
  }

  const renderStars = (rating) => {
    const safeRating = rating || 0;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((num) => (
          <FaStar
            key={num}
            className={`text-[13px] ${
              safeRating >= num ? "text-amber-400" : "text-slate-700"
            }`}
          />
        ))}
      </div>
    );
  };

  const skills =
    interviewer?.skills?.length > 0
      ? interviewer.skills
      : interviewer.category
        ? [interviewer.category]
        : ["General Interviewer"];

  const stats = [
    {
      label: "Rating",
      value: interviewer.rating ? interviewer.rating.toFixed(1) : "—",
    },
    {
      label: "Experience",
      value: `${interviewer.experience || 0}yr${
        interviewer.experience !== 1 ? "s" : ""
      }`,
    },
    { label: "Reviews", value: reviews.length },
  ];

  return (
    <DashboardLayout>
      <DashboardContainer>
        {/* ── Full-width wrapper, no more max-w-3xl ── */}
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 mt-2 pb-16">
          {/* Header row */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/interviewers-list")}
              className="flex items-center gap-2 text-slate-400 hover:text-[#4C8EFF] w-fit transition-colors text-[14px] font-medium group"
            >
              <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
              Back to Interviewers
            </button>
            <h1 className="text-[28px] font-bold text-white tracking-tight">
              Interviewer's Profile
            </h1>
          </div>

          {/* ── Two-column grid ── */}
          {/* Left col is a fixed-width card; right col fills remaining space */}
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
            <div className="flex flex-col gap-4 lg:sticky lg:top-6">
              {/* Profile card — vertical / centered layout */}
              <div
                className="relative rounded-[22px] overflow-hidden border border-white/[0.07] shadow-2xl"
                style={{ background: "#0c1628" }}
              >
                {/* Gradient accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1A62DA] via-[#5fa0ff] to-[#1A62DA]" />

                {/* Radial glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse at 50% 20%, rgba(47,125,255,0.13) 0%, transparent 60%)",
                  }}
                />

                {/* Avatar — centered at top */}
                <div className="relative pt-8 pb-5 flex flex-col items-center gap-4 px-7">
                  <div className="relative">
                    <img
                      src={
                        interviewer.profilePicture ||
                        `https://ui-avatars.com/api/?name=${
                          interviewer.name || "I"
                        }&background=2F7DFF&color=fff&rounded=true&size=256`
                      }
                      alt={interviewer.name}
                      className={`w-28 h-28 rounded-2xl object-cover bg-[#08111f] ${
                        interviewer.isAvailable
                          ? "ring-2 ring-emerald-500/50 shadow-[0_0_24px_rgba(16,185,129,0.22)]"
                          : "ring-2 ring-slate-700/60"
                      }`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${
                          interviewer.name || "I"
                        }&background=2F7DFF&color=fff&rounded=true&size=256`;
                      }}
                    />
                    {/* Availability dot on avatar */}
                    <span
                      className={`absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-[#0c1628] ${
                        interviewer.isAvailable
                          ? "bg-emerald-400"
                          : "bg-slate-600"
                      }`}
                    />
                  </div>

                  {/* Name + stars */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-[22px] font-bold text-white tracking-tight leading-tight">
                      {interviewer.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      {renderStars(interviewer.rating)}
                      <span className="text-white font-semibold text-sm">
                        {interviewer.rating
                          ? interviewer.rating.toFixed(1)
                          : "0.0"}
                      </span>
                    </div>

                    {/* Availability pill */}
                    {interviewer.isAvailable ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                        <FaCheckCircle className="text-[10px]" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-rose-400 text-[11px] font-semibold bg-rose-500/10 border border-rose-500/25 px-3 py-1 rounded-full">
                        <FaTimesCircle className="text-[10px]" /> Unavailable
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-7 border-t border-white/[0.06]" />

                {/* Meta: experience + skills */}
                <div className="px-7 py-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-slate-300 text-[13px]">
                    <FaBriefcase className="text-[#4C8EFF] shrink-0" />
                    <span>
                      <span className="text-white font-medium">
                        {interviewer.experience || 0} yr
                        {interviewer.experience !== 1 ? "s" : ""}
                      </span>{" "}
                      experience
                      {interviewer.currentCompany && (
                        <span className="text-slate-500">
                          {" "}
                          · at {interviewer.currentCompany}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <FaCode className="text-[#4C8EFF] shrink-0 text-[13px] mt-[3px]" />
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-[#2F7DFF]/10 border border-[#2F7DFF]/25 text-[#7fb3ff] text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  {interviewer.bio && (
                    <div className="mt-1 pl-3.5 border-l-2 border-[#2F7DFF]/35">
                      <p className="text-slate-400 text-[12px] italic leading-relaxed">
                        {interviewer.bio}
                      </p>
                    </div>
                  )}
                </div>

                {/* Stats bar */}
                <div className="border-t border-white/[0.06] grid grid-cols-3 divide-x divide-white/[0.06]">
                  {stats.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center py-4 gap-0.5"
                    >
                      <span className="text-[20px] font-bold text-white leading-none">
                        {value}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-medium">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA button — sits below the card in the same column */}
              {interviewer.isAvailable ? (
                <button
                  onClick={handleInterviewRequest}
                  disabled={isRequesting}
                  className="w-full py-4 rounded-2xl font-semibold text-[15px] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                  style={{
                    background:
                      "linear-gradient(135deg, #2F7DFF 0%, #1A62DA 100%)",
                    boxShadow: "0 4px 28px rgba(47,125,255,0.35)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 36px rgba(47,125,255,0.5)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 28px rgba(47,125,255,0.35)")
                  }
                >
                  {isRequesting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending Request...
                    </span>
                  ) : (
                    "Request Interview"
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-600 font-semibold text-[15px] cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}

              <button
                onClick={() =>
                  navigate("/messages", {
                    state: {
                      newContact: {
                        _id: interviewer._id,
                        name: interviewer.name,
                        profilePicture: interviewer.profilePicture,
                        role: interviewer.role,
                      },
                    },
                  })
                }
                className="w-full py-4 mt-3 rounded-2xl bg-white/[0.04] text-white font-semibold text-[15px] hover:bg-white/[0.08] transition-colors"
              >
                Send Message
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {/* Section header */}
              <div className="flex items-center gap-2.5">
                <h3 className="text-[20px] font-bold text-white">Reviews</h3>
                {reviews.length > 0 && (
                  <span className="bg-[#2F7DFF]/10 border border-[#2F7DFF]/25 text-[#7fb3ff] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {reviews.length}
                  </span>
                )}
              </div>

              {/* Empty state */}
              {reviews.length === 0 ? (
                <div
                  className="rounded-2xl border border-white/[0.06] p-14 flex flex-col items-center justify-center gap-3 text-center"
                  style={{ background: "#0c1628" }}
                >
                  <FaAward className="text-4xl text-slate-700" />
                  <p className="text-slate-400 text-[15px] font-medium">
                    No reviews yet
                  </p>
                  <p className="text-slate-600 text-[13px]">
                    Be the first to leave one after your interview!
                  </p>
                </div>
              ) : (
                /* Review cards — single column so each card is wide and readable */
                <div className="flex flex-col gap-4">
                  {reviews.map((review) => {
                    const initial = review.intervieweeId?.name
                      ? review.intervieweeId.name.charAt(0).toUpperCase()
                      : "U";

                    return (
                      <div
                        key={review._id}
                        className="rounded-2xl border border-white/[0.06] p-5 flex gap-4 items-start"
                        style={{ background: "#0c1628" }}
                      >
                        {/* Reviewer avatar */}
                        <div className="shrink-0 w-11 h-11 rounded-full bg-[#2F7DFF]/10 flex items-center justify-center text-[#4C8EFF] font-bold text-[16px] border border-[#2F7DFF]/20">
                          {initial}
                        </div>

                        {/* Review content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <p className="text-white font-semibold text-[15px] leading-tight">
                              {review.intervieweeId?.name || "Anonymous"}
                            </p>
                            {/* Numeric rating on the right */}
                            <span className="text-amber-400 font-bold text-[14px] shrink-0">
                              {review.rating?.toFixed(1) || "—"}
                            </span>
                          </div>
                          <div className="mt-1.5 mb-3">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-slate-400 text-[14px] leading-relaxed">
                            {review.feedback}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
};;

export default InterviewerProfile;
