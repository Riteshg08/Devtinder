import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { Eye, EyeOff } from "lucide-react";

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
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3 mb-6 hover:opacity-90 transition-opacity">
                <div className="logo-icon w-10 h-10">{"</>"}</div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">DevTinder</h1>
            </Link>

            <div className="w-full max-w-md card p-6 sm:p-8 shadow-xl shadow-black/20">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Welcome back
                </h2>
                <p className="text-violet-300 text-sm sm:text-base mt-1">
                    Sign in to continue building connections
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    <button className="btn-secondary py-2.5 text-sm">
                        GitHub
                    </button>
                    <a
                        href={BASE_URL + "/auth/google"}
                        className="btn-secondary py-2.5 text-sm text-center"
                    >
                        Google
                    </a>
                </div>

                <div className="flex items-center my-5">
                    <div className="flex-1 h-px bg-border" />
                    <span className="px-4 text-gray-500 text-xs sm:text-sm">
                        or continue with email
                    </span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-1.5">Email</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={emailId}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm mb-1.5">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field pr-11"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="text-right mt-2">
                    <Link to="/forgot-password" className="text-violet-400 text-sm hover:underline">
                        Forgot password?
                    </Link>
                </div>

                {error && (
                    <p className="error-box mt-3">{error}</p>
                )}

                <button onClick={handleLogin} className="btn-primary w-full mt-5 py-3">
                    Sign In
                </button>
            </div>

            <p className="text-gray-400 text-sm mt-6 text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-violet-400 hover:underline font-medium">
                    Create account
                </Link>
            </p>
        </div>
    );
};

export default Login;
