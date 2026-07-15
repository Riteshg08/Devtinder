import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-14">
      <div className="flex flex-col items-center text-center">
        <div className="px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium">
          The Developer Networking Platform
        </div>

        <h1 className="mt-6 sm:mt-8 text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight">
          Find Developers.
          <br />
          <span className="gradient-text">Build Together.</span>
        </h1>

        <p className="mt-6 sm:mt-8 text-gray-400 text-base sm:text-xl max-w-2xl leading-relaxed">
          Connect with talented developers, discover exciting projects,
          and build meaningful professional relationships.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/signup" className="btn-primary px-8 py-3.5 text-base">
            Get Started →
          </Link>
          <Link to="/login" className="btn-secondary px-8 py-3.5 text-base">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
