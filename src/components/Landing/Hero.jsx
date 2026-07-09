import { Link } from "react-router-dom";


const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-8 pt-24 pb-14">

      <div className="flex flex-col items-center text-center">

        <div className="px-6 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300">

          The Developer Networking Platform

        </div>


        <h1 className="mt-8 text-6xl md:text-8xl font-bold leading-tight">

          Find Developers.

          <br />

          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">

            Build Together.

          </span>

        </h1>

        <p className="mt-8 text-gray-400 text-xl max-w-3xl">

          Connect with talented developers, discover exciting projects,
          and build meaningful professional relationships.

        </p>


        <div className="mt-10 flex gap-6">

          <Link
            to="/signup"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 duration-300"
          >

            Get Started →

          </Link>

           <button className="px-8 py-4 rounded-2xl border border-gray-700 hover:bg-white/10">

            Explore Developers

          </button> 

        </div>

      </div>

    </section>
  );
};

export default Hero;