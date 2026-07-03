import { FaExchangeAlt } from "react-icons/fa";

function SwitchRoleBanner({ handleRoleSwitch, currentRole }) {
  return (
    <div className="glass-card rounded-3xl p-6 xl:p-8 w-full flex flex-col md:flex-row items-center justify-between gap-6 h-20">
      {/* Left Side: Icon & Text */}
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 shrink-0 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300">
          <FaExchangeAlt className="text-xl" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            Switch Your Role
          </h2>
          <p className="text-slate-400 text-[14px]">
            Easily switch between Interviewee and Interviewer based on what you
            want to do.
          </p>
        </div>
      </div>

      {/* Right Side: Action Button */}
      <button
        onClick={handleRoleSwitch}
        className="
          shrink-0
          bg-gradient-to-r from-[#2F7DFF] to-[#1A62DA] 
          hover:from-[#4C8EFF] hover:to-[#2F7DFF] 
          transition-all duration-300 
          text-white 
          px-8 py-3.5 
          rounded-3xl 
          font-semibold 
          h-10
          w-35
          justify-center
          flex items-center gap-3
          shadow-[0_0_20px_rgba(47,125,255,0.3)]
        "
      >
        <FaExchangeAlt className="text-sm" />
        Switch Role
      </button>
    </div>
  );
}

export default SwitchRoleBanner;
