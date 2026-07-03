import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import InterviewersList from "./pages/InterviewersList";
import ProtectedRoute from "./components/ProtectedRoute";
import MyRequests from "./pages/MyRequests";
import "./App.css";
import ReceivedRequests from "./pages/ReceivedRequests";
import InterviewRoom from "./pages/InterviewRoom";
import Leaderboard from "./pages/Leaderboard";
import InterviewerProfile from "./pages/InterviewerProfile";
import EditProfile from "./pages/EditProfile";
import MyProfile from "./pages/MyProfile";
import ChangePassword from "./pages/ChangePassword";
import Home from "./pages/Home";
import { SocketProvider } from "./context/SocketContext";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviewers-list"
            element={
              <ProtectedRoute>
                <InterviewersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/received-requests"
            element={
              <ProtectedRoute>
                <ReceivedRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-room/:interviewId"
            element={
              <ProtectedRoute>
                <InterviewRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviewers/:id"
            element={
              <ProtectedRoute>
                <InterviewerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </SocketProvider>
    </>
  );
}

export default App;
