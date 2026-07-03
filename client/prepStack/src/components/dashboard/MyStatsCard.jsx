import { FaVideo, FaStar, FaCircle } from "react-icons/fa";

function MyStatsCard({ user, historyCount }) {
  return (
    <div
      className="
      glass-card
      rounded-3xl
      p-6
      h-full
      "
    >
      <h2 className="text-2xl font-semibold mb-6">My Stats</h2>

      <div className="space-y-5">
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center">
              <FaVideo className="text-violet-400" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Completed Interviews</p>

              <h3 className="text-4xl font-bold">{historyCount}</h3>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
              <FaStar className="text-yellow-400" />
            </div>

            <div>
              <p className="text-slate-400 text-sm">Average Rating</p>

              <h3 className="text-4xl font-bold">
                {user?.rating?.toFixed(1) || "0.0"}
              </h3>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-slate-400">Availability</p>

            {/* Make the colors dynamic based on user.isAvailable */}
            <div className="flex items-center gap-2 mt-2">
              <FaCircle
                className={`text-xs ${user?.isAvailable ? "text-green-500" : "text-red-500"}`}
              />
              <span
                className={
                  user?.isAvailable ? "text-green-400" : "text-red-400"
                }
              >
                {user?.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyStatsCard;
