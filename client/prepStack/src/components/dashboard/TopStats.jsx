import {
  FaVideo,
  FaStar,
  FaClock,
  FaChartLine,
  FaCalendarCheck,
} from "react-icons/fa";
import { calculateProfileCompletion } from "../../utils/profileCompletion";
import SmallStatCard from "./SmallStatCard";

function TopStats({
  user,
  historyCount,
  pendingRequestsCount = 0,
  upcomingInterviewsCount = 0,
}) {
  return (
    <div className="glass-card rounded-[24px] h-[100px] w-full grid grid-cols-4 divide-x divide-white/10 shadow-lg overflow-hidden">
      <SmallStatCard
        icon={<FaVideo />}
        value={historyCount}
        label="Interviews Completed"
      />

      <SmallStatCard
        icon={<FaStar />}
        value={user?.rating > 0 ? user.rating.toFixed(1) : "0.0"}
        label="Average Rating"
      />

      {/* Dynamic 3rd Card: Checks role to render the right stat */}
      {user?.role === "interviewer" ? (
        <SmallStatCard
          icon={<FaClock />}
          value={pendingRequestsCount}
          label="Pending Requests"
        />
      ) : (
        <SmallStatCard
          icon={<FaCalendarCheck />}
          value={upcomingInterviewsCount}
          label="Upcoming Interviews"
        />
      )}

      <SmallStatCard
        icon={<FaChartLine />}
        value={`${calculateProfileCompletion(user)}%`}
        label="Profile Complete"
      />
    </div>
  );
}

export default TopStats;