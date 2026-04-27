import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      //if login failed
      if (!res.ok) {
        alert(data.message);
        return;
      }

      //store token sent by backend
      localStorage.setItem("token", data.token);
      console.log("token: ", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
