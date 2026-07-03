import ProfileCard from "./ProfileCard";
import ProfileCompletionCard from "./ProfileCompletionCard";

function SecondRow({ user }) {
  return (
    <section className="grid grid-cols-12 gap-6 items-stretch">
      <div className="col-span-5 h-full">
        <ProfileCard user={user} />
      </div>

      <div className="col-span-7 h-full">
        <ProfileCompletionCard user={user} />
      </div>
    </section>
  );
}

export default SecondRow;
