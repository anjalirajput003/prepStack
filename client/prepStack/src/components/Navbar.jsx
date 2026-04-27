import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div>
      <h3>PrepStack</h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Navbar;
