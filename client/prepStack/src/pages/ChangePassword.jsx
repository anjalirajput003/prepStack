import React, { useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  async function handleChangePassword() {
    try {
      const data = await fetchWithAuth("/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      alert(data.message);
      if (newPassword.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Change Password</h2>

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <br />

      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
};

export default ChangePassword;
