import MyStatsCard from "./MyStatsCard";
import QuickActionsCard from "./QuickActionsCard";
import InterviewManagementCard from "./InterviewManagementCard";

// Catch the new prop here
function ThirdRow({ user, historyCount, onToggleAvailability }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full">
      <div className="h-full w-full">
        <MyStatsCard user={user} historyCount={historyCount} />
      </div>

      <div className="h-full w-full">
        {/* Pass it into the Quick Actions Card */}
        <QuickActionsCard onToggleAvailability={onToggleAvailability} />
      </div>

      <div className="h-full w-full">
        <InterviewManagementCard user={user} />
      </div>
    </section>
  );
}

export default ThirdRow;
