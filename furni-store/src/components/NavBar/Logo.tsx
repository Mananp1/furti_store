import { Link } from "@tanstack/react-router";

export const Logo = () => (
  <Link
    to="/"
    className="flex items-center gap-2 font-bold text-xl text-primary"
  >
    {/* Simple SVG icon */}
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="28" height="28" rx="6" fill="#6366F1" />
      <path
        d="M8 20L20 8M8 8h12v12"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    FurniStore
  </Link>
);

export default Logo;
