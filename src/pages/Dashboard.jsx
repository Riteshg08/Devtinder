import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Users, UserPlus, Clock, TrendingUp, CheckCircle2, Circle, MessageCircle } from "lucide-react";

const Dashboard = () => {
    const user = useSelector((store) => store.user);
    const navigate = useNavigate();

    const [connectionsCount, setConnectionsCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [sentCount, setSentCount] = useState(0);
    const [recentConnections, setRecentConnections] = useState([]);

    const fetchStats = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", {
                withCredentials: true
            });
            const connections = res?.data?.data || [];
            setConnectionsCount(connections.length);
            // show the 3 most recently added connections
            setRecentConnections(connections.slice(-3).reverse());
        } catch (err) {
            console.error(err);
        }

        try {
            const res = await axios.get(BASE_URL + "/user/request/received", {
                withCredentials: true
            });
            setPendingCount(res?.data?.data?.length || 0);
        } catch (err) {
            console.error(err);
        }

        try {
            const res = await axios.get(BASE_URL + "/user/request/sent", {
                withCredentials: true
            });
            setSentCount(res?.data?.data?.length || 0);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // each item: label + whether it's actually filled in on the real user object
    const checklist = user ? [
        { label: "Basic Info", done: !!(user.firstName && user.lastName) },
        { label: "Profile Photo", done: !!user.photoUrl },
        { label: "Bio", done: !!user.bio },
        { label: "Skills", done: !!(user.skills && user.skills.length > 0) },
        { label: "Title & Company", done: !!(user.title && user.company) },
        { label: "Location", done: !!user.location },
        { label: "GitHub Link", done: !!user.githubUsername },
        { label: "Portfolio / LinkedIn", done: !!(user.portfolioUrl || user.linkedinUrl) },
    ] : [];

    const completedCount = checklist.filter((item) => item.done).length;
    const profileCompletion = checklist.length > 0
        ? Math.round((completedCount / checklist.length) * 100)
        : 0;

    return (
        <div className="bg-bg text-white page-container">

            {/* Header with completion CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="page-title">Welcome back, {user?.firstName}! 👋</h1>
                    <p className="page-subtitle">Here's what's happening with your network</p>
                </div>

                {profileCompletion < 100 && (
                    <button
                        onClick={() => navigate("/edit-profile")}
                        className="btn-primary shrink-0 self-start sm:self-auto"
                    >
                        Complete Profile — {profileCompletion}%
                    </button>
                )}
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <div className="card p-5 sm:p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
                        <Users className="text-indigo-400" size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{connectionsCount}</p>
                        <p className="text-sm text-gray-400">Connections</p>
                    </div>
                </div>

                <div className="card p-5 sm:p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
                        <UserPlus className="text-indigo-400" size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{pendingCount}</p>
                        <p className="text-sm text-gray-400">Pending Requests</p>
                    </div>
                </div>

                <div className="card p-5 sm:p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
                        <Clock className="text-indigo-400" size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{sentCount}</p>
                        <p className="text-sm text-gray-400">Sent Requests</p>
                    </div>
                </div>
            </div>

            {/* Bottom row: checklist + recent connections, side by side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Profile Completion checklist */}
                <div className="card p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-indigo-400" size={20} />
                        <h2 className="font-semibold">Profile Completion</h2>
                    </div>

                    <div className="flex flex-col gap-2.5 mb-4">
                        {checklist.map((item) => (
                            <div key={item.label} className="flex items-center gap-2.5">
                                {item.done ? (
                                    <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                                ) : (
                                    <Circle size={18} className="text-gray-600 shrink-0" />
                                )}
                                <span className={"text-sm " + (item.done ? "text-gray-300" : "text-gray-500")}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="w-full bg-surface-dark rounded-full h-2.5 mb-2 border border-border">
                        <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: profileCompletion + "%" }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-400">{profileCompletion}% complete</p>
                </div>

                {/* Recent Connections */}
                <div className="card p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Recent Connections</h2>
                        {connectionsCount > 0 && (
                            <button
                                onClick={() => navigate("/connections")}
                                className="text-xs text-indigo-400 hover:underline"
                            >
                                View all
                            </button>
                        )}
                    </div>

                    {recentConnections.length === 0 && (
                        <p className="text-sm text-gray-500">
                            No connections yet — start swiping on the feed!
                        </p>
                    )}

                    <div className="flex flex-col gap-3">
                        {recentConnections.map((conn) => (
                            <div key={conn._id} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={conn.photoUrl}
                                        alt="photo"
                                        className="w-10 h-10 rounded-full object-cover shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {conn.firstName + " " + conn.lastName}
                                        </p>
                                        {conn.skills && conn.skills.length > 0 && (
                                            <p className="text-xs text-gray-500 truncate">
                                                {conn.skills.slice(0, 2).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate("/messages", { state: { openChatWith: conn } })}
                                    className="flex items-center gap-1.5 text-xs font-medium bg-indigo-500/15 text-indigo-400 rounded-full px-3 py-1.5 hover:bg-indigo-500/25 transition shrink-0"
                                >
                                    <MessageCircle size={12} />
                                    Message
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
