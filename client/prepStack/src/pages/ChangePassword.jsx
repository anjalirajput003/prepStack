import React, { useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import { useToast } from "../context/ToastContext";
import {
  FaLock,
  FaArrowLeft,
  FaSpinner,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

/*  Styles  */
const STYLES = `
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse   { 0%,100% { opacity:.5; transform:scale(1);   }  50% { opacity:1;  transform:scale(1.08); } }
  @keyframes checkPop{ 0% { transform:scale(0); } 60% { transform:scale(1.2); } 100% { transform:scale(1); } }

  .cp-root { animation: fadeUp .35s ease both; }

  .cp-card {
    background: rgba(11, 20, 40, 0.78);
    border: 1px solid rgba(255,255,255,0.055);
    border-radius: 22px;
    backdrop-filter: blur(14px);
    overflow: hidden;
  }

  .cp-split {
    display: grid;
    grid-template-columns: 260px 1fr;
  }

  /* LEFT SECURITY PANEL */
  .cp-left {
    background: rgba(6, 13, 27, 0.55);
    border-right: 1px solid rgba(255,255,255,0.045);
    padding: 36px 28px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* RIGHT FORM PANEL */
  .cp-right {
    padding: 36px 36px 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Icon Hero */
  .cp-icon-hero {
    width: 68px;
    height: 68px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(47,125,255,0.18), rgba(168,85,247,0.12));
    border: 1px solid rgba(79,140,255,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #4F8CFF;
    margin: 0 auto 20px;
    box-shadow: 0 0 40px rgba(47,125,255,0.18), 0 0 80px rgba(47,125,255,0.08);
    animation: pulse 3s ease-in-out infinite;
  }

  /* Inputs */
  .cp-input {
    width: 100%;
    background: rgba(6, 13, 27, 0.7);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    height: 50px;
    padding: 0 46px 0 44px;
    font-size: 14.5px;
    color: #e2e8f0;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    font-family: inherit;
    box-sizing: border-box;
    letter-spacing: .04em;
  }
  .cp-input:focus {
    border-color: rgba(79,140,255,.55);
    box-shadow: 0 0 0 3px rgba(79,140,255,.1);
  }
  .cp-input::placeholder { color: #1e3a58; letter-spacing: 0; }
  .cp-input.match   { border-color: rgba(34,197,94,.45) !important; box-shadow: 0 0 0 3px rgba(34,197,94,.08) !important; }
  .cp-input.nomatch { border-color: rgba(239,68,68,.4)  !important; box-shadow: 0 0 0 3px rgba(239,68,68,.08)  !important; }

  .cp-icon-wrap {
    position: relative;
  }
  .cp-icon-wrap > .cp-left-icon {
    position: absolute; left:14px; top:50%; transform:translateY(-50%);
    color: #243a56; font-size:13px; pointer-events:none;
  }
  .cp-eye-btn {
    position: absolute; right:14px; top:50%; transform:translateY(-50%);
    background: none; border: none; cursor:pointer; color:#243a56;
    font-size:14px; padding:4px; display:flex; align-items:center;
    transition: color .2s;
  }
  .cp-eye-btn:hover { color:#4F8CFF; }

  /* Labels */
  .cp-label {
    display: block;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: #3d5269;
    margin-bottom: 8px;
  }

  /* Divider */
  .cp-divider {
    width:100%; height:1px;
    background: rgba(255,255,255,0.042);
    margin: 4px 0;
  }

  /* Strength meter */
  .cp-strength-bars {
    display: flex;
    gap: 5px;
    margin-top: 10px;
  }
  .cp-strength-bar {
    flex: 1;
    height: 4px;
    border-radius: 4px;
    background: rgba(255,255,255,0.06);
    transition: background .35s ease;
    overflow: hidden;
  }
  .cp-strength-bar.filled { }

  .cp-strength-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 7px;
  }

  /* Requirements */
  .cp-req-item {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 12.5px;
    padding: 6px 0;
    transition: color .25s;
  }
  .cp-req-icon {
    width: 18px; height: 18px;
    border-radius: 50%;
    display: flex; align-items:center; justify-content:center;
    font-size: 9px;
    flex-shrink: 0;
    transition: all .25s;
  }
  .cp-req-icon.met {
    background: rgba(34,197,94,.15);
    color: #22c55e;
    border: 1px solid rgba(34,197,94,.25);
    animation: checkPop .3s ease both;
  }
  .cp-req-icon.unmet {
    background: rgba(255,255,255,0.04);
    color: #243a56;
    border: 1px solid rgba(255,255,255,0.07);
  }

  /* Buttons */
  .cp-btn-cancel {
    flex: 1;
    padding: 13px;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: #64748b;
    font-weight: 600; font-size:14.5px;
    cursor:pointer; font-family:inherit;
    transition: all .2s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .cp-btn-cancel:hover { background:rgba(255,255,255,.08); color:#94a3b8; }

  .cp-btn-save {
    flex: 2;
    padding: 13px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2F7DFF 0%, #1554c0 100%);
    border: none;
    color: #fff;
    font-weight: 700; font-size:14.5px;
    cursor:pointer; font-family:inherit;
    display:flex; align-items:center; justify-content:center; gap:8px;
    box-shadow: 0 6px 28px rgba(47,125,255,.28), 0 1px 0 rgba(255,255,255,.1) inset;
    transition: all .2s;
  }
  .cp-btn-save:hover:not(:disabled) {
    background: linear-gradient(135deg, #4C8EFF 0%, #2F7DFF 100%);
    box-shadow: 0 8px 32px rgba(47,125,255,.42);
    transform: translateY(-1px);
  }
  .cp-btn-save:disabled { opacity:.45; cursor:not-allowed; transform:none; }

  .cp-back-btn {
    display:inline-flex; align-items:center; gap:7px;
    background:none; border:none; cursor:pointer;
    font-size:13px; font-weight:500; color:#3d5269;
    padding:0; font-family:inherit; transition:color .2s;
    margin-bottom: 20px;
  }
  .cp-back-btn:hover { color:#4F8CFF; }

  /* Match hint */
  .cp-match-hint {
    display:flex; align-items:center; gap:7px;
    font-size:11.5px; font-weight:600;
    margin-top:8px;
    transition:opacity .2s;
  }

  /* Tip items */
  .cp-tip {
    display:flex; align-items:flex-start; gap:10px;
    font-size:12px; color:#3d5269; line-height:1.55;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }
  .cp-tip:last-child { border-bottom: none; }
  .cp-tip-dot {
    width:5px; height:5px; border-radius:50%;
    background:#4F8CFF; flex-shrink:0; margin-top:5px;
  }

  /* Responsive */
  @media (max-width:720px) {
    .cp-split { grid-template-columns:1fr !important; }
    .cp-left  { border-right:none; border-bottom:1px solid rgba(255,255,255,0.045); }
  }
`;

/*  Helpers  */
function getStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "#243a56" };
  let s = 0;
  if (pwd.length >= 6) s++;
  if (pwd.length >= 10) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  const map = [
    null,
    { label: "Too weak", color: "#ef4444" },
    { label: "Weak", color: "#f97316" },
    { label: "Fair", color: "#eab308" },
    { label: "Good", color: "#22c55e" },
    { label: "Strong", color: "#10b981" },
  ];
  return { score: s, ...(map[s] || { label: "", color: "#243a56" }) };
}

/*  Component  */
const ChangePassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [show, setShow] = useState({
    current: false,
    newPwd: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      showToast("Please fill in all fields", "error");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      showToast("New passwords do not match!", "error");
      return;
    }
    if (formData.newPassword.length < 6) {
      showToast("New password must be at least 6 characters long", "error");
      return;
    }
    setIsSaving(true);
    try {
      await fetchWithAuth("/profile/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      showToast("Password updated successfully!", "success");
      navigate("/profile");
    } catch (err) {
      showToast(err.message || "Failed to change password", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const strength = getStrength(formData.newPassword);
  const hasNewPwd = formData.newPassword.length > 0;
  const hasConfirm = formData.confirmPassword.length > 0;
  const isMatch =
    hasConfirm && formData.newPassword === formData.confirmPassword;
  const isNoMatch =
    hasConfirm && formData.newPassword !== formData.confirmPassword;

  const requirements = [
    { label: "At least 6 characters", met: formData.newPassword.length >= 6 },
    { label: "Contains a number", met: /[0-9]/.test(formData.newPassword) },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(formData.newPassword),
    },
    {
      label: "Contains special character",
      met: /[^A-Za-z0-9]/.test(formData.newPassword),
    },
    { label: "Passwords match", met: isMatch },
  ];

  return (
    <DashboardLayout>
      <DashboardContainer>
        <style>{STYLES}</style>

        <div
          className="cp-root"
          style={{ maxWidth: 860, margin: "0 auto", padding: "4px 0 72px" }}
        >
          {/*  Page Header  */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <button
              className="cp-back-btn"
              onClick={() => navigate("/profile")}
            >
              <FaArrowLeft style={{ fontSize: 11 }} /> Back to Profile
            </button>

            <div className="cp-icon-hero">
              <FaShieldAlt />
            </div>

            <h1
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: "-0.5px",
                margin: "0 0 10px",
              }}
            >
              Change Password
            </h1>
            <p
              style={{
                color: "#3d5269",
                fontSize: 13.5,
                margin: 0,
                maxWidth: 360,
                marginInline: "auto",
              }}
            >
              Choose a strong, unique password to keep your PrepStack account
              secure.
            </p>
          </div>

          {/*  Card  */}
          <form onSubmit={handleSubmit}>
            <div className="cp-card">
              <div className="cp-split">
                {/* LEFT: Security Panel */}
                <div className="cp-left">
                  <p
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "#3d5269",
                      marginBottom: 16,
                    }}
                  >
                    Requirements
                  </p>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {requirements.map((req, i) => (
                      <div
                        key={i}
                        className="cp-req-item"
                        style={{ color: req.met ? "#94a3b8" : "#3d5269" }}
                      >
                        <span
                          className={`cp-req-icon ${req.met ? "met" : "unmet"}`}
                        >
                          {req.met ? <FaCheck /> : null}
                        </span>
                        {req.label}
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  <div style={{ marginTop: "auto", paddingTop: 32 }}>
                    <p
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        color: "#3d5269",
                        marginBottom: 12,
                      }}
                    >
                      Security Tips
                    </p>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {[
                        "Use a unique password for each service you use.",
                        "Avoid names, birthdays, or common words.",
                        "A password manager keeps things both safe and easy.",
                      ].map((tip, i) => (
                        <div className="cp-tip" key={i}>
                          <div className="cp-tip-dot" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/*RIGHT: Form */}
                <div className="cp-right">
                  {/* Current Password */}
                  <div>
                    <label className="cp-label">Current Password</label>
                    <div className="cp-icon-wrap">
                      <FaLock className="cp-left-icon" />
                      <input
                        type={show.current ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                        className="cp-input"
                        required
                      />
                      <button
                        type="button"
                        className="cp-eye-btn"
                        onClick={() => toggleShow("current")}
                        tabIndex={-1}
                      >
                        {show.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="cp-divider" />

                  {/* New Password */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <label className="cp-label" style={{ marginBottom: 0 }}>
                        New Password
                      </label>
                      {hasNewPwd && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: strength.color,
                            transition: "color .3s",
                          }}
                        >
                          {strength.label}
                        </span>
                      )}
                    </div>
                    <div className="cp-icon-wrap">
                      <FaLock className="cp-left-icon" />
                      <input
                        type={show.newPwd ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        className="cp-input"
                        required
                      />
                      <button
                        type="button"
                        className="cp-eye-btn"
                        onClick={() => toggleShow("newPwd")}
                        tabIndex={-1}
                      >
                        {show.newPwd ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {/* Strength Bars */}
                    <div className="cp-strength-bars">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="cp-strength-bar"
                          style={{
                            background:
                              i <= strength.score
                                ? strength.color
                                : "rgba(255,255,255,0.06)",
                            transition: "background .35s ease",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="cp-label">Confirm New Password</label>
                    <div className="cp-icon-wrap">
                      <FaLock className="cp-left-icon" />
                      <input
                        type={show.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your new password"
                        className={`cp-input${isMatch ? " match" : isNoMatch ? " nomatch" : ""}`}
                        required
                      />
                      <button
                        type="button"
                        className="cp-eye-btn"
                        onClick={() => toggleShow("confirm")}
                        tabIndex={-1}
                      >
                        {show.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {/* Match hint */}
                    {isMatch && (
                      <div
                        className="cp-match-hint"
                        style={{ color: "#22c55e" }}
                      >
                        <FaCheck style={{ fontSize: 10 }} /> Passwords match
                      </div>
                    )}
                    {isNoMatch && (
                      <div
                        className="cp-match-hint"
                        style={{ color: "#ef4444" }}
                      >
                        <FaExclamationTriangle style={{ fontSize: 10 }} />{" "}
                        Passwords don't match
                      </div>
                    )}
                  </div>

                  {/* Spacer */}
                  <div style={{ flex: 1 }} />

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
                    <button
                      type="button"
                      className="cp-btn-cancel"
                      onClick={() => navigate("/profile")}
                    >
                      <FaArrowLeft style={{ fontSize: 11 }} /> Cancel
                    </button>
                    <button
                      type="submit"
                      className="cp-btn-save"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <FaSpinner
                            style={{ animation: "spin .9s linear infinite" }}
                          />
                          Updating…
                        </>
                      ) : (
                        <>
                          <FaShieldAlt />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default ChangePassword;
