import { Users, MessageCircle, Network } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Smart Developer Matching",
    description:
      "Find developers based on skills, technologies and interests instead of random profiles.",
  },
  {
    icon: MessageCircle,
    title: "Real-time Chat",
    description:
      "Start chatting instantly once both developers connect with each other.",
  },
  {
    icon: Network,
    title: "Build Your Network",
    description:
      "Expand your professional network and collaborate on exciting projects.",
  },
];

const Features = () => {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="text-center">
        <p className="text-violet-400 font-semibold text-sm tracking-wider uppercase">
          Features
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
          Everything you need
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
          DevTinder helps developers discover teammates,
          mentors and collaborators with a modern matching experience.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 sm:mt-16">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="card p-6 sm:p-8 hover:border-violet-500/30 hover:bg-surface-elevated transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 mb-5 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-400 mt-3 text-sm leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
