import { FaUser, FaStar, FaHistory, FaChartLine } from "react-icons/fa";

import StatCard from "./StatCard";

import { calculateProfileCompletion } from "../../utils/profileCompletion";

function StatsGrid({ user, historyCount }) {
  return (
    <div
      className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
            mb-8
            "
    >
      <StatCard
        title="Profile"
        value={`${calculateProfileCompletion(user)}%`}
        icon={<FaChartLine size={20} />}
        color="text-cyan-400"
      />

      <StatCard
        title="Role"
        value={user?.role}
        icon={<FaUser size={20} />}
        color="text-violet-400"
      />

      <StatCard
        title="History"
        value={historyCount}
        icon={<FaHistory size={20} />}
        color="text-orange-400"
      />

      <StatCard
        title="Rating"
        value={user?.rating > 0 ? user.rating.toFixed(1) : "--"}
        icon={<FaStar size={20} />}
        color="text-yellow-400"
      />
    </div>
  );
}

export default StatsGrid;
