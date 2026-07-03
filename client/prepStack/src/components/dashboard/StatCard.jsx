function StatCard({ title, value, icon, color = "text-white" }) {
  return (
    <div
      className="
        glass-panel
        rounded-3xl
        p-6
        h-[150px]
        w-full
        flex
        flex-col
      "
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>

          <h2 className="text-3xl font-bold text-white mt-2">{value}</h2>
        </div>

        <div className={`${color} text-xl`}>{icon}</div>
      </div>
    </div>
  );
}

export default StatCard;
