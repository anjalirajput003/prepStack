import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/api";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import HeroSection from "../components/dashboard/HeroSection";
import TopStats from "../components/dashboard/TopStats";
import DashboardContainer from "../components/dashboard/DashboardContainer";
import SecondRow from "../components/dashboard/SecondRow";
import ThirdRow from "../components/dashboard/ThirdRow";
import SwitchRoleBanner from "../components/dashboard/SwitchRoleBanner";
import { useToast } from "../context/ToastContext";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);

  // 1. Add state variables for the dynamic counts
  const [pendingCount, setPendingCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    async function getDashboardData() {
      try {
        // Fetch User Profile
        const profileData = await fetchWithAuth("/profile");
        setUser(profileData);

        // Fetch History Count
        const historyData = await fetchWithAuth("/interview/history");
        setHistoryCount(historyData?.history?.length || 0);

        // Fetch Interviewee Stats (Sent Requests)
        const myRequestsData = await fetchWithAuth("/interview/my");
        const upcoming =
          myRequestsData?.requests?.filter(
            (req) => req.status === "accepted" || req.status === "scheduled",
          ).length || 0;
        setUpcomingCount(upcoming);

        // Fetch Interviewer Stats (Received Requests)
        const receivedRequestsData = await fetchWithAuth("/interview/received");
        const pending =
          receivedRequestsData?.requests?.filter(
            (req) => req.status === "pending",
          ).length || 0;
        setPendingCount(pending);
      } catch (err) {
        console.log(err.message);
      }
    }
    getDashboardData();
  }, []);

  async function handleRoleSwitch() {
    try {
      const data = await fetchWithAuth("/user/switch-role", {
        method: "PUT",
      });

      setUser((prev) => ({
        ...prev,
        role: data.role,
      }));

      // Replaced native alert with your toast system
      showToast(`Role changed to ${data.role}`, "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleAvailabilityToggle() {
    try {
      const data = await fetchWithAuth("/profile/availability", {
        method: "PUT",
      });

      // Update the user state so the UI changes instantly
      setUser((prev) => ({
        ...prev,
        isAvailable: data.isAvailable,
      }));

      showToast(
        `Status set to ${data.isAvailable ? "Available" : "Unavailable"}`,
        "success",
      );
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <DashboardLayout>
      <DashboardContainer>
        <HeroSection user={user}>
          <TopStats
            user={user}
            historyCount={historyCount}
            pendingRequestsCount={pendingCount}
            upcomingInterviewsCount={upcomingCount}
          />
        </HeroSection>

        <SecondRow user={user} />

        <ThirdRow
          user={user}
          historyCount={historyCount}
          onToggleAvailability={handleAvailabilityToggle}
        />

        {/* Added Switch Role Banner at the bottom of the container */}
        <SwitchRoleBanner
          handleRoleSwitch={handleRoleSwitch}
          currentRole={user?.role}
        />
      </DashboardContainer>
    </DashboardLayout>
  );
};

export default Dashboard;