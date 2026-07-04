import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import { useToast } from "../context/ToastContext";
import { CATEGORIES } from "../constants/appConstants";
import { useState, useEffect } from "react";
import {
  FaUser,
  FaBriefcase,
  FaGithub,
  FaLinkedinIn,
  FaCamera,
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaCode,
  FaShieldAlt,
} from "react-icons/fa";

const STYLES = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes ringRotate {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ep-root { animation: fadeIn 0.35s ease both; }

  .ep-avatar-ring {
    background: linear-gradient(135deg, #4F8CFF 0%, #a855f7 40%, #ec4899 70%, #4F8CFF 100%);
    background-size: 300% 300%;
    animation: ringRotate 4s ease infinite;
    border-radius: 50%;
    padding: 3px;
    display: inline-flex;
  }

  .ep-card {
    background: rgba(11, 20, 40, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.055);
    border-radius: 20px;
    backdrop-filter: blur(12px);
  }

  .ep-input {
    width: 100%;
    background: rgba(6, 13, 27, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 12px;
    height: 48px;
    padding: 0 14px 0 42px;
    font-size: 14.5px;
    color: #e2e8f0;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: inherit;
    box-sizing: border-box;
  }
  .ep-input.no-icon { padding-left: 14px; }
  .ep-input:focus {
    border-color: rgba(79, 140, 255, 0.55);
    box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.1);
  }
  .ep-input::placeholder { color: #1e3a58; }
  .ep-input.orange:focus {
    border-color: rgba(249, 115, 22, 0.5) !important;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.09) !important;
  }

  .ep-textarea {
    width: 100%;
    background: rgba(6, 13, 27, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 14.5px;
    color: #e2e8f0;
    outline: none;
    resize: vertical;
    min-height: 96px;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: inherit;
    box-sizing: border-box;
    line-height: 1.6;
  }
  .ep-textarea:focus {
    border-color: rgba(79, 140, 255, 0.55);
    box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.1);
  }
  .ep-textarea::placeholder { color: #1e3a58; }

  .ep-select {
    width: 100%;
    background: rgba(6, 13, 27, 0.7);
    border: 1px solid rgba(249, 115, 22, 0.14);
    border-radius: 12px;
    height: 48px;
    padding: 0 14px;
    font-size: 14.5px;
    color: #e2e8f0;
    outline: none;
    cursor: pointer;
    font-family: inherit;
    appearance: none;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ep-select:focus {
    border-color: rgba(249, 115, 22, 0.5);
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.09);
  }

  .ep-label {
    display: block;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #3d5269;
    margin-bottom: 8px;
  }

  .ep-icon-wrap { position: relative; }
  .ep-icon-wrap > svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #243a56;
    font-size: 13px;
    pointer-events: none;
  }

  .ep-section-bar {
    width: 3px;
    height: 20px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .ep-btn-cancel {
    flex: 1;
    padding: 14px;
    border-radius: 13px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.07);
    color: #64748b;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
  }
  .ep-btn-cancel:hover { background: rgba(255,255,255,0.08); color: #94a3b8; }

  .ep-btn-save {
    flex: 2;
    padding: 14px;
    border-radius: 13px;
    background: linear-gradient(135deg, #2F7DFF 0%, #1554c0 100%);
    border: none;
    color: #fff;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 6px 28px rgba(47, 125, 255, 0.28), 0 1px 0 rgba(255,255,255,0.1) inset;
    transition: all 0.2s;
  }
  .ep-btn-save:hover:not(:disabled) {
    background: linear-gradient(135deg, #4C8EFF 0%, #2F7DFF 100%);
    box-shadow: 0 8px 32px rgba(47, 125, 255, 0.42);
    transform: translateY(-1px);
  }
  .ep-btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .ep-strength-bar {
    height: 4px;
    background: rgba(255,255,255,0.05);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 6px;
  }
  .ep-strength-fill {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #2F7DFF, #a855f7);
    transition: width 0.5s ease;
  }

  .ep-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 11px;
    border-radius: 20px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ep-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13.5px;
    font-weight: 500;
    color: #3d5269;
    padding: 0;
    font-family: inherit;
    transition: color 0.2s;
  }
  .ep-back-btn:hover { color: #4F8CFF; }

  .ep-divider {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.045);
    margin: 18px 0;
  }

  .ep-social-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #3d5269;
    padding: 8px 12px;
    border-radius: 10px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
  }

  /* Responsive */
  @media (max-width: 860px) {
    .ep-grid { grid-template-columns: 1fr !important; }
    .ep-sidebar { position: static !important; }
    .ep-social-grid { grid-template-columns: 1fr !important; }
    .ep-interviewer-grid { grid-template-columns: 1fr !important; }
    .ep-span2 { grid-column: span 1 !important; }
  }
`;

function profileStrength(fd, role) {
  const base = [fd.name, fd.bio, fd.linkedin, fd.github].filter(Boolean).length;
  const extra =
    role === "interviewer"
      ? [fd.currentCompany, fd.skills, fd.category].filter(Boolean).length
      : 0;
  const total = role === "interviewer" ? 7 : 4;
  return Math.round(((base + extra) / total) * 100);
}

const EditProfile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userRole, setUserRole] = useState("interviewee");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    linkedin: "",
    github: "",
    category: "",
    experience: "",
    currentCompany: "",
    skills: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await fetchWithAuth("/profile");
        setUserRole(data.role);
        setImagePreview(data.profilePicture);
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          category: data.category || "",
          experience: data.experience || "",
          currentCompany: data.currentCompany || "",
          skills: data.skills ? data.skills.join(", ") : "",
        });
      } catch (err) {
        showToast(err.message || "Failed to load profile", "error");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [showToast]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be smaller than 5MB", "error");
      return;
    }
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {

      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", selectedFile);

        const imageRes = await fetch(
          `${import.meta.env.VITE_API_URL}/profile/upload-picture`,
          {
            method: "POST",
            credentials: "include", // 2. THIS is the magic line that sends your secure cookie!
            body: imageFormData,
          },
        );

        if (!imageRes.ok) throw new Error("Image upload failed.");
      }

      // ... rest of your submit logic

      const profileData = {
        name: formData.name,
        bio: formData.bio,
        linkedin: formData.linkedin,
        github: formData.github,
      };

      if (userRole === "interviewer") {
        profileData.category = formData.category;
        profileData.experience = formData.experience;
        profileData.currentCompany = formData.currentCompany;
        profileData.skills = formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      await fetchWithAuth("/profile/edit", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });

      showToast("Profile updated successfully!", "success");
      navigate("/profile");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardContainer>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  margin: "0 auto 16px",
                  border: "3px solid rgba(79,140,255,0.12)",
                  borderTopColor: "#4F8CFF",
                  borderRadius: "50%",
                  animation: "spin 0.9s linear infinite",
                }}
              />
              <p style={{ color: "#3d5269", fontSize: 14 }}>
                Loading your profile…
              </p>
            </div>
          </div>
        </DashboardContainer>
      </DashboardLayout>
    );
  }

  const avatarSrc =
    imagePreview ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "U")}&background=1554c0&color=fff&rounded=true&size=200`;

  const strength = profileStrength(formData, userRole);
  const strengthColor =
    strength < 40 ? "#ef4444" : strength < 70 ? "#f97316" : "#22c55e";

  const isInterviewer = userRole === "interviewer";

  return (
    <DashboardLayout>
      <DashboardContainer>
        <style>{STYLES}</style>

        <div
          className="ep-root"
          style={{ maxWidth: 1080, margin: "0 auto", padding: "4px 0 72px" }}
        >
          {/*  Page Header  */}
          <div style={{ marginBottom: 28 }}>
            <button
              className="ep-back-btn"
              onClick={() => navigate("/profile")}
              style={{ marginBottom: 14 }}
            >
              <FaArrowLeft style={{ fontSize: 11 }} />
              Back to Profile
            </button>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: "-0.5px",
                margin: "0 0 6px",
              }}
            >
              Edit Profile
            </h1>
            <p style={{ color: "#3d5269", fontSize: 13.5, margin: 0 }}>
              Changes are reflected across your public profile immediately after
              saving.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              className="ep-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "272px 1fr",
                gap: 20,
                alignItems: "start",
              }}
            >
              {/*  LEFT SIDEBAR  */}
              <div
                className="ep-sidebar"
                style={{ position: "sticky", top: 20 }}
              >
                <div className="ep-card" style={{ padding: "28px 24px" }}>
                  {/* Avatar */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <div style={{ position: "relative", marginBottom: 14 }}>
                      <div className="ep-avatar-ring">
                        <div
                          style={{
                            width: 112,
                            height: 112,
                            borderRadius: "50%",
                            overflow: "hidden",
                            background: "#060d1a",
                          }}
                        >
                          <img
                            src={avatarSrc}
                            alt="Profile preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>
                      </div>

                      {/* Camera button */}
                      <label
                        style={{
                          position: "absolute",
                          bottom: 2,
                          right: 2,
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg,#2F7DFF,#1554c0)",
                          border: "2.5px solid #060d1a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 4px 14px rgba(47,125,255,0.45)",
                        }}
                      >
                        <FaCamera style={{ color: "#fff", fontSize: 11 }} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0,
                            cursor: "pointer",
                          }}
                        />
                      </label>
                    </div>

                    {/* Name + role */}
                    <p
                      style={{
                        color: "#f1f5f9",
                        fontWeight: 700,
                        fontSize: 17,
                        margin: "0 0 8px",
                        textAlign: "center",
                      }}
                    >
                      {formData.name || (
                        <span style={{ color: "#243a56", fontStyle: "italic" }}>
                          Your Name
                        </span>
                      )}
                    </p>

                    <span
                      className="ep-pill"
                      style={{
                        background: isInterviewer
                          ? "rgba(249,115,22,0.1)"
                          : "rgba(79,140,255,0.1)",
                        color: isInterviewer ? "#f97316" : "#4F8CFF",
                        border: `1px solid ${isInterviewer ? "rgba(249,115,22,0.2)" : "rgba(79,140,255,0.2)"}`,
                      }}
                    >
                      <FaShieldAlt style={{ fontSize: 9 }} />
                      {userRole}
                    </span>
                  </div>

                  {/* Bio preview */}
                  {formData.bio && (
                    <>
                      <div
                        className="ep-divider"
                        style={{ margin: "0 0 14px" }}
                      />
                      <p
                        style={{
                          color: "#3d5269",
                          fontSize: 12.5,
                          lineHeight: 1.65,
                          textAlign: "center",
                          margin: 0,
                        }}
                      >
                        {formData.bio}
                      </p>
                    </>
                  )}

                  {/* Social links */}
                  {(formData.linkedin || formData.github) && (
                    <>
                      <div className="ep-divider" />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {formData.linkedin && (
                          <div className="ep-social-row">
                            <FaLinkedinIn
                              style={{
                                color: "#0a66c2",
                                fontSize: 13,
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontSize: 12.5,
                              }}
                            >
                              LinkedIn linked
                            </span>
                            <span
                              style={{
                                marginLeft: "auto",
                                color: "#22c55e",
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                              }}
                            >
                              ✓
                            </span>
                          </div>
                        )}
                        {formData.github && (
                          <div className="ep-social-row">
                            <FaGithub
                              style={{
                                color: "#94a3b8",
                                fontSize: 13,
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ fontSize: 12.5 }}>
                              GitHub linked
                            </span>
                            <span
                              style={{
                                marginLeft: "auto",
                                color: "#22c55e",
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                              }}
                            >
                              ✓
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Profile strength */}
                  <div className="ep-divider" />
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <span className="ep-label" style={{ marginBottom: 0 }}>
                        Profile strength
                      </span>
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: strengthColor,
                        }}
                      >
                        {strength}%
                      </span>
                    </div>
                    <div className="ep-strength-bar">
                      <div
                        className="ep-strength-fill"
                        style={{
                          width: `${strength}%`,
                          background: `linear-gradient(90deg, ${strengthColor}, ${strengthColor}aa)`,
                        }}
                      />
                    </div>
                    <p
                      style={{
                        color: "#243a56",
                        fontSize: 11.5,
                        marginTop: 8,
                        lineHeight: 1.5,
                      }}
                    >
                      {strength < 50
                        ? "Add your bio and social links to strengthen your profile."
                        : strength < 80
                          ? "Almost there — fill in the remaining fields."
                          : "Great profile! You're all set."}
                    </p>
                  </div>
                </div>
              </div>

              {/*  RIGHT FORM  */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Basic Information */}
                <div className="ep-card" style={{ padding: "26px 28px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 22,
                    }}
                  >
                    <div
                      className="ep-section-bar"
                      style={{
                        background: "linear-gradient(180deg,#4F8CFF,#a855f7)",
                      }}
                    />
                    <h2
                      style={{
                        color: "#e2e8f0",
                        fontWeight: 700,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      Basic Information
                    </h2>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 18,
                    }}
                  >
                    {/* Full Name */}
                    <div>
                      <label className="ep-label">Full Name</label>
                      <div className="ep-icon-wrap">
                        <FaUser />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="ep-input"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <label className="ep-label" style={{ marginBottom: 0 }}>
                          Bio
                        </label>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color:
                              formData.bio.length > 130 ? "#f97316" : "#243a56",
                            transition: "color 0.2s",
                          }}
                        >
                          {formData.bio.length} / 150
                        </span>
                      </div>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        maxLength="150"
                        placeholder="A short intro that appears on your public profile..."
                        className="ep-textarea"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Profiles */}
                <div className="ep-card" style={{ padding: "26px 28px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 22,
                    }}
                  >
                    <div
                      className="ep-section-bar"
                      style={{
                        background: "linear-gradient(180deg,#0a66c2,#6366f1)",
                      }}
                    />
                    <h2
                      style={{
                        color: "#e2e8f0",
                        fontWeight: 700,
                        fontSize: 16,
                        margin: 0,
                      }}
                    >
                      Social Profiles
                    </h2>
                  </div>

                  <div
                    className="ep-social-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label className="ep-label">LinkedIn URL</label>
                      <div className="ep-icon-wrap">
                        <FaLinkedinIn />
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          placeholder="linkedin.com/in/yourname"
                          className="ep-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="ep-label">GitHub URL</label>
                      <div className="ep-icon-wrap">
                        <FaGithub />
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          placeholder="github.com/yourname"
                          className="ep-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interviewer Details */}
                {isInterviewer && (
                  <div
                    className="ep-card"
                    style={{
                      padding: "26px 28px",
                      borderColor: "rgba(249,115,22,0.13)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 22,
                      }}
                    >
                      <div
                        className="ep-section-bar"
                        style={{
                          background: "linear-gradient(180deg,#f97316,#fbbf24)",
                        }}
                      />
                      <h2
                        style={{
                          color: "#f97316",
                          fontWeight: 700,
                          fontSize: 16,
                          margin: 0,
                        }}
                      >
                        Interviewer Details
                      </h2>
                    </div>

                    <div
                      className="ep-interviewer-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                      }}
                    >
                      {/* Category */}
                      <div>
                        <label className="ep-label">Primary Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="ep-select"
                          required
                        >
                          <option value="" style={{ background: "#06111e" }}>
                            Select category…
                          </option>
                          {CATEGORIES.map((cat) => (
                            <option
                              key={cat}
                              value={cat}
                              style={{ background: "#06111e" }}
                            >
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Experience */}
                      <div>
                        <label className="ep-label">Years of Experience</label>
                        <input
                          type="number"
                          name="experience"
                          min="0"
                          value={formData.experience}
                          onChange={handleChange}
                          className="ep-input no-icon orange"
                          style={{ borderColor: "rgba(249,115,22,0.14)" }}
                          placeholder="e.g. 5"
                        />
                      </div>

                      {/* Current Company */}
                      <div
                        className="ep-span2"
                        style={{ gridColumn: "span 2" }}
                      >
                        <label className="ep-label">Current Company</label>
                        <div className="ep-icon-wrap">
                          <FaBriefcase />
                          <input
                            type="text"
                            name="currentCompany"
                            value={formData.currentCompany}
                            onChange={handleChange}
                            placeholder="Google, Meta, your startup…"
                            className="ep-input orange"
                            style={{ borderColor: "rgba(249,115,22,0.14)" }}
                          />
                        </div>
                      </div>

                      {/* Skills */}
                      <div
                        className="ep-span2"
                        style={{ gridColumn: "span 2" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <label
                            className="ep-label"
                            style={{ marginBottom: 0 }}
                          >
                            Tech Skills
                          </label>
                          <span style={{ fontSize: 11, color: "#243a56" }}>
                            comma-separated
                          </span>
                        </div>
                        <div className="ep-icon-wrap">
                          <FaCode />
                          <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, Node.js, System Design, Python…"
                            className="ep-input orange"
                            style={{ borderColor: "rgba(249,115,22,0.14)" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
                  <button
                    type="button"
                    className="ep-btn-cancel"
                    onClick={() => navigate("/profile")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ep-btn-save"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <FaSpinner
                          style={{ animation: "spin 0.9s linear infinite" }}
                        />
                        Saving…
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default EditProfile;
