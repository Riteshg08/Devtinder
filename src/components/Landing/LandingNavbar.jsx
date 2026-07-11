import { Link } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6">

      <div className="text-2xl font-bold">
        DevTinder
      </div>

      <ul className="hidden md:flex gap-10 text-gray-300">

        <li className="hover:text-white cursor-pointer">
          Home
        </li>

        <li className="hover:text-white cursor-pointer">
          Features
        </li>

        <li className="hover:text-white cursor-pointer">
          Bio
        </li>

      </ul>

      <div className="flex gap-4">

        <Link
          to="/login"
          className="px-5 py-2 rounded-xl border border-gray-700 hover:bg-white/10"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 duration-300"
        >
          Get Started
        </Link>

      </div>

    </nav>
  );
};

export default LandingNavbar;