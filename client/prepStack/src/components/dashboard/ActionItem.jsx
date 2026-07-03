import { FaChevronRight } from "react-icons/fa";

function ActionItem({
  icon,
  title,
  subtitle,
  color = "bg-white/5 text-slate-300",
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="glass-panel w-full rounded-2xl px-5 py-3.5 flex items-center justify-between hover:border-white/15 hover:bg-white/5 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-colors ${color} group-hover:text-white group-hover:bg-white/10`}
        >
          {icon}
        </div>

        <div className="text-left">
          <h3 className="font-semibold text-[15px] text-white/90">{title}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>

      <FaChevronRight className="text-slate-500 group-hover:text-white transition-colors text-sm" />
    </button>
  );
}

export default ActionItem;
