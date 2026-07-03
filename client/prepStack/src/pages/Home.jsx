import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaVideo,
  FaCode,
  FaStar,
  FaChartBar,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaArrowRight,
  FaUser,
  FaExchangeAlt,
  FaCalendarCheck,
  FaPlayCircle,
} from "react-icons/fa";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { MdOutlineVideoCall, MdCode, MdOutlineFeedback } from "react-icons/md";
import { fetchWithAuth } from "../api/api";

const Home = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await fetchWithAuth("/profile");
        setCurrentUser(data);
      } catch (error) {
        // fetchWithAuth throwing here just means there's no valid session —
        // that's an expected, normal state for a logged-out visitor.
        setCurrentUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    // NOTE: this assumes the common `localStorage "token"` pattern used
    // elsewhere in similar apps. If your api.js stores the session
    // differently (a different key, a cookie, or a dedicated logout
    // endpoint to call), point me to that file and I'll wire this up
    // to match exactly — right now this may not fully clear the session.
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#060A18",
        color: "#fff",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }

        /* ── Glows ── */
        .glow-blue {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(47,125,255,0.22) 0%, transparent 70%);
          top: -200px; left: -100px;
          pointer-events: none;
          z-index: 0;
        }
        .glow-purple {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(123,47,190,0.13) 0%, transparent 70%);
          top: 100px; right: -120px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Dot grid ── */
        .dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Navbar ── */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          padding: 14px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(6, 10, 24, 0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .logo-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2F7DFF, #1A62DA);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 16px rgba(47,125,255,0.4);
          flex-shrink: 0;
        }
        .logo-text {
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.3px;
        }
        .logo-text span { color: #4C8EFF; }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }
        .nav-links a {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          transition: color 0.2s;
          position: relative;
          padding-bottom: 2px;
        }
        .nav-links a:hover { color: #fff; }
        .nav-links a.active {
          color: #4C8EFF;
        }
        .nav-links a.active::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0; right: 0;
          height: 2px;
          background: #4C8EFF;
          border-radius: 2px;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toggle-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          font-size: 14px;
          transition: color 0.2s;
        }
        .toggle-btn:hover { color: #fff; }
        .btn-login {
          padding: 8px 20px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-login:hover { background: rgba(255,255,255,0.08); }
        .btn-signup {
          padding: 8px 20px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2F7DFF, #1A62DA);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 18px rgba(47,125,255,0.4);
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-signup:hover { opacity: 0.9; transform: translateY(-1px); }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px 5px 5px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .nav-user-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2F7DFF, #1A62DA);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
          flex-shrink: 0;
        }
        .nav-user-name {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .btn-logout {
          padding: 8px 18px;
          border-radius: 10px;
          border: 1px solid rgba(239,68,68,0.3);
          background: rgba(239,68,68,0.1);
          color: #f87171;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-logout:hover { background: rgba(239,68,68,0.18); color: #fca5a5; }
        .nav-auth-placeholder {
          width: 190px;
          height: 36px;
        }

        /* ── Hero ── */
        .hero {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
          padding: 80px 40px 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; padding: 48px 24px 40px; gap: 48px; }
          .hero-right { display: none; }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 999px;
          background: rgba(47,125,255,0.1);
          border: 1px solid rgba(47,125,255,0.25);
          color: #4C8EFF;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 22px;
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #27C281;
          box-shadow: 0 0 6px #27C281;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; } 50% { opacity: 0.4; }
        }

        .hero-title {
          font-size: clamp(38px, 4.5vw, 58px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin-bottom: 18px;
          color: #fff;
        }
        .hero-title .gradient {
          background: linear-gradient(90deg, #4C8EFF, #38BDF8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: 16px;
          line-height: 1.65;
          color: rgba(255,255,255,0.5);
          margin-bottom: 32px;
          max-width: 420px;
        }
        .hero-sub strong { color: rgba(255,255,255,0.9); font-weight: 600; }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2F7DFF, #1A62DA);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 32px rgba(47,125,255,0.45);
          margin-bottom: 32px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(47,125,255,0.55);
        }

        .hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
        }

        /* ── Laptop mockup ── */
        .laptop-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .laptop-wrap::before {
          content: '';
          position: absolute;
          inset: -20px;
          background: radial-gradient(ellipse at center, rgba(47,125,255,0.18) 0%, transparent 65%);
          pointer-events: none;
          border-radius: 50%;
        }
        .laptop-screen-frame {
          width: 100%;
          max-width: 460px;
          border-radius: 10px 10px 0 0;
          overflow: hidden;
          border: 2px solid #2d3748;
          box-shadow: 0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05);
        }
        .screen-bar {
          background: #1a1f2e;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #2d3748;
        }
        .traffic-lights { display: flex; gap: 5px; }
        .tl { width: 10px; height: 10px; border-radius: 50%; }
        .screen-title {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
        }
        .screen-body { background: #0d1117; }

        /* Video panes */
        .video-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid #1e2535;
          min-height: 130px;
        }
        .video-pane {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f1932, #0a1124);
          padding: 20px;
          position: relative;
          gap: 6px;
        }
        .video-pane:first-child { border-right: 1px solid #1e2535; }
        .avatar {
          width: 42px; height: 42px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700;
          color: #fff;
        }
        .avatar-name {
          font-size: 9px;
          color: rgba(255,255,255,0.5);
          margin-top: 2px;
        }
        .live-badge {
          position: absolute;
          top: 8px; left: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #27C281;
          box-shadow: 0 0 6px #27C281;
          animation: pulse-dot 1.5s ease-in-out infinite;
        }
        .name-tag {
          position: absolute;
          bottom: 8px; left: 8px;
          font-size: 9px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          background: rgba(0,0,0,0.6);
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Code pane */
        .code-pane {
          padding: 10px 14px;
          border-bottom: 1px solid #1e2535;
        }
        .code-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .code-dot { width: 8px; height: 8px; border-radius: 50%; background: #4C8EFF; }
        .code-tab-label { font-size: 9px; color: rgba(255,255,255,0.35); }
        .code-tab {
          font-size: 9px;
          color: rgba(255,255,255,0.45);
          background: #1e2535;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .code-block {
          font-family: 'SFMono-Regular', 'Consolas', monospace;
          font-size: 11px;
          line-height: 1.7;
          background: #080e1a;
          border: 1px solid #1e2535;
          border-radius: 6px;
          padding: 10px 12px;
        }
        .cursor {
          display: inline-block;
          width: 7px; height: 13px;
          background: #abb2bf;
          vertical-align: middle;
          margin-left: 2px;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

        /* Toolbar */
        .toolbar {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          background: #0d1117;
        }
        .tb-btn {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: #1e2535;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.15s;
          border: none;
          color: #fff;
        }
        .tb-btn.red { background: #ef4444; }

        /* Laptop base */
        .laptop-base-bar {
          width: 100%;
          max-width: 460px;
          height: 16px;
          background: linear-gradient(to bottom, #1a1f2e, #141824);
          border: 1px solid #2d3748;
          border-top: none;
          border-radius: 0 0 4px 4px;
        }
        .laptop-stand-piece {
          width: 38%;
          height: 9px;
          background: #141824;
          border: 1px solid #2d3748;
          border-top: none;
          border-radius: 0 0 6px 6px;
          margin: 0 auto;
        }

        /* ── Section wrapper ── */
        .section {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 40px;
        }
        @media (max-width: 700px) {
          .section { padding: 0 20px; }
        }

        /* ── Section heading ── */
        .section-heading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 40px;
        }
        .section-heading::before,
        .section-heading::after {
          content: '';
          flex: 1;
          max-width: 100px;
          height: 1px;
          background: rgba(255,255,255,0.12);
        }
        .section-heading h2 {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.4px;
          color: #fff;
          white-space: nowrap;
        }

        /* ── Feature cards ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 80px;
        }
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 500px) {
          .features-grid { grid-template-columns: 1fr; }
        }

        .feat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 28px 20px;
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          transition: transform 0.2s, border-color 0.2s, background 0.2s;
          cursor: default;
        }
        .feat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(76,142,255,0.3);
          background: rgba(255,255,255,0.05);
        }
        .feat-icon-wrap {
          width: 56px; height: 56px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          font-size: 22px;
        }
        .feat-title {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 5px;
        }
        .feat-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          font-weight: 400;
        }

        /* ── How it works ── */
        .steps-row {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
          margin-bottom: 80px;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 160px;
        }
        .step-circle {
          width: 64px; height: 64px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          color: #fff;
          margin-bottom: 14px;
          transition: transform 0.2s;
        }
        .step-circle:hover { transform: scale(1.08); }
        .step-num-label {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .step-num-label span { font-weight: 800; }
        .step-desc {
          font-size: 11.5px;
          color: rgba(255,255,255,0.4);
        }
        .step-arrow {
          display: flex;
          align-items: center;
          padding: 0 4px;
          margin-bottom: 32px;
          color: rgba(255,255,255,0.2);
          font-size: 16px;
          letter-spacing: -3px;
          font-weight: 400;
          flex-shrink: 0;
        }

        /* ── Wave divider ── */
        .wave-divider {
          position: relative;
          z-index: 1;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          margin-bottom: 0;
        }
        .wave-divider svg { display: block; width: 100%; }

        /* ── Footer ── */
        .footer {
          position: relative;
          z-index: 1;
          background: rgba(4, 7, 16, 0.98);
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 28px 40px;
        }
        .footer-inner {
          max-width: 1160px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }
        .footer-logo { display: flex; align-items: center; gap: 8px; }
        .footer-logo-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #2F7DFF, #1A62DA);
          display: flex; align-items: center; justify-content: center;
        }
        .footer-logo-text {
          font-size: 15px;
          font-weight: 800;
          color: #fff;
        }
        .footer-logo-text span { color: #4C8EFF; }

        .footer-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .footer-links {
          display: flex;
          align-items: center;
          gap: 12px;
          list-style: none;
        }
        .footer-links li {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .footer-links a {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          transition: color 0.2s;
        }
        .footer-links a:hover { color: #fff; }
        .footer-sep { color: rgba(255,255,255,0.2); font-size: 12px; }
        .footer-copy {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
        }
        .footer-socials {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .social-btn {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.45);
          font-size: 13px;
          transition: color 0.2s, background 0.2s;
          cursor: pointer;
        }
        .social-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.1);
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #060A18; 
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          border: 2px solid #060A18; /* Creates a nice padded effect */
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(47, 125, 255, 0.8); /* Glows blue on hover! */
        }
        
      `}</style>

      {/* Background layers */}
      <div className="dot-grid" />
      <div className="glow-blue" />
      <div className="glow-purple" />

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className="navbar">
        {/* Replaced <a> with <Link> to route back to Home */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <rect
                x="2"
                y="2"
                width="7"
                height="7"
                rx="1.5"
                fill="rgba(255,255,255,0.3)"
              />
              <rect
                x="11"
                y="2"
                width="7"
                height="7"
                rx="1.5"
                fill="rgba(255,255,255,0.3)"
              />
              <rect
                x="2"
                y="11"
                width="7"
                height="7"
                rx="1.5"
                fill="rgba(255,255,255,0.3)"
              />
              <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" />
            </svg>
          </div>
          <span className="logo-text">
            Prep<span>Stack</span>
          </span>
        </Link>

        <ul className="nav-links">
          {[
            { name: "Home", path: "/" },
            { name: "Interviewers", path: "/interviewers-list" },
            { name: "Leaderboard", path: "/leaderboard" },
            { name: "About", path: "#" },
            { name: "Contact", path: "#" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={item.name === "Home" ? "active" : ""}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="toggle-btn" onClick={() => setDark(!dark)}>
            {dark ? <HiOutlineMoon size={14} /> : <HiOutlineSun size={14} />}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path
                d="M1 1l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {!authChecked ? (
            // Avoid flashing "Login/Sign Up" for a split second before we
            // know the real auth state — reserve the space silently instead.
            <div className="nav-auth-placeholder" />
          ) : currentUser ? (
            <>
              <div className="nav-user">
                <div className="nav-user-avatar">
                  {(currentUser.name || "U").charAt(0).toUpperCase()}
                </div>
                <span className="nav-user-name">
                  {currentUser.name || "Account"}
                </span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate("/login")}>
                Login
              </button>
              <button
                className="btn-signup"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <div className="hero">
        {/* Left */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="badge-dot" />
            #1 Peer-to-Peer Interview Platform
          </div>

          <h1 className="hero-title">
            Prepare for{" "}
            <span className="gradient">
              Real
              <br />
              Interviews
            </span>
          </h1>

          <p className="hero-sub">
            Practice Mock Interviews with <strong>Real Professionals</strong> &
            Improve Your Skills
          </p>

          <button className="hero-cta" onClick={() => navigate("/dashboard")}>
            Go To Dashboard
            <FaArrowRight size={13} />
          </button>

          <div className="hero-pills">
            {[
              {
                icon: (
                  <MdOutlineVideoCall
                    style={{ color: "#27C281", fontSize: 16 }}
                  />
                ),
                label: "Live Video",
              },
              {
                icon: <MdCode style={{ color: "#4C8EFF", fontSize: 16 }} />,
                label: "Code Editor",
              },
              {
                icon: (
                  <MdOutlineFeedback
                    style={{ color: "#F59E0B", fontSize: 15 }}
                  />
                ),
                label: "Instant Feedback",
              },
            ].map((p) => (
              <span key={p.label} className="pill">
                {p.icon}
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Laptop */}
        <div className="hero-right laptop-wrap">
          <div className="laptop-screen-frame">
            {/* Title bar */}
            <div className="screen-bar">
              <div className="traffic-lights">
                <div className="tl" style={{ background: "#ff5f57" }} />
                <div className="tl" style={{ background: "#febc2e" }} />
                <div className="tl" style={{ background: "#28c840" }} />
              </div>
              <span className="screen-title">Mock Interview</span>
              <div style={{ display: "flex", gap: 4 }}>
                <div
                  style={{
                    width: 18,
                    height: 4,
                    borderRadius: 2,
                    background: "#2d3748",
                  }}
                />
                <div
                  style={{
                    width: 18,
                    height: 4,
                    borderRadius: 2,
                    background: "#2d3748",
                  }}
                />
              </div>
            </div>

            {/* Screen body */}
            <div className="screen-body">
              {/* Video panes */}
              <div className="video-row">
                <div className="video-pane">
                  <div className="live-badge">
                    <span className="live-dot" />
                  </div>
                  <div
                    className="avatar"
                    style={{
                      background: "linear-gradient(135deg, #4C8EFF, #2F7DFF)",
                    }}
                  >
                    JD
                  </div>
                  <span className="avatar-name">Interviewer</span>
                  <span className="name-tag">John Doe</span>
                </div>
                <div className="video-pane">
                  <div
                    className="avatar"
                    style={{
                      background: "linear-gradient(135deg, #27C281, #1e9a66)",
                    }}
                  >
                    ME
                  </div>
                  <span className="avatar-name">You</span>
                </div>
              </div>

              {/* Code pane */}
              <div className="code-pane">
                <div className="code-tabs">
                  <div className="code-dot" />
                  <span className="code-tab-label">Code Belton</span>
                  <span className="code-tab">floor.ts ×</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 16,
                          height: 4,
                          borderRadius: 2,
                          background: "#2d3748",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="code-block">
                  <div>
                    <span style={{ color: "#c678dd" }}>function</span>{" "}
                    <span style={{ color: "#61afef" }}>findMax</span>
                    <span style={{ color: "#abb2bf" }}>(arr) {"{"}</span>
                  </div>
                  <div style={{ paddingLeft: 16 }}>
                    <span style={{ color: "#c678dd" }}>return</span>{" "}
                    <span style={{ color: "#61afef" }}>Math.max</span>
                    <span style={{ color: "#abb2bf" }}>(...arr);</span>
                  </div>
                  <div>
                    <span style={{ color: "#abb2bf" }}>{"}"}</span>
                    <span className="cursor" />
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="toolbar">
                {["⚡", "💬", "↩", "●●", "🤚", "👍"].map((icon, i) => (
                  <button key={i} className={`tb-btn${i === 3 ? " red" : ""}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="laptop-base-bar" />
          <div className="laptop-stand-piece" />
        </div>
      </div>

      {/* ═══════════════ PLATFORM FEATURES ═══════════════ */}
      <div className="section" style={{ marginBottom: 0 }}>
        <div className="section-heading">
          <h2>Platform Features</h2>
        </div>

        <div className="features-grid">
          {[
            {
              icon: <FaVideo />,
              title: "Live Interviews",
              sub: "HD Video & Audio Call",
              iconBg: "rgba(76,142,255,0.14)",
              iconBorder: "rgba(76,142,255,0.22)",
              color: "#4C8EFF",
            },
            {
              icon: <FaCode />,
              title: "Code Editor",
              sub: "Real-time Coding",
              iconBg: "rgba(76,142,255,0.12)",
              iconBorder: "rgba(76,142,255,0.18)",
              color: "#4C8EFF",
            },
            {
              icon: <FaStar />,
              title: "Expert Feedback",
              sub: "Detailed Performance Review",
              iconBg: "rgba(251,191,36,0.14)",
              iconBorder: "rgba(251,191,36,0.22)",
              color: "#F59E0B",
            },
            {
              icon: <FaChartBar />,
              title: "Progress Tracking",
              sub: "Analytics & Reports",
              iconBg: "rgba(76,142,255,0.12)",
              iconBorder: "rgba(76,142,255,0.18)",
              color: "#4C8EFF",
            },
          ].map((f) => (
            <div key={f.title} className="feat-card">
              <div
                className="feat-icon-wrap"
                style={{
                  background: f.iconBg,
                  border: `1px solid ${f.iconBorder}`,
                  color: f.color,
                }}
              >
                {f.icon}
              </div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-sub">{f.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave between sections */}
      <div className="wave-divider" style={{ margin: "0 0 0" }}>
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: 60 }}
        >
          <defs>
            <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0a1840" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#1a3a8f" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0a1840" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 C360,60 720,0 1080,40 C1260,55 1380,20 1440,30 L1440,60 L0,60 Z"
            fill="url(#wg)"
          />
          <path
            d="M0,0 C360,60 720,0 1080,40 C1260,55 1380,20 1440,30"
            fill="none"
            stroke="rgba(47,125,255,0.35)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <div
        className="section"
        style={{
          paddingTop: 64,
          paddingBottom: 0,
          background:
            "linear-gradient(to bottom, rgba(10,20,50,0.5) 0%, transparent 100%)",
        }}
      >
        <div className="section-heading">
          <h2>How It Works</h2>
        </div>

        <div className="steps-row">
          {[
            {
              num: "1",
              label: "Sign Up",
              sub: "Create your account",
              icon: <FaUser size={20} />,
              bg: "#4C8EFF",
              glow: "rgba(76,142,255,0.45)",
              numColor: "#4C8EFF",
            },
            {
              num: "2",
              label: "Choose Category",
              sub: "Select Interview Type",
              icon: <FaExchangeAlt size={20} />,
              bg: "#27C281",
              glow: "rgba(39,194,129,0.45)",
              numColor: "#27C281",
            },
            {
              num: "3",
              label: "Book Interview",
              sub: "Pick Interviewer & Slot",
              icon: <FaCalendarCheck size={20} />,
              bg: "#7B2FBE",
              glow: "rgba(123,47,190,0.45)",
              numColor: "#A855F7",
            },
            {
              num: "4",
              label: "Start Interview",
              sub: "Join & Practice",
              icon: <FaPlayCircle size={20} />,
              bg: "#F59E0B",
              glow: "rgba(245,158,11,0.45)",
              numColor: "#F59E0B",
            },
          ].map((step, i, arr) => (
            <React.Fragment key={step.num}>
              <div className="step-item">
                <div
                  className="step-circle"
                  style={{
                    background: step.bg,
                    boxShadow: `0 0 24px ${step.glow}`,
                  }}
                >
                  {step.icon}
                </div>
                <div className="step-num-label">
                  <span style={{ color: step.numColor }}>{step.num}. </span>
                  {step.label}
                </div>
                <div className="step-desc">{step.sub}</div>
              </div>
              {i < arr.length - 1 && <div className="step-arrow">»»</div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1, minHeight: 48 }} />

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="footer">
        <div className="footer-inner">
          {/* Logo */}
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <rect
                  x="11"
                  y="11"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="white"
                />
                <rect
                  x="2"
                  y="2"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="rgba(255,255,255,0.35)"
                />
                <rect
                  x="11"
                  y="2"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="rgba(255,255,255,0.35)"
                />
                <rect
                  x="2"
                  y="11"
                  width="7"
                  height="7"
                  rx="1.5"
                  fill="rgba(255,255,255,0.35)"
                />
              </svg>
            </div>
            <span className="footer-logo-text">
              Prep<span>Stack</span>
            </span>
          </div>

          {/* Center */}
          <div className="footer-center">
            <ul className="footer-links">
              {["Privacy Policy", "Terms of Service", "Contact"].map(
                (link, i, arr) => (
                  <li
                    key={link}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <a href="#">{link}</a>
                    {i < arr.length - 1 && (
                      <span className="footer-sep">·</span>
                    )}
                  </li>
                ),
              )}
            </ul>
            <p className="footer-copy">
              © 2026 MockInterview Platform. All rights reserved.
            </p>
          </div>

          {/* Socials */}
          <div className="footer-socials">
            {[FaLinkedinIn, FaPlayCircle, FaTwitter, FaInstagram].map(
              (Icon, i) => (
                <a key={i} href="#" className="social-btn">
                  <Icon />
                </a>
              ),
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
