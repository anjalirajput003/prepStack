import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CATEGORIES } from "../constants/appConstants";
import { useToast } from "../context/ToastContext";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPlay,
  FaChevronDown,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "interviewee",
    category: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSignup(e) {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (formData.role === "interviewer" && !formData.category) {
      showToast(
        "Please select a category for your interviewer profile",
        "error",
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message, "error");
        setIsLoading(false);
        return;
      }

      showToast("Account created successfully! Please log in.", "success");
      navigate("/login");
    } catch (err) {
      showToast("Failed to connect to server", "error");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#05070D] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&display=swap');
      `}</style>

      {/* Faint editor-style grid texture */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      ></div>

      {/* Ambient glow */}
      <div className="absolute top-[15%] left-[15%] w-[380px] h-[380px] rounded-full bg-[#27c281] blur-[160px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[280px] h-[280px] rounded-full bg-[#2F7DFF] blur-[140px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 motion-safe:animate-fade-in">
        <div className="relative rounded-[28px] border border-white/10 bg-[#0D1526]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] p-8 md:p-10 overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#27c281] via-[#34d399] to-[#2F7DFF]"></div>

          <div className="flex flex-col h-50 justify-center items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#27c281] to-[#1e9a66] flex items-center justify-center shadow-lg shadow-[#27c281]/30 ring-1 ring-white/10 mb-4">
              <FaPlay className="text-white ml-0.5" />
            </div>
            <h2
              className="text-3xl font-semibold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Create Account
            </h2>
            <p className="text-slate-400 mt-2 text-[15px]">
              Join PrepStack and start practicing
            </p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div>
              <label htmlFor="signup-name" className="sr-only">
                Full name
              </label>
              <div className="group flex items-center gap-3 h-14 px-4 rounded-xl bg-[#05070D]/70 border border-white/10 focus-within:border-[#27c281]/60 focus-within:ring-2 focus-within:ring-[#27c281]/15 transition-all">
                <FaUser className="text-slate-500 group-focus-within:text-[#27c281] transition-colors shrink-0" />
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="flex-1 bg-transparent outline-none text-[15px] text-white placeholder-slate-500"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="sr-only">
                Email address
              </label>
              <div className="group flex items-center gap-3 h-14 px-4 rounded-xl bg-[#05070D]/70 border border-white/10 focus-within:border-[#27c281]/60 focus-within:ring-2 focus-within:ring-[#27c281]/15 transition-all">
                <FaEnvelope className="text-slate-500 group-focus-within:text-[#27c281] transition-colors shrink-0" />
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="flex-1 bg-transparent outline-none text-[15px] text-white placeholder-slate-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="sr-only">
                Password
              </label>
              <div className="group flex items-center gap-3 h-14 px-4 rounded-xl bg-[#05070D]/70 border border-white/10 focus-within:border-[#27c281]/60 focus-within:ring-2 focus-within:ring-[#27c281]/15 transition-all">
                <FaLock className="text-slate-500 group-focus-within:text-[#27c281] transition-colors shrink-0" />
                <input
                  id="signup-password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="flex-1 bg-transparent outline-none text-[15px] text-white placeholder-slate-500"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Role Selection Toggle */}
            <div className="flex bg-[#05070D]/70 p-1.5 rounded-xl border border-white/10 mt-2 gap-1">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: "interviewee",
                    category: "",
                  })
                }
                className={`flex-1 h-5 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  formData.role === "interviewee"
                    ? "bg-[#27c281] text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FaUserGraduate className="text-xs" />
                Interviewee
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, role: "interviewer" })
                }
                className={`flex-1 h-5 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  formData.role === "interviewer"
                    ? "bg-[#27c281] text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FaUserTie className="text-xs" />
                Interviewer
              </button>
            </div>

            {/* Conditional Category Dropdown for Interviewers */}
            {formData.role === "interviewer" && (
              <div className="relative motion-safe:animate-fade-in">
                <label htmlFor="signup-category" className="sr-only">
                  Area of expertise
                </label>
                <select
                  id="signup-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="appearance-none w-full h-14 px-4 pr-12 rounded-xl bg-[#05070D]/70 border border-white/10 text-[15px] text-white outline-none focus:border-[#27c281]/60 focus:ring-2 focus:ring-[#27c281]/15 transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#0D1526] text-slate-500">
                    Select your expertise...
                  </option>
                  {CATEGORIES.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-[#0D1526]"
                    >
                      {category}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-[#27c281] to-[#1e9a66] hover:from-[#21a870] hover:to-[#27c281] text-white font-semibold text-[16px] transition-all shadow-[0_0_20px_rgba(39,194,129,0.3)] mt-3 disabled:opacity-50 disabled:cursor-not-allowed motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27c281]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1526]"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-8 text-[15px]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#27c281] font-semibold hover:text-[#1e9a66] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
