import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

function ProfileCard({ user }) {
  // Use the uploaded picture, OR generate an avatar with their initials!
  const avatarSrc =
    user?.profilePicture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=2F7DFF&color=fff&rounded=true&size=256`;

  return (
    <div className="glass-card rounded-3xl p-8 h-full flex items-center gap-6">
      {/* Avatar Container */}
      <div className="relative shrink-0">
        <img
          src={avatarSrc}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-[3px] border-[#4F8CFF] shadow-[0_0_20px_rgba(79,140,255,0.3)] bg-[#0b1221]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=U&background=2F7DFF&color=fff&size=256`;
          }}
        />
        {/* Status Badge - NOW DYNAMIC! */}
        <div
          className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-[#0F172A] ${user?.isAvailable !== false ? "bg-green-500" : "bg-red-500"}`}
        />
      </div>

      {/* User Details */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {user?.name || "User"}
        </h2>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <FaCheckCircle className="text-[#4F8CFF] text-sm" />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="inline-flex px-4 py-1.5 rounded-full bg-violet-600/20 text-violet-300 text-xs font-semibold uppercase tracking-wider">
            {user?.role || "Interviewee"}
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <FaCalendarAlt />
            <span>Member since May 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;