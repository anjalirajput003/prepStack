import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import { useToast } from "../context/ToastContext";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaBriefcase,
  FaCode,
  FaStar,
  FaEdit,
  FaKey,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaUserCircle,
} from "react-icons/fa";

/* ─── tiny helpers ─── */
const Field = ({ label, value, accent }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.35)",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: 14,
        fontWeight: 500,
        color: accent || "rgba(255,255,255,0.85)",
      }}
    >
      {value || (
        <span style={{ color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>
          Not provided
        </span>
      )}
    </span>
  </div>
);

const StatPill = ({ label, value, color, icon }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    <span
      style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}
    >
      {label}
    </span>
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
        fontWeight: 700,
        color: color || "rgba(255,255,255,0.9)",
      }}
    >
      {icon && icon}
      {value}
    </span>
  </div>
);

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    async function getProfile() {
      try {
        const data = await fetchWithAuth("/profile");
        setUser(data);
      } catch (err) {
        showToast(err.message || "Failed to load profile", "error");
      }
    }
    getProfile();
  }, [showToast]);

  if (!user) {
    return (
      <DashboardLayout>
        <DashboardContainer>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40vh",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "3px solid rgba(47,125,255,0.2)",
                  borderTop: "3px solid #4C8EFF",
                  margin: "0 auto 16px",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
                Loading profile…
              </p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </DashboardContainer>
      </DashboardLayout>
    );
  }

  const isIncompleteInterviewer =
    user.role === "interviewer" &&
    (!user.category || !user.skills || user.skills.length === 0);

  const avatarSrc =
    user.profilePicture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=2F7DFF&color=fff&rounded=true&size=256`;

  const isInterviewer = user.role === "interviewer";

  return (
    <DashboardLayout>
      <DashboardContainer>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          .profile-root * { box-sizing: border-box; font-family: 'Inter', -apple-system, sans-serif; }

          /* card base */
          .pcard {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 20px;
            backdrop-filter: blur(8px);
          }

          /* hover lift on action buttons */
          .action-btn { transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s; }
          .action-btn:hover { transform: translateY(-2px); opacity: 0.92; }
          .action-btn:active { transform: translateY(0); }

          /* social link hover */
          .soc-link { transition: color 0.15s, background 0.15s; }
          .soc-link:hover { background: rgba(76,142,255,0.12) !important; color: #4C8EFF !important; }

          /* skill chip hover */
          .skill-chip { transition: border-color 0.15s, background 0.15s; }
          .skill-chip:hover { border-color: rgba(76,142,255,0.5) !important; background: rgba(76,142,255,0.1) !important; }

          /* fade-in page */
          @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
          .fade-up { animation: fadeUp 0.4s ease both; }
          .fade-up-2 { animation: fadeUp 0.4s 0.08s ease both; }
          .fade-up-3 { animation: fadeUp 0.4s 0.16s ease both; }
          .fade-up-4 { animation: fadeUp 0.4s 0.24s ease both; }
        `}</style>

        <div
          className="profile-root"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: 1020,
            margin: "0 auto",
            gap: 20,
            paddingBottom: 48,
            paddingTop: 4,
          }}
        >
          {/* ── Page header ── */}
          <div className="fade-up" style={{ marginBottom: 4 }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.5px",
                marginBottom: 4,
              }}
            >
              My Profile
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                fontWeight: 400,
              }}
            >
              Manage your personal information and platform settings.
            </p>
          </div>

          {/* ── Incomplete banner ── */}
          {isIncompleteInterviewer && (
            <div
              className="fade-up"
              style={{
                background: "rgba(249,115,22,0.08)",
                border: "1px solid rgba(249,115,22,0.2)",
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(249,115,22,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#F97316",
                    flexShrink: 0,
                  }}
                >
                  <FaExclamationTriangle size={15} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#F97316",
                      marginBottom: 2,
                    }}
                  >
                    Profile Incomplete
                  </p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                    Your interviewer profile is missing a category or skills.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/edit-profile")}
                className="action-btn"
                style={{
                  padding: "9px 20px",
                  borderRadius: 10,
                  background: "#F97316",
                  border: "none",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(249,115,22,0.3)",
                }}
              >
                Complete Profile
              </button>
            </div>
          )}

          {/* HERO PROFILE CARD */}
          <div
            className="pcard fade-up-2"
            style={{ overflow: "hidden", position: "relative" }}
          >
            {/* Subtle top-accent stripe */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background:
                  "linear-gradient(90deg, #2F7DFF 0%, #38BDF8 50%, #27C281 100%)",
              }}
            />

            {/* Faint glow behind avatar area */}
            <div
              style={{
                position: "absolute",
                top: -60,
                left: -40,
                width: 280,
                height: 280,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(47,125,255,0.1) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                padding: "32px 32px 28px",
                display: "flex",
                gap: 28,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: 108,
                    height: 108,
                    borderRadius: 20,
                    padding: 3,
                    background: "linear-gradient(135deg, #2F7DFF, #27C281)",
                    boxShadow: "0 8px 32px rgba(47,125,255,0.3)",
                  }}
                >
                  <img
                    src={avatarSrc}
                    alt={user.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = avatarSrc;
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 17,
                      objectFit: "cover",
                      display: "block",
                      background: "#0b1425",
                    }}
                  />
                </div>
                {/* Online dot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 6,
                    right: 6,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#27C281",
                    border: "2px solid #0b1221",
                    boxShadow: "0 0 8px rgba(39,194,129,0.6)",
                  }}
                />
              </div>

              {/* Name / email / bio */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 6,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "-0.4px",
                      lineHeight: 1.2,
                    }}
                  >
                    {user.name}
                  </h2>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "4px 12px",
                      borderRadius: 999,
                      background: isInterviewer
                        ? "rgba(47,125,255,0.15)"
                        : "rgba(39,194,129,0.12)",
                      color: isInterviewer ? "#4C8EFF" : "#27C281",
                      border: `1px solid ${isInterviewer ? "rgba(47,125,255,0.25)" : "rgba(39,194,129,0.2)"}`,
                    }}
                  >
                    {user.role}
                  </span>
                </div>

                <a
                  href={`mailto:${user.email}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#4C8EFF",
                    textDecoration: "none",
                    marginBottom: 16,
                    padding: "5px 12px",
                    borderRadius: 8,
                    background: "rgba(76,142,255,0.08)",
                    border: "1px solid rgba(76,142,255,0.15)",
                    transition: "background 0.15s",
                  }}
                >
                  <FaEnvelope size={12} /> {user.email}
                </a>

                {/* Bio box */}
                <div
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    padding: "14px 16px",
                    borderLeft: "3px solid rgba(76,142,255,0.4)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      lineHeight: 1.65,
                      color: user.bio
                        ? "rgba(255,255,255,0.75)"
                        : "rgba(255,255,255,0.28)",
                      fontStyle: user.bio ? "normal" : "italic",
                    }}
                  >
                    {user.bio
                      ? `"${user.bio}"`
                      : "No bio added yet — tell others a bit about yourself!"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER GRID — Contact + Interviewer Stats*/}
          <div
            className="fade-up-3"
            style={{
              display: "grid",
              gridTemplateColumns: isInterviewer ? "1fr 1fr" : "1fr",
              gap: 20,
            }}
          >
            {/* ── Contact & Socials ── */}
            <div
              className="pcard"
              style={{
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                  paddingBottom: 16,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(76,142,255,0.12)",
                    border: "1px solid rgba(76,142,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4C8EFF",
                  }}
                >
                  <FaEnvelope size={13} />
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.2px",
                  }}
                >
                  Contact & Socials
                </h3>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                {/* LinkedIn */}
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      marginBottom: 8,
                    }}
                  >
                    LinkedIn
                  </p>
                  {user.linkedin ? (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="soc-link"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 14px",
                        borderRadius: 10,
                        background: "rgba(10,102,194,0.1)",
                        border: "1px solid rgba(10,102,194,0.25)",
                        color: "#60A5FA",
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <FaLinkedin size={15} style={{ color: "#0A66C2" }} />
                      View LinkedIn Profile
                    </a>
                  ) : (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 14px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px dashed rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.25)",
                        fontSize: 13,
                      }}
                    >
                      <FaLinkedin size={15} /> Not connected
                    </div>
                  )}
                </div>

                {/* GitHub */}
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      marginBottom: 8,
                    }}
                  >
                    GitHub
                  </p>
                  {user.github ? (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noreferrer"
                      className="soc-link"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 14px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <FaGithub size={15} />
                      View GitHub Profile
                    </a>
                  ) : (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 14px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px dashed rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.25)",
                        fontSize: 13,
                      }}
                    >
                      <FaGithub size={15} /> Not connected
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Interviewer Stats (only if interviewer) ── */}
            {isInterviewer && (
              <div
                className="pcard"
                style={{
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                    paddingBottom: 16,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(251,191,36,0.12)",
                      border: "1px solid rgba(251,191,36,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FBBF24",
                    }}
                  >
                    <FaStar size={13} />
                  </div>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    Interviewer Stats
                  </h3>
                </div>

                {/* Stats list */}
                <div>
                  <StatPill
                    label="Status"
                    value={
                      user.isAvailable ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "3px 10px",
                            borderRadius: 999,
                            background: "rgba(39,194,129,0.1)",
                            border: "1px solid rgba(39,194,129,0.2)",
                            color: "#27C281",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          <FaCheckCircle size={11} />
                          Available
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "3px 10px",
                            borderRadius: 999,
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.2)",
                            color: "#F87171",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          <FaTimesCircle size={11} />
                          Unavailable
                        </span>
                      )
                    }
                  />
                  <StatPill
                    label="Category"
                    value={
                      user.category || (
                        <span
                          style={{
                            color: "rgba(255,255,255,0.25)",
                            fontStyle: "italic",
                          }}
                        >
                          Not selected
                        </span>
                      )
                    }
                  />
                  <StatPill
                    label="Experience"
                    value={`${user.experience || 0} Years`}
                    icon={
                      <FaBriefcase
                        size={11}
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      />
                    }
                  />
                  <StatPill
                    label="Company"
                    value={
                      user.currentCompany || (
                        <span
                          style={{
                            color: "rgba(255,255,255,0.25)",
                            fontStyle: "italic",
                          }}
                        >
                          Not added
                        </span>
                      )
                    }
                  />
                  <StatPill
                    label="Rating"
                    color="#FBBF24"
                    icon={<FaStar size={11} style={{ color: "#FBBF24" }} />}
                    value={user.rating ? user.rating.toFixed(2) : "New"}
                  />
                  <StatPill
                    label="Interviews Taken"
                    value={user.interviewsTaken || 0}
                    color="#4C8EFF"
                  />

                  {/* Skills */}
                  <div style={{ paddingTop: 14 }}>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.3)",
                        marginBottom: 10,
                      }}
                    >
                      Skills
                    </p>
                    {user.skills?.length > 0 ? (
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 7 }}
                      >
                        {user.skills.map((s) => (
                          <span
                            key={s}
                            className="skill-chip"
                            style={{
                              padding: "5px 12px",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              background: "rgba(76,142,255,0.08)",
                              border: "1px solid rgba(76,142,255,0.2)",
                              color: "rgba(255,255,255,0.75)",
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p
                        style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.25)",
                          fontStyle: "italic",
                        }}
                      >
                        No skills added yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Action Buttons ── */}
          <div
            className="fade-up-4"
            style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
          >
            <button
              onClick={() => navigate("/edit-profile")}
              className="action-btn"
              style={{
                flex: 1,
                minWidth: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                padding: "14px 24px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #2F7DFF 0%, #1A62DA 100%)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow:
                  "0 0 24px rgba(47,125,255,0.35), 0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              <FaEdit size={14} /> Edit Profile
            </button>

            <button
              onClick={() => navigate("/change-password")}
              className="action-btn"
              style={{
                flex: 1,
                minWidth: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                padding: "14px 24px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.8)",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <FaKey size={13} /> Change Password
            </button>
          </div>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default MyProfile;
