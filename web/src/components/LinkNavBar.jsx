import { useLocation } from "react-router-dom";
export default function LinkNavBar({ to, title }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <a
      href={to}
      className={`relative text-md font-medium px-4 py-2 mr-4 transition-colors duration-300 
      ${isActive ? "text-[#5BBAD0]" : "text-white hover:text-[#5BBAD0]"}`}
    >
      {title}
      <span
        className={`absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-300 
       ${isActive ? "bg-[#5BBAD0] w-full" : "bg-transparent w-0 group-hover:bg-[#5BBAD0] group-hover:w-full"}`}
      ></span>
    </a>
  );
}