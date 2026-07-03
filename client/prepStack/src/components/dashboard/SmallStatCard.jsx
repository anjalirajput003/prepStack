function SmallStatCard({ icon, value, label }) {
  return (
    <div className="flex items-center justify-center gap-4 h-full px-2 xl:px-6 hover:bg-white/5 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-[#2B66FF]/10 flex shrink-0 items-center justify-center text-[#4F8BFF] text-xl">
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="text-2xl font-bold text-white leading-none mb-1">
          {value}
        </h3>
        <p className="text-slate-400 text-xs xl:text-[13px] font-medium whitespace-nowrap">
          {label}
        </p>
      </div>
    </div>
  );
}

export default SmallStatCard;
