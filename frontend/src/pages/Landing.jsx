import LandingNavbar from "../components/Landing/LandingNavbar";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import Footer from "../components/Landing/Footer";

const Landing = () => {
  return (
    <div className="relative overflow-hidden bg-bg text-white w-full">
      <div className="absolute left-1/2 top-32 -translate-x-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute right-0 top-1/2 w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <LandingNavbar />
        <Hero />
        <Features />
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
