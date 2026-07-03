import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Logo({ collapsed = false }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-4">
      <div
        className="
  w-10
  h-10
  rounded-full
  bg-gradient-to-br
  from-[#3B82F6]
  to-[#2563EB]
  flex
  items-center
  justify-center
  shadow-[0_0_20px_rgba(59,130,246,.45)]
  shrink-0
"
      >
        <FaPlay className="text-white text-xs ml-[2px] " />
      </div>

      {!collapsed && (
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-[2rem] font-semibold tracking-tight text-white leading-none">
            Prep<span className="text-[#4F8CFF]">Stack</span>
          </h1>
        </div>
      )}
    </div>
  );
}

export default Logo;
