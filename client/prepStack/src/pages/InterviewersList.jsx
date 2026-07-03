import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import { CATEGORIES, LEVELS } from "../constants/appConstants";
import {
  FaSearch,
  FaStar,
  FaChevronDown,
  FaUserTie,
  FaCheckCircle,
  FaInbox,
  FaPaperPlane,
} from "react-icons/fa";

const InterviewersList = () => {
  const [interviewers, setInterviewers] = useState([]);
  const [requestSent, setRequestSent] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  async function handleInterviewRequest(interviewerId) {
    if (!selectedCategory || !selectedLevel) {
      alert(
        "Please select category and level from the filters above before requesting!",
      );
      return;
    }
    try {
      await fetchWithAuth("/interview", {
        method: "POST",
        body: JSON.stringify({
          interviewerId,
          category: selectedCategory,
          level: selectedLevel,
        }),
      });
      setRequestSent((prev) => [...prev, interviewerId]);
    } catch (err) {
      console.log(err.message);
    }
  }

  function getInterviewerLevel(interviewer) {
    if (interviewer.interviewsTaken >= 20 && interviewer.rating >= 4) {
      return "Pro";
    }
    if (interviewer.interviewsTaken >= 5) {
      return "Intermediate";
    }
    return "Beginner";
  }

  async function getInterviewers() {
    if (!selectedCategory || !selectedLevel) {
      alert("Please select both a category and a level to find interviewers.");
      return;
    }

    try {
      const data = await fetchWithAuth(
        `/interviewers?category=${selectedCategory}`,
      );
      const filtered = data.filter((interviewer) => {
        if (!selectedLevel) return true;
        return getInterviewerLevel(interviewer) === selectedLevel;
      });
      setInterviewers(filtered);
      setHasSearched(true); // <-- Tell the UI we performed a search
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    async function getMyRequests() {
      try {
        const data = await fetchWithAuth("/interview/my");
        const myRequests = data.requests;
        const ids = myRequests
          .filter(
            (request) =>
              request.interviewerId &&
              ["pending", "accepted", "scheduled"].includes(request.status),
          )
          .map((request) => request.interviewerId._id);

        setRequestSent(ids);
      } catch (err) {
        console.log(err.message);
      }
    }
    getMyRequests();

  }, []);

  // Client-side search filtering
  const displayInterviewers = interviewers.filter((i) =>
    i.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <DashboardContainer>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full mt-2">
          <h1 className="text-[36px] font-semibold text-white tracking-tight">
            Interviewers List
          </h1>

          {/* Quick Links */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/my-requests")}
              className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all"
            >
              <FaPaperPlane className="text-[#4C8EFF]" /> My Requests
            </button>
            <button
              onClick={() => navigate("/received-requests")}
              className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all"
            >
              <FaInbox className="text-[#27c281]" /> Received Requests
            </button>
          </div>
        </div>

        {/* Filters & Search Control Bar */}
        <div className="flex flex-wrap items-center gap-4 w-full bg-[#131d30]/60 p-4 rounded-2xl border border-white/5 shadow-lg">
          {/* Category Dropdown */}
          <div className="relative group flex-1 min-w-[200px]">
            <select
              className="appearance-none w-full bg-[#0b1425] border border-white/10 text-slate-300 rounded-xl h-12 px-5 pr-12 text-[15px] outline-none cursor-pointer hover:border-white/20 transition-all focus:border-[#4F8CFF] focus:ring-1 focus:ring-[#4F8CFF]/50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none group-hover:text-white transition-colors" />
          </div>

          {/* Level Dropdown */}
          <div className="relative group flex-1 min-w-[200px]">
            <select
              className="appearance-none w-full bg-[#0b1425] border border-white/10 text-slate-300 rounded-xl h-12 px-5 pr-12 text-[15px] outline-none cursor-pointer hover:border-white/20 transition-all focus:border-[#4F8CFF] focus:ring-1 focus:ring-[#4F8CFF]/50"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">Select Level</option>
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none group-hover:text-white transition-colors" />
          </div>

          {/* Find Button (Triggers API fetch) */}
          <button
            onClick={getInterviewers}
            className="h-12 w-50 px-8 rounded-xl bg-gradient-to-r from-[#2F7DFF] to-[#1A62DA] hover:from-[#4C8EFF] hover:to-[#2F7DFF] text-white font-semibold transition-all shadow-[0_0_15px_rgba(47,125,255,0.2)]"
          >
            Find Interviewers
          </button>

          {/* Name Search (Client side filter) */}
          <div className="bg-[#0b1425] border border-white/10 flex items-center h-12 pl-5 pr-4 rounded-xl w-full lg:w-[300px] hover:border-white/20 transition-all focus-within:border-[#4F8CFF] focus-within:ring-1 focus-within:ring-[#4F8CFF]/50 ml-auto">
            <FaSearch className="text-slate-400 mr-3 text-[15px]" />
            <input
              type="text"
              placeholder="Search by name..."
              className="bg-transparent border-none outline-none text-center text-[15px] text-white w-full placeholder-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Interviewers List Cards */}
        <div className="flex flex-col gap-5 w-full mt-2">
          {!hasSearched ? (
            <div className="glass-panel rounded-3xl p-16 flex flex-col items-center justify-center text-center border border-white/5 bg-[#131d30]/40 shadow-2xl mt-4">
              <div className="w-24 h-24 bg-gradient-to-br from-[#2F7DFF]/20 to-[#1A62DA]/10 rounded-full flex items-center justify-center mb-6 border border-[#2F7DFF]/20 shadow-[0_0_30px_rgba(47,125,255,0.15)]">
                <FaSearch className="text-4xl text-[#4C8EFF]" />
              </div>
              <h3 className="text-2xl text-white font-bold mb-3 tracking-tight">
                Find Your Perfect Interviewer
              </h3>
              <p className="text-[15px] text-slate-400 max-w-md mx-auto leading-relaxed">
                Select a category and difficulty level from the filters above to
                discover experienced professionals ready to help you practice
                and level up your skills.
              </p>
            </div>
          ) : displayInterviewers.length === 0 ? (
            <div className="glass-panel rounded-2xl p-16 flex flex-col items-center justify-center text-slate-400 border border-white/5">
              <FaUserTie className="text-5xl text-slate-600 mb-4" />
              <p className="text-lg">
                No interviewers found matching your criteria.
              </p>
            </div>
          ) : (
            displayInterviewers.map((interviewer) => {
              const level = getInterviewerLevel(interviewer);
              const hasRequested = requestSent.includes(interviewer._id);

              return (
                <div
                  key={interviewer._id}
                  className="glass-panel bg-[#131d30]/60 rounded-2xl p-6 border border-white/5 hover:border-white/10 hover:bg-[#131d30]/80 transition-all flex flex-col md:flex-row md:items-center gap-6 group"
                >
                  {/* Left: Avatar */}
                  <img
                    src={
                      interviewer.profilePicture ||
                      `https://ui-avatars.com/api/?name=${interviewer.name || "I"}&background=2F7DFF&color=fff&rounded=true&size=128`
                    }
                    alt={interviewer.name}
                    className="w-24 h-24 rounded-2xl object-cover border border-white/10 bg-[#08111f] shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${interviewer.name || "I"}&background=2F7DFF&color=fff&rounded=true&size=128`;
                    }}
                  />

                  {/* Middle: Info */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {interviewer.name}
                      </h3>
                      <div className="flex items-center gap-1.5 bg-[#202B46] px-2.5 py-1 rounded-md">
                        <FaStar className="text-yellow-400 text-sm drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                        <span className="text-white font-semibold text-sm">
                          {interviewer.rating > 0
                            ? interviewer.rating.toFixed(1)
                            : "New"}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#4C8EFF] font-medium text-[15px] mb-3">
                      {interviewer?.skills?.length > 0
                        ? interviewer.skills.join(" • ")
                        : interviewer.category || "General Interviewer"}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm">
                      <span>
                        Interviews Taken:{" "}
                        <strong className="text-slate-200">
                          {interviewer.interviewsTaken || 0}
                        </strong>
                      </span>
                      <span className="flex items-center gap-2">
                        Status:
                        {interviewer.isAvailable ? (
                          <span className="flex items-center gap-1.5 text-green-400 font-medium bg-green-500/10 px-2 py-0.5 rounded">
                            <FaCheckCircle className="text-xs" /> Available
                          </span>
                        ) : (
                          <span className="text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded">
                            Unavailable
                          </span>
                        )}
                      </span>
                      <span>
                        Level:{" "}
                        <strong className="text-slate-200">{level}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-row md:flex-col gap-3 shrink-0 mt-4 md:mt-0">
                    <button
                      onClick={() =>
                        navigate(`/interviewers/${interviewer._id}`)
                      }
                      className="flex-1 md:flex-none text-sm text-white bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-xl transition-all font-medium text-center"
                    >
                      View Profile
                    </button>

                    {interviewer.isAvailable ? (
                      <button
                        onClick={() => handleInterviewRequest(interviewer._id)}
                        disabled={hasRequested}
                        className={`flex-1 md:flex-none text-sm font-semibold px-6 py-3 rounded-xl w-35 transition-all text-center ${
                          hasRequested
                            ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed"
                            : "bg-[#2F7DFF] text-white hover:bg-[#4C8EFF] shadow-[0_0_15px_rgba(47,125,255,0.2)]"
                        }`}
                      >
                        {hasRequested ? "Request Sent" : "Request Interview"}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 md:flex-none text-sm text-slate-500 bg-white/5 border border-white/5 px-6 py-3 rounded-xl cursor-not-allowed text-center"
                      >
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default InterviewersList;
