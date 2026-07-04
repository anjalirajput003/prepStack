import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { FaLock } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return showToast("Passwords do not match", "error");
    }
    if (password.length < 6) {
      return showToast("Password must be at least 6 characters", "error");
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reset-password/${token}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        },
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      showToast(data.message, "success");
      navigate("/login");
    } catch (err) {
      showToast(err.message || "Failed to reset password", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070D] text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#0D1526] border border-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">Create New Password</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-black/40 border border-white/10 focus-within:border-blue-500">
            <FaLock className="text-slate-500" />
            <input
              type="password"
              placeholder="New Password"
              className="bg-transparent outline-none flex-1 text-sm text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-black/40 border border-white/10 focus-within:border-blue-500">
            <FaLock className="text-slate-500" />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="bg-transparent outline-none flex-1 text-sm text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 mt-2 rounded-xl bg-green-600 hover:bg-green-500 font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
