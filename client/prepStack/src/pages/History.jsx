import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaChevronDown,
  FaCalendarAlt,
  FaTrophy,
  FaChartLine,
} from "react-icons/fa";
import { CATEGORIES, LEVELS } from "../constants/appConstants";

/*  helpers  */
function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const History = () => {
  const [history, setHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // 1. Added currentUser state
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Category");
  const [filterLevel, setFilterLevel] = useState("All Level");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        // 2. Fetch both the user's profile AND their history
        const userRes = await fetchWithAuth("/profile");
        setCurrentUser(userRes);

        const histRes = await fetchWithAuth("/interview/history");
        setHistory(histRes.history);
      } catch (err) {
        alert(err.message);
      }
    }
    fetchData();
  }, []);

  async function handleReviewSubmit(interviewId) {
    try {
      const data = await fetchWithAuth(`/interview/${interviewId}/review`, {
        method: "PUT",
        body: JSON.stringify({ rating, feedback }),
      });
      alert(data.message);
      setHistory((prev) =>
        prev.map((iv) =>
          iv._id === interviewId ? { ...iv, rating, feedback } : iv,
        ),
      );
      setSelectedInterviewId(null);
      setRating(5);
      setFeedback("");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleRequestAgain(interviewerId, category) {
    try {
      await fetchWithAuth("/interview", {
        method: "POST",
        body: JSON.stringify({ interviewerId, category }),
      });
      alert("Interview requested successfully");
    } catch (err) {
      alert(err.message);
    }
  }

  /* ── derived stats ── */
  const totalCount = history.length;
  const passedCount = history.filter((i) => i.status === "completed").length;
  const ratedItems = history.filter((i) => i.rating);
  const avgRating = ratedItems.length
    ? (
        ratedItems.reduce((s, i) => s + i.rating, 0) / ratedItems.length
      ).toFixed(1)
    : null;
  const passRate = totalCount
    ? Math.round((passedCount / totalCount) * 100)
    : null;

  /* ── filtered rows ── */
  const filteredHistory = history.filter((item) => {
    const isInterviewee =
      currentUser && item.intervieweeId?._id === currentUser._id;
    const displayUser = isInterviewee ? item.interviewerId : item.intervieweeId;

    const matchesSearch = displayUser?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All Category" || item.category === filterCategory;
    const matchesLevel =
      filterLevel === "All Level" || item.level === filterLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  /* ── level badge ── */
  const renderLevelBadge = (level) => {
    const label = level || "Beginner";
    const lower = label.toLowerCase();

    let cls = "bg-amber-500/10 text-amber-400 border-amber-500/20"; // Beginner
    if (lower === "expert" || lower === "pro")
      cls = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    else if (lower === "intermediate")
      cls = "bg-blue-500/10 text-blue-400 border-blue-500/20";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium border ${cls}`}
      >
        {label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <DashboardContainer>
        {/* ── Page header ── */}
        <div className="flex flex-col gap-1 mb-6 mt-2">
          <h1 className="text-[30px] font-semibold text-white tracking-tight">
            Interview History
          </h1>
          <p className="text-slate-500 text-[14px]">
            Track your past sessions, ratings, and performance
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            {
              icon: <FaCalendarAlt className="text-blue-400" />,
              iconBg: "bg-blue-500/10",
              label: "Total",
              value: totalCount,
            },
            {
              icon: <FaCheckCircle className="text-emerald-400" />,
              iconBg: "bg-emerald-500/10",
              label: "Passed",
              value: passedCount,
            },
            {
              icon: <FaStar className="text-amber-400" />,
              iconBg: "bg-amber-500/10",
              label: "Avg rating",
              value: avgRating ? `${avgRating} / 5` : "—",
            },
            {
              icon: <FaChartLine className="text-purple-400" />,
              iconBg: "bg-purple-500/10",
              label: "Pass rate",
              value: passRate !== null ? `${passRate}%` : "—",
            },
          ].map(({ icon, iconBg, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-[#101827]/60 border border-white/5 rounded-xl px-4 py-3.5"
            >
              <div
                className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center text-[14px] flex-shrink-0`}
              >
                {icon}
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-[18px] font-semibold text-white leading-tight">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Controls row ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <select
                className="appearance-none bg-[#0d1625] border border-white/8 text-slate-300 rounded-lg h-9 pl-3 pr-8 text-[13px] outline-none cursor-pointer hover:border-white/15 transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 min-w-[145px]"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="All Level">All levels</option>
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none" />
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-[#0d1625] border border-white/8 text-slate-300 rounded-lg h-9 pl-3 pr-8 text-[13px] outline-none cursor-pointer hover:border-white/15 transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 min-w-[170px]"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All Category">All categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none" />
            </div>
          </div>

          <div className="relative flex items-center w-full md:w-[220px]">
            <input
              type="text"
              placeholder="Search participant..."
              className="bg-[#0d1625] border border-white/8 rounded-lg h-9 pl-10 pr-3 text-[13px] text-white placeholder-slate-500 outline-none w-full hover:border-white/15 transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="bg-[#0d1625]/80 border border-white/5 rounded-2xl overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="border-b border-white/5 bg-[#080f1e]/60">
                  <th className="py-3 px-5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-4 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="py-3 px-4 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="py-3 px-4 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-3 px-4 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="py-3 px-5 text-[11px] font-medium text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FaTimesCircle className="text-slate-600 text-2xl mb-1" />
                        <p className="text-slate-400 text-[14px] font-medium">
                          No interviews found
                        </p>
                        <p className="text-slate-600 text-[13px]">
                          Try adjusting your filters or search term
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((interview) => {
                    const isCompleted = interview.status === "completed";

                    // 3. Logic to determine who the other person is
                    const isInterviewee =
                      currentUser &&
                      interview.intervieweeId?._id === currentUser._id;
                    const displayUser = isInterviewee
                      ? interview.interviewerId
                      : interview.intervieweeId;

                    const dateOptions = {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    };

                    return (
                      <tr
                        key={interview._id}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-5 text-[13px] text-slate-300 font-medium tabular-nums">
                          {interview.scheduledAt
                            ? new Date(
                                interview.scheduledAt,
                              ).toLocaleDateString("en-US", dateOptions)
                            : "N/A"}
                        </td>

                        {/* Display the correct Participant */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {displayUser?.profilePicture ? (
                              <img
                                src={displayUser.profilePicture}
                                alt={displayUser?.name}
                                className="w-8 h-8 rounded-full object-cover border border-white/10 flex-shrink-0"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-[11px] font-semibold text-blue-400 flex-shrink-0"
                              style={{
                                display: displayUser?.profilePicture
                                  ? "none"
                                  : "flex",
                              }}
                            >
                              {getInitials(displayUser?.name)}
                            </div>
                            <span className="font-medium text-white text-[14px]">
                              {displayUser?.name}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          {renderLevelBadge(interview.level)}
                        </td>

                        <td className="py-4 px-4 text-[13px] text-slate-400">
                          {interview.category}
                        </td>

                        <td className="py-4 px-4">
                          <div
                            className={`flex items-center gap-2 text-[13px] font-medium ${
                              isCompleted ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                isCompleted ? "bg-emerald-400" : "bg-rose-400"
                              }`}
                            />
                            {isCompleted ? "Passed" : "Failed"}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Review button: Only shows if YOU were the Interviewee */}
                            {!interview.rating &&
                              isCompleted &&
                              isInterviewee && (
                                <button
                                  onClick={() =>
                                    setSelectedInterviewId(interview._id)
                                  }
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors"
                                >
                                  <FaStar className="text-[10px]" />
                                  Review
                                </button>
                              )}

                            {/* View Profile: Navigates to the OTHER user's profile */}
                            <button
                              onClick={() =>
                                navigate(`/interviewers/${displayUser?._id}`)
                              }
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/5 transition-colors"
                            >
                              Profile
                            </button>

                            {/* Re-book: Only shows if YOU were the Interviewee */}
                            {isInterviewee && (
                              <button
                                onClick={() =>
                                  handleRequestAgain(
                                    interview.interviewerId._id,
                                    interview.category,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/5 transition-colors"
                              >
                                Re-book
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardContainer>

      {/* ── Review modal ── */}
      {selectedInterviewId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080f1e]/75 backdrop-blur-sm px-4">
          <div className="bg-[#0d1625] border border-white/8 rounded-2xl p-6 w-full max-w-[420px] shadow-2xl">
            <h3 className="text-[18px] font-semibold text-white mb-5">
              Leave feedback
            </h3>

            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">
              Rating
            </p>
            <div className="flex items-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((num) => (
                <FaStar
                  key={num}
                  className={`cursor-pointer text-[22px] transition-colors ${
                    (hoverRating || rating) >= num
                      ? "text-amber-400"
                      : "text-slate-700 hover:text-slate-500"
                  }`}
                  onClick={() => setRating(num)}
                  onMouseEnter={() => setHoverRating(num)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
              <span className="ml-2 text-[13px] text-slate-500">
                {rating} / 5
              </span>
            </div>

            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-3">
              Feedback
            </p>
            <textarea
              placeholder="Describe your experience…"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-[#080f1e]/60 rounded-xl p-3.5 text-[13px] text-white outline-none border border-white/8 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 min-h-[110px] resize-none mb-5 placeholder-slate-600 transition-colors"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedInterviewId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/8 text-slate-300 hover:bg-white/5 hover:border-white/15 transition-colors text-[14px] font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewSubmit(selectedInterviewId)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-[14px] font-semibold text-white"
              >
                Submit review
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default History;
