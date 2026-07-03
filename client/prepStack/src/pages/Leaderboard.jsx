import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import { useToast } from "../context/ToastContext";
import {
  FaTrophy,
  FaStar,
  FaMedal,
  FaChevronRight,
  FaUserTie,
} from "react-icons/fa";

/* ── rank config ── */
const RANKS = [
  {
    label: "#1",
    icon: <FaTrophy size={18} />,
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.28)",
    ringColor: "#F59E0B",
    bgFrom: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.30)",
    badgeBg: "rgba(245,158,11,0.15)",
    elevation: -20 /* px lift for podium */,
  },
  {
    label: "#2",
    icon: <FaMedal size={18} />,
    color: "#CBD5E1",
    glow: "rgba(203,213,225,0.18)",
    ringColor: "#CBD5E1",
    bgFrom: "rgba(203,213,225,0.05)",
    border: "rgba(203,213,225,0.20)",
    badgeBg: "rgba(203,213,225,0.10)",
    elevation: 0,
  },
  {
    label: "#3",
    icon: <FaMedal size={18} />,
    color: "#FB923C",
    glow: "rgba(251,146,60,0.22)",
    ringColor: "#FB923C",
    bgFrom: "rgba(251,146,60,0.07)",
    border: "rgba(251,146,60,0.25)",
    badgeBg: "rgba(251,146,60,0.12)",
    elevation: 0,
  },
];

const StarRow = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          size={10}
          style={{ color: i <= full ? "#F59E0B" : "rgba(255,255,255,0.15)" }}
        />
      ))}
    </span>
  );
};

const Leaderboard = () => {
  const [interviewers, setInterviewers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    async function getLeaderboard() {
      try {
        const data = await fetchWithAuth("/leaderboard");
        setInterviewers(data.interviewers || []);
      } catch (err) {
        showToast(err.message || "Failed to load leaderboard", "error");
      } finally {
        setIsLoading(false);
      }
    }
    getLeaderboard();
  }, [showToast]);

  /* ── helpers ── */
  const avatar = (name, pic) =>
    pic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=1a2744&color=fff&rounded=true&size=256`;

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardContainer>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40vh",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "3px solid rgba(47,125,255,0.15)",
                borderTop: "3px solid #4C8EFF",
                animation: "lb-spin 1s linear infinite",
              }}
            />
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
              Loading rankings…
            </p>
            <style>{`@keyframes lb-spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </DashboardContainer>
      </DashboardLayout>
    );
  }

  const topThree = interviewers.slice(0, 3);
  const theRest = interviewers.slice(3);

  return (
    <DashboardLayout>
      <DashboardContainer>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          .lb-root * { box-sizing:border-box; font-family:'Inter',-apple-system,sans-serif; }

          /* podium card */
          .podium-card {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            border-radius: 24px;
            padding: 28px 20px 22px;
            cursor: pointer;
            transition: transform 0.22s ease, box-shadow 0.22s ease;
            text-decoration: none;
          }
          .podium-card:hover { transform: translateY(-6px); }

          /* list row */
          .list-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 20px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.06);
            background: rgba(255,255,255,0.025);
            cursor: pointer;
            transition: background 0.18s, transform 0.18s;
          }
          .list-row:hover {
            background: rgba(255,255,255,0.05);
            transform: translateX(3px);
          }

          .view-btn {
            width: 34px; height: 34px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.04);
            color: rgba(255,255,255,0.4);
            display: flex; align-items:center; justify-content:center;
            transition: background 0.18s, color 0.18s, border-color 0.18s;
            cursor: pointer;
          }
          .list-row:hover .view-btn {
            background: rgba(47,125,255,0.2);
            border-color: rgba(47,125,255,0.4);
            color: #4C8EFF;
          }

          @keyframes lb-fadeup {
            from { opacity:0; transform:translateY(14px); }
            to   { opacity:1; transform:translateY(0); }
          }
          .lb-fade   { animation: lb-fadeup 0.35s ease both; }
          .lb-fade-1 { animation: lb-fadeup 0.35s 0.06s ease both; }
          .lb-fade-2 { animation: lb-fadeup 0.35s 0.12s ease both; }
          .lb-fade-3 { animation: lb-fadeup 0.35s 0.18s ease both; }
        `}</style>

        <div
          className="lb-root"
          style={{
            width: "100%",
            maxWidth: 960,
            margin: "0 auto",
            paddingBottom: 48,
            paddingTop: 4,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* ══ HEADER ══ */}
          <div
            className="lb-fade"
            style={{ textAlign: "center", marginBottom: 44 }}
          >
            {/* Animated trophy icon */}
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.25)",
                boxShadow: "0 0 36px rgba(245,158,11,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F59E0B",
                fontSize: 28,
                margin: "0 auto 20px",
              }}
            >
              <FaTrophy />
            </div>

            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.6px",
                marginBottom: 10,
              }}
            >
              Top Interviewers
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.38)",
                maxWidth: 440,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              The highest-rated professionals on PrepStack, ranked by peer
              reviews and sessions completed.
            </p>
          </div>

          {interviewers.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "56px 24px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
                color: "rgba(255,255,255,0.3)",
                fontSize: 14,
              }}
            >
              No ranked interviewers yet. Check back soon!
            </div>
          ) : (
            <>
              {/* ══ PODIUM — TOP 3 ══ */}
              {/* Re-order visually: 2nd | 1st | 3rd  */}
              <div
                className="lb-fade-1"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 16,
                  alignItems: "flex-end" /* podium step effect */,
                  marginBottom: 28,
                }}
              >
                {/* We render in podium order: index 1, 0, 2 */}
                {[1, 0, 2].map((dataIdx) => {
                  const user = topThree[dataIdx];
                  if (!user) return <div key={dataIdx} />;

                  const r = RANKS[dataIdx];
                  /* podium heights: 1st tallest, 2nd/3rd shorter */
                  const podiumPad =
                    dataIdx === 0 ? "36px 20px 24px" : "24px 20px 20px";

                  return (
                    <div
                      key={user._id}
                      className="podium-card"
                      onClick={() => navigate(`/interviewers/${user._id}`)}
                      style={{
                        background: `linear-gradient(160deg, ${r.bgFrom} 0%, rgba(13,17,30,0.7) 100%)`,
                        border: `1px solid ${r.border}`,
                        boxShadow: `0 0 32px ${r.glow}, 0 8px 24px rgba(0,0,0,0.4)`,
                        padding: podiumPad,
                        /* extra lift for 1st place */
                        marginTop: dataIdx === 0 ? -20 : 0,
                      }}
                    >
                      {/* Rank badge — top-centre, INSIDE the card flow */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 5,
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: r.badgeBg,
                          border: `1.5px solid ${r.border}`,
                          color: r.color,
                          boxShadow:
                            dataIdx === 0 ? `0 0 20px ${r.glow}` : "none",
                          marginBottom: 14,
                          fontSize: dataIdx === 0 ? 20 : 17,
                        }}
                      >
                        {r.icon}
                      </div>

                      {/* Avatar */}
                      <div
                        style={{
                          width: dataIdx === 0 ? 88 : 72,
                          height: dataIdx === 0 ? 88 : 72,
                          borderRadius: "50%",
                          padding: 3,
                          background: `linear-gradient(135deg, ${r.ringColor}, transparent)`,
                          marginBottom: 14,
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={avatar(user.name, user.profilePicture)}
                          alt={user.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = avatar(user.name);
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                            background: "#0b1221",
                            display: "block",
                          }}
                        />
                      </div>

                      {/* Name */}
                      <h3
                        style={{
                          fontSize: dataIdx === 0 ? 17 : 15,
                          fontWeight: 800,
                          color: "#fff",
                          letterSpacing: "-0.3px",
                          marginBottom: 4,
                          width: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.name}
                      </h3>

                      {/* Category */}
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: r.color,
                          marginBottom: 16,
                          opacity: 0.85,
                        }}
                      >
                        {user.category || "General"}
                      </p>

                      {/* Stats pill */}
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-around",
                          padding: "10px 12px",
                          borderRadius: 12,
                          background: "rgba(0,0,0,0.25)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          gap: 8,
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: 10,
                              color: "rgba(255,255,255,0.35)",
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              fontWeight: 700,
                              marginBottom: 4,
                            }}
                          >
                            Rating
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              justifyContent: "center",
                            }}
                          >
                            <FaStar size={11} style={{ color: "#F59E0B" }} />
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 800,
                                color: "#fff",
                              }}
                            >
                              {user.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            width: 1,
                            height: 28,
                            background: "rgba(255,255,255,0.08)",
                          }}
                        />
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: 10,
                              color: "rgba(255,255,255,0.35)",
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              fontWeight: 700,
                              marginBottom: 4,
                            }}
                          >
                            Reviews
                          </div>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 800,
                              color: "#fff",
                            }}
                          >
                            {user.interviewsTaken}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ══ RANKED LIST — 4+ ══ */}
              {theRest.length > 0 && (
                <div
                  className="lb-fade-2"
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {/* Section label */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                      marginTop: 4,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: "rgba(255,255,255,0.07)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.25)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      More Interviewers
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: "rgba(255,255,255,0.07)",
                      }}
                    />
                  </div>

                  {theRest.map((user, idx) => {
                    const rank = idx + 4;
                    return (
                      <div
                        key={user._id}
                        className="list-row"
                        onClick={() => navigate(`/interviewers/${user._id}`)}
                      >
                        {/* Left: rank + avatar + info */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          {/* Rank number */}
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 800,
                              color: "rgba(255,255,255,0.35)",
                              flexShrink: 0,
                            }}
                          >
                            #{rank}
                          </div>

                          {/* Avatar */}
                          <img
                            src={avatar(user.name, user.profilePicture)}
                            alt={user.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = avatar(user.name);
                            }}
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: 12,
                              objectFit: "cover",
                              background: "#0b1221",
                              border: "1px solid rgba(255,255,255,0.08)",
                              flexShrink: 0,
                            }}
                          />

                          {/* Name + category */}
                          <div>
                            <p
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#fff",
                                marginBottom: 2,
                              }}
                            >
                              {user.name}
                            </p>
                            <p
                              style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.38)",
                                fontWeight: 500,
                              }}
                            >
                              {user.category || "General"}
                            </p>
                          </div>
                        </div>

                        {/* Right: stats + arrow */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 24,
                          }}
                        >
                          {/* Rating */}
                          <div style={{ textAlign: "right" }}>
                            <p
                              style={{
                                fontSize: 10,
                                color: "rgba(255,255,255,0.3)",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                fontWeight: 700,
                                marginBottom: 3,
                              }}
                            >
                              Rating
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                justifyContent: "flex-end",
                              }}
                            >
                              <FaStar size={10} style={{ color: "#F59E0B" }} />
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "#fff",
                                }}
                              >
                                {user.rating.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {/* Sessions */}
                          <div style={{ textAlign: "right" }}>
                            <p
                              style={{
                                fontSize: 10,
                                color: "rgba(255,255,255,0.3)",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                fontWeight: 700,
                                marginBottom: 3,
                              }}
                            >
                              Sessions
                            </p>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#fff",
                              }}
                            >
                              {user.interviewsTaken}
                            </span>
                          </div>
                          {/* Arrow */}
                          <div className="view-btn">
                            <FaChevronRight size={11} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default Leaderboard;
