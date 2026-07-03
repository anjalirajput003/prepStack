import { FaUser, FaHistory, FaClock, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ActionItem from "./ActionItem";

function QuickActionsCard({onToggleAvailability}) {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-3xl p-6 h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>

      <div className="space-y-4 flex-1">
        <ActionItem
          icon={<FaUser />}
          title="My Profile"
          subtitle="View and edit profile"
          onClick={() => navigate("/profile")}
        />

        <ActionItem
          icon={<FaHistory />}
          title="Interview History"
          subtitle="View previous interviews"
          onClick={() => navigate("/history")}
        />

        <ActionItem
          icon={<FaClock />}
          title="Availability"
          subtitle="Manage availability"
          onClick={onToggleAvailability}
        />

        <ActionItem
          icon={<FaUserTie />}
          title="Browse Interviewers"
          subtitle="Find professionals"
          onClick={() => navigate("/interviewers-list")}
        />
      </div>
    </div>
  );
}

export default QuickActionsCard;
