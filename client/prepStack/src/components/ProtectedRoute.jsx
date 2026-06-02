import { Navigate } from "react-router-dom";
import { fetchWithAuth } from "../api/api";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function verifyUser() {
      try {
        await fetchWithAuth("/me");
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    }

    verifyUser();
  }, []);

  if (isChecking) {
    return <p>Checking authentication...</p>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
