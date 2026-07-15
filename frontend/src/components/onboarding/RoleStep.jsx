import { Link } from "react-router-dom";
import { useState } from "react";
import ProgressBar from "./ProgressBar";

const RoleStep = ({ formData, updateFormData, next, back }) => {
  const [showOtherInput, setShowOtherInput] = useState(false);

  const roles = [
    "Frontend Developer",
    "Backend Engineer",
    "Full Stack",
    "ML Engineer",
    "DevOps",
    "Mobile Dev",
    "Data Scientist",
    "Security Eng.",
    "Other"
  ];

  const handleRoleClick = (role) => {
    if (role === "Other") {
      setShowOtherInput(true);
      updateFormData("title", "");
    } else {
      setShowOtherInput(false);
      updateFormData("title", role);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="logo-icon w-10 h-10">{"</>"}</div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">DevTinder</h1>
      </div>

      <ProgressBar step={2} />

      <div className="w-full max-w-3xl card p-5 sm:p-8 mt-6 shadow-xl shadow-black/20">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          What do you do?
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mt-2">
          We'll find developers who complement your expertise.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleClick(role)}
              className={`rounded-xl px-4 py-3 text-sm sm:text-base border transition-all duration-200 ${
                (role === "Other" ? showOtherInput : formData.title === role && !showOtherInput)
                  ? "bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-500/10"
                  : "bg-surface-elevated border-border text-gray-300 hover:border-violet-500/50"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {showOtherInput && (
          <div className="mt-4">
            <label className="block text-gray-300 text-sm mb-1.5">Tell us your role</label>
            <input
              type="text"
              placeholder="e.g. Blockchain Developer"
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              className="input-field"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button onClick={back} className="btn-secondary flex-1 py-3">
            Back
          </button>
          <button onClick={next} className="btn-primary flex-1 py-3">
            Continue →
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-violet-400 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RoleStep;
