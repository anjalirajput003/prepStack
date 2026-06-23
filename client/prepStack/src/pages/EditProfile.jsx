import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../constants/appConstants";

const INITIAL_FORM_STATE = {
  name: "",
  bio: "",
  linkedin: "",
  github: "",
  skills: "",
  category: "",
  experience: 0,
  currentCompany: "",
  role: "",
};

const EditProfile = () => {
  const [formData, setFormData] = useState({ INITIAL_FORM_STATE });
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      try {
        const data = await fetchWithAuth("/profile");

        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
          skills: data.skills?.join(", ") || "",
          category: data.category || "",
          experience: data.experience || 0,
          currentCompany: data.currentCompany || "",
          role: data.role || "",
        });

        setIsAvailable(data.isAvailable ?? true);
      } catch (err) {
        alert(err.message);
      }
    }

    getProfile();
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function getSkillsArray() {
    return formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  async function handleSave() {
    try {
      await fetchWithAuth("/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          linkedin: formData.linkedin,
          github: formData.github,
          category: formData.category,
          experience: Number(formData.experience),
          currentCompany: formData.currentCompany,
          skills: getSkillsArray(),
          isAvailable,
        }),
      });

      alert("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleProfilePictureUpload() {
    if (!selectedFile) {
      alert("Please select an image");
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("image", selectedFile);

      const response = await fetch(
        "http://localhost:8080/profile/upload-picture",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Profile picture uploaded successfully");
    } catch (err) {
      console.log(err);

      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h2>Edit Profile</h2>

      <h3>Profile Picture</h3>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />

      <button onClick={handleProfilePictureUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Picture"}
      </button>

      <br />
      <br />

      <p>
        Current Role: <strong>{formData.role}</strong>
      </p>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />

      <br />

      <textarea
        name="bio"
        placeholder="Bio"
        value={formData.bio}
        onChange={handleChange}
      />

      <br />

      <input
        type="text"
        name="skills"
        placeholder="React, Node, MongoDB"
        value={formData.skills}
        onChange={handleChange}
      />

      <br />

      <input
        type="text"
        name="linkedin"
        placeholder="LinkedIn URL"
        value={formData.linkedin}
        onChange={handleChange}
      />

      <br />

      <input
        type="text"
        name="github"
        placeholder="GitHub URL"
        value={formData.github}
        onChange={handleChange}
      />

      <br />

      {formData.role === "interviewer" && (
        <>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <br />

          <input
            type="number"
            name="experience"
            placeholder="Years of Experience"
            value={formData.experience}
            onChange={handleChange}
          />

          <br />

          <input
            type="text"
            name="currentCompany"
            placeholder="Current Company"
            value={formData.currentCompany}
            onChange={handleChange}
          />

          <br />

          <label>Available For Interviews</label>
          <select
            value={isAvailable}
            onChange={(e) => setIsAvailable(e.target.value === "true")}
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </>
      )}

      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
};

export default EditProfile;
