import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { MapPin, Briefcase, Globe, Pencil, Code2 } from "lucide-react";

const Profile = () => {
    const user = useSelector((store) => store.user);
    const navigate = useNavigate();

    const [connectionsCount, setConnectionsCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [sentCount, setSentCount] = useState(0);
    const [githubStats, setGithubStats] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
            setConnectionsCount(res?.data?.data?.length || 0);
        } catch (err) {
            console.error(err);
        }

        try {
            const res = await axios.get(BASE_URL + "/user/request/received", { withCredentials: true });
            setPendingCount(res?.data?.data?.length || 0);
        } catch (err) {
            console.error(err);
        }

        try {
            const res = await axios.get(BASE_URL + "/user/request/sent", { withCredentials: true });
            setSentCount(res?.data?.data?.length || 0);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchGithubStats = async () => {
        if (!user?.githubUsername) return;
        try {
            const res = await axios.get(
                BASE_URL + "/profile/github-stats/" + user.githubUsername,
                { withCredentials: true }
            );
            setGithubStats(res?.data?.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchGithubStats();
    }, [user?.githubUsername]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0B1020] text-white">

            {/* Banner */}
            <div className="h-40 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 relative">
                <div className="absolute -bottom-12 left-8 flex items-end gap-4">
                    <div className="relative">
                        <img
                            src={user.photoUrl}
                            alt="profile"
                            className="w-24 h-24 rounded-2xl object-cover border-4 border-[#0B1020]"
                        />
                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0B1020]"></span>
                    </div>
                </div>
            </div>

            <div className="pt-16 px-8 pb-10">
                {/* Name + edit button */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                        {(user.title || user.company) && (
                            <p className="text-indigo-400">
                                {user.title}{user.title && user.company ? " @ " : ""}{user.company}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => navigate("/edit-profile")}
                        className="flex items-center gap-2 bg-base-300 hover:bg-base-100 px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                        <Pencil size={14} />
                        Edit Profile
                    </button>
                </div>

                {/* Stat boxes */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-base-300 rounded-xl p-5 text-center">
                        <p className="text-2xl font-bold">{connectionsCount}</p>
                        <p className="text-sm opacity-60">Connections</p>
                    </div>
                    <div className="bg-base-300 rounded-xl p-5 text-center">
                        <p className="text-2xl font-bold">{pendingCount}</p>
                        <p className="text-sm opacity-60">Requests</p>
                    </div>
                    <div className="bg-base-300 rounded-xl p-5 text-center">
                        <p className="text-2xl font-bold">{sentCount}</p>
                        <p className="text-sm opacity-60">Sent</p>
                    </div>
                </div>

                {/* About */}
                <div className="bg-base-300 rounded-2xl p-6 mb-6">
                    <h2 className="font-semibold mb-3">About</h2>
                    <p className="text-sm opacity-70 mb-4">{user.about}</p>

                    <div className="flex flex-wrap gap-4 text-sm opacity-70">
                        {user.location && (
                            <span className="flex items-center gap-1">
                                <MapPin size={14} /> {user.location}
                            </span>
                        )}
                        {user.githubUsername && (
                            <a
                                href={`https://github.com/${user.githubUsername}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:text-indigo-400"
                            >
                                <Code2 size={14} /> github.com/{user.githubUsername}
                            </a>
                        )}
                        {user.portfolioUrl && (
                            <a
                                href={user.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:text-indigo-400"
                            >
                                <Globe size={14} /> {user.portfolioUrl}
                            </a>
                        )}
                        {user.company && (
                            <span className="flex items-center gap-1">
                                <Briefcase size={14} /> {user.company}
                            </span>
                        )}
                    </div>
                </div>

                {/* Skills */}
                {user.skills && user.skills.length > 0 && (
                    <div className="bg-base-300 rounded-2xl p-6 mb-6">
                        <h2 className="font-semibold mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="badge bg-indigo-500/20 text-indigo-300 border-none px-3 py-3"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* GitHub stats */}
                {user.githubUsername && (
                    <div className="bg-base-300 rounded-2xl p-6">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <Code2 size={18} /> GitHub Contributions
                        </h2>

                        {!githubStats && (
                            <p className="text-sm opacity-40">Loading stats...</p>
                        )}

                        {githubStats && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="bg-base-100 rounded-xl p-4 text-center">
                                    <p className="text-xl font-bold">{githubStats.repos}</p>
                                    <p className="text-xs opacity-50">Repositories</p>
                                </div>
                                <div className="bg-base-100 rounded-xl p-4 text-center">
                                    <p className="text-xl font-bold">{githubStats.stars}</p>
                                    <p className="text-xs opacity-50">Stars Earned</p>
                                </div>
                                <div className="bg-base-100 rounded-xl p-4 text-center">
                                    <p className="text-xl font-bold">{githubStats.followers}</p>
                                    <p className="text-xs opacity-50">Followers</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;