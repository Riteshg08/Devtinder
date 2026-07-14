import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { BASE_URL } from "../../utils/constants";

const AccountStep = ({ formData, updateFormData, next }) => {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="logo-icon w-10 h-10">{"</>"}</div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">DevTinder</h1>
      </div>

      <ProgressBar step={1} />

      <div className="w-full max-w-lg card p-5 sm:p-7 mt-3 shadow-xl shadow-black/20">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          Create your account
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <button className="btn-secondary py-2.5 text-sm">GitHub</button>
          <a
            href={BASE_URL + "/auth/google"}
            className="btn-secondary py-2.5 text-sm text-center"
          >
            Google
          </a>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="px-4 text-gray-500 text-sm">or with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-300 text-sm mb-1.5">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
              placeholder="Jordan"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1.5">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
              placeholder="Lee"
              className="input-field"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-gray-300 text-sm mb-1.5">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="you@example.com"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1.5">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            placeholder="********"
            className="input-field"
          />
        </div>

        <button onClick={next} className="btn-primary w-full mt-5 py-3">
          Continue →
        </button>
      </div>

      <p className="text-gray-400 text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-violet-400 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default AccountStep;
