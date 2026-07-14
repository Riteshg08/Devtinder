import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-16 sm:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">DevTinder</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Find developers. Build together.
          </p>
        </div>

        <div className="flex gap-6 sm:gap-8">
          <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            Home
          </Link>
          <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
            Login
          </Link>
          <Link to="/signup" className="text-gray-400 hover:text-white text-sm transition-colors">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
