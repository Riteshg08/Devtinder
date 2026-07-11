import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
    const [emailId, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setError("");

            const res = await axios.post(
                BASE_URL + "/login",
                {
                    email: emailId,
                    password
                },
                {
                    withCredentials: true
                }
            );

            dispatch(addUser(res.data.user));
            navigate("/feed");
        } catch (err) {
            setError(err?.response?.data || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">

            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {"</>"}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                    DevTinder
                </h1>
            </div>

            {/* Card */}
            <div className="w-full max-w-md bg-[#1E293B] border border-gray-700 rounded-2xl p-5 sm:p-6 lg:p-8">

                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Welcome back
                </h2>
                <p className="text-violet-300 text-sm sm:text-base mt-1">
                    Sign in to continue building connections
                </p>

                {/* Social Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
                    <button className="border border-gray-600 rounded-xl py-2 sm:py-3 text-gray-300 hover:bg-white/5 transition">
                        GitHub
                    </button>
                    <a
                        href={BASE_URL + "/auth/google"}
                        className="border border-gray-600 rounded-xl py-2 sm:py-3 text-gray-300 hover:bg-white/5 transition text-center"
                    >
                        Google
                    </a>
                </div>

                {/* Divider */}
                <div className="flex items-center my-5">
                    <div className="flex-1 h-px bg-gray-700"></div>
                    <span className="px-4 text-gray-500 text-sm">
                        or continue with email
                    </span>
                    <div className="flex-1 h-px bg-gray-700"></div>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-gray-300 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={emailId}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-gray-300 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 pr-11 text-white outline-none focus:border-violet-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                        >
                            {/* simple eye icon, no icon library needed */}
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Forgot password */}
                <div className="text-right mt-2">
                    <Link to="/forgot-password" className="text-violet-400 text-sm hover:underline">
                        Forgot password?
                    </Link>
                </div>

                {error && (
                    <p className="text-red-400 text-sm mt-3">{error}</p>
                )}

                {/* Sign In button */}
                <button
                    onClick={handleLogin}
                    className="w-full mt-5 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 text-white font-semibold hover:scale-[1.02] transition"
                >
                    Sign In
                </button>
            </div>

            {/* Create account */}
            <p className="text-gray-400 text-sm sm:text-base mt-6 text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-violet-400 hover:underline">
                    Create account
                </Link>
            </p>
        </div >
    );
};

export default Login;