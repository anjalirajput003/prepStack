function WelcomeCard({ user }) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div
      className="
glass-card
rounded-3xl
px-8
py-8
"
    >
      <p className="text-slate-400 text-lg">{greeting}</p>

      <h1 className="text-5xl font-bold mt-2 capitalize">{user?.name}</h1>

      <p className="text-slate-400 text-lg mt-3">
        Ready for your next mock interview?
      </p>
    </div>
  );
}

export default WelcomeCard;
