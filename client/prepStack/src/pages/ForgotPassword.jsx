import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return showToast("Please enter your email", "error");

    try {
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      showToast(data.message, "success");
      setEmail("");
    } catch (err) {
      showToast(err.message || "Failed to connect", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070D] text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#0D1526] border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-slate-400 mb-6 text-sm">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-black/40 border border-white/10 focus-within:border-blue-500 transition-colors">
            <FaEnvelope className="text-slate-500" />
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent outline-none flex-1 text-sm text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <Link
          to="/login"
          className="flex items-center gap-2 mt-6 text-sm text-blue-400 hover:text-blue-300"
        >
          <FaArrowLeft /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
