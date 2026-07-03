import { FaChartLine, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { calculateProfileCompletion } from "../../utils/profileCompletion";

function ProfileCompletionCard({ user }) {
  const completion = calculateProfileCompletion(user);

  return (
    <div className="glass-card rounded-3xl p-8 h-full flex flex-col justify-between w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <FaChartLine className="text-violet-400 text-xl" />
        </div>
        <h2 className="text-2xl font-semibold">Profile Completion</h2>
      </div>

      {/* Progress Bar Area */}
      <div className="flex items-center gap-6 mb-8">
        <div className="flex-1 h-4 rounded-full bg-[#1A233A] overflow-hidden relative shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2F7DFF] to-[#55A6FF] relative"
            style={{ width: `${completion}%` }}
          >
            
          </div>
        </div>
        <span className="text-3xl font-bold w-16 text-right">
          {completion}%
        </span>
      </div>

      {/* Checklist */}
      <div className="flex items-center justify-around text-sm">
        {["Basic Info", "Skills", "Experience", "Preferences"].map(
          (item, index) => {
            // Mocking completion status based on percentage for UI polish
            const isDone = completion >= (index + 1) * 25;
            return (
              <div key={item} className="flex items-center gap-2">
                {isDone ? (
                  <FaCheckCircle className="text-green-500 text-base" />
                ) : (
                  <FaRegCircle className="text-blue-500 text-base" />
                )}
                <span className={isDone ? "text-slate-300" : "text-slate-500"}>
                  {item}
                </span>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

export default ProfileCompletionCard;
