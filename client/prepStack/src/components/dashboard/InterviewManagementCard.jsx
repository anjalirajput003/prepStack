import { FaUserTie, FaClipboardList, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ActionItem from "./ActionItem";

function InterviewManagementCard({ user }) {
  const navigate = useNavigate();

  // Dynamic routing based on role
  const isInterviewer = user?.role === "interviewer";
  const requestsRoute = isInterviewer ? "/received-requests" : "/my-requests";
  const requestsTitle = isInterviewer ? "Received Requests" : "My Requests";

  return (
    <div className="glass-card rounded-3xl p-6 h-[230px] flex flex-col">
      <h2 className="text-2xl font-semibold mb-6">Interview Management</h2>
      <br />

      <div className="space-y-4 flex-1">
        <ActionItem
          icon={<FaUserTie />}
          title="Recieved Requests"
          subtitle="Find professionals"
          onClick={() => navigate("/received-requests")}
        />

        <ActionItem
          icon={<FaClipboardList />}
          title={requestsTitle}
          subtitle="Track requests"
          onClick={() => navigate(requestsRoute)}
        />
<br />
        <ActionItem
          icon={<FaTrophy />}
          title="Leaderboard"
          subtitle="See rankings"
          onClick={() => navigate("/leaderboard")}
        />
      </div>
    </div>
  );
}

export default InterviewManagementCard;
