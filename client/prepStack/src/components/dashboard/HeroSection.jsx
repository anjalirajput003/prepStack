function HeroSection({ user, children }) {
  const hour = new Date().getHours();
  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <section className="grid grid-cols-12 gap-6 items-center w-full">
      {/* Reduced from col-span-5 to col-span-4 */}
      <div className="col-span-12 xl:col-span-4">
        <p className="text-slate-400 text-lg">{greeting},</p>
        <h1 className="text-4xl xl:text-5xl font-bold mt-1 tracking-tight">
          {user?.name} 👋
        </h1>
        <p className="text-slate-400 text-[15px] mt-2 leading-relaxed">
          Let's continue your interview preparation journey!
        </p>
      </div>

      <div className="col-span-12 xl:col-span-8 w-full flex justify-end">
        {children}
      </div>
    </section>
  );
}

export default HeroSection;
