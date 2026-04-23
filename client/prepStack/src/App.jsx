import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Requests from "./pages/Requests";
import InterviewersList from "./pages/InterviewersList";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/interviewers-list" element={<InterviewersList />} />
        <Route path="/requests" element={<Requests />} />
      </Routes>
    </>
  );
}

export default App;
