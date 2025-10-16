import { useLocation } from "react-router-dom";

export default function Link({ to, title }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <a
      href={to}
      className={`relative text-sm font-medium px-4 py-2 mr-4 transition-colors duration-300 
      ${isActive ? "text-sky-950" : "text-neutral-950 hover:text-sky-800"}`}
    >
      {title}
      <span
        className={`absolute left-0 -bottom-1 h-[2px] rounded-full bg-sky-950 transition-all duration-300 
        ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
      ></span>
    </a>
  );
}
