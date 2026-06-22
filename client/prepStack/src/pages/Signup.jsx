import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "interviewee",
    category: "Tech",
    skills: "",
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
          skills: formData.skills.split(",").map((skill) => skill.trim()),
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

      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="interviewee">Interviewee</option>

        <option value="interviewer">Interviewer</option>
      </select>

      <br />

      {/* <select name="category" value={formData.category} onChange={handleChange}>
        <option value="HR">HR</option>
        <option value="Tech">Tech</option>
        <option value="Finance">Finance</option>
        <option value="Marketing">Marketing</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Non-Tech">Non-Tech</option>
        <option value="Others">Others</option>
      </select> */}

      <br />

      {/* <input
        type="text"
        name="skills"
        placeholder="React, Node, MongoDB"
        value={formData.skills}
        onChange={handleChange}
      /> */}

      <br />

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
