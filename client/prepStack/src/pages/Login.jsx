import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { FaEnvelope, FaLock, FaPlay } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        credentials: "include", // <-- THIS IS REQUIRED TO ACCEPT THE COOKIE
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message, "error");
        setIsLoading(false);
        return;
      }

      showToast("Welcome back!", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast("Failed to connect to server", "error");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#05070D] text-white">
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
      <div className="absolute top-[15%] right-[15%] w-[380px] h-[380px] rounded-full bg-[#2F7DFF] blur-[160px] opacity-25 pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[280px] h-[280px] rounded-full bg-[#27C281] blur-[140px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 motion-safe:animate-fade-in">
        <div className="relative rounded-[28px] border border-white/10 bg-[#0D1526]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] p-8 md:p-10 overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2F7DFF] via-[#4C8EFF] to-[#27c281]"></div>

          <div className="flex flex-col items-center h-50 mb-9 justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F7DFF] to-[#1A62DA] flex items-center justify-center shadow-lg shadow-[#2F7DFF]/30 ring-1 ring-white/10 mb-4">
              <FaPlay className="text-white ml-0.5" />
            </div>
            <h2
              className="text-3xl font-semibold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Welcome Back
            </h2>
            <p className="text-slate-400 mt-2 text-[15px]">
              Sign in to continue to PrepStack
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-email" className="sr-only">
                Email address
              </label>
              <div className="group flex items-center gap-3 h-14 px-4 rounded-xl bg-[#05070D]/70 border border-white/10 focus-within:border-[#4C8EFF]/60 focus-within:ring-2 focus-within:ring-[#4C8EFF]/15 transition-all">
                <FaEnvelope className="text-slate-500 group-focus-within:text-[#4C8EFF] transition-colors shrink-0" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="Email address"
                  className="flex-1 bg-transparent outline-none text-[15px] text-white placeholder-slate-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="sr-only">
                Password
              </label>
              <div className="group flex items-center gap-3 h-14 px-4 rounded-xl bg-[#05070D]/70 border border-white/10 focus-within:border-[#4C8EFF]/60 focus-within:ring-2 focus-within:ring-[#4C8EFF]/15 transition-all">
                <FaLock className="text-slate-500 group-focus-within:text-[#4C8EFF] transition-colors shrink-0" />
                <input
                  id="login-password"
                  type="password"
                  placeholder="Password"
                  className="flex-1 bg-transparent outline-none text-[15px] text-white placeholder-slate-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-400 hover:text-blue-300 self-end mt-1"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-[#2F7DFF] to-[#1A62DA] hover:from-[#4C8EFF] hover:to-[#2F7DFF] text-white font-semibold text-[16px] transition-all shadow-[0_0_20px_rgba(47,125,255,0.3)] mt-2 disabled:opacity-50 disabled:cursor-not-allowed motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C8EFF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1526]"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-8 text-[15px]">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#4C8EFF] font-semibold hover:text-[#2F7DFF] transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
