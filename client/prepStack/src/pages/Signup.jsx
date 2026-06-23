import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../constants/appConstants";

const Signup = () => {
  const navigate = useNavigate();

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

  async function handleSignup() {
    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          category: formData.category,
          // skills: formData.skills.split(",").map((skill) => skill.trim()),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Signup successful");

      navigate("/login");
    } catch (err) {
      console.log(err);

      alert("Signup failed");
    }
  }

  return (
    <div>
      <h2>Signup</h2>

      <input
        type="text"
        name="name"
        placeholder="Enter name"
        value={formData.name}
        onChange={handleChange}
      />

      <br />

      <input
        type="email"
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
      />

      <br />

      <input
        type="password"
        name="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
      />

      <br />

      <select
        value={formData.role}
        onChange={(e) =>
          setFormData({
            ...formData,
            role: e.target.value,
            category: "",
          })
        }
      >
        <option value="interviewee">Interviewee</option>

        <option value="interviewer">Interviewer</option>
      </select>

      <br />

      {formData.role === "interviewer" && (
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value,
            })
          }
        >
          <option value="">Select Category</option>

          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      )}

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
