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

    const hasContactInfo = user.location || user.githubUsername || user.portfolioUrl || user.company;

    return (
        <div className="bg-bg text-white">

            <div className="h-32 sm:h-40 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 relative">
                <div className="absolute -bottom-10 sm:-bottom-12 left-4 sm:left-8 flex items-end gap-4">
                    <div className="relative">
                        <img
                            src={user.photoUrl}
                            alt="profile"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-bg"
                        />
                        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-bg"></span>
                    </div>
                </div>
            </div>

            <div className="page-container !pt-14 sm:!pt-16">
                <div className="max-w-3xl mx-auto">

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
                        <div className="min-w-0">
                            <h1 className="page-title truncate">{user.firstName} {user.lastName}</h1>
                            {(user.title || user.company) ? (
                                <p className="text-indigo-400 text-sm sm:text-base mt-1 truncate">
                                    {user.title}{user.title && user.company ? " @ " : ""}{user.company}
                                </p>
                            ) : (
                                <p className="text-gray-500 text-sm mt-1 italic">No title added yet</p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate("/edit-profile")}
                            className="btn-secondary text-sm shrink-0 self-start"
                        >
                            <Pencil size={14} />
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="stat-card">
                            <p className="text-xl sm:text-2xl font-bold">{connectionsCount}</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Connections</p>
                        </div>
                        <div className="stat-card">
                            <p className="text-xl sm:text-2xl font-bold">{pendingCount}</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Requests</p>
                        </div>
                        <div className="stat-card">
                            <p className="text-xl sm:text-2xl font-bold">{sentCount}</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Sent</p>
                        </div>
                    </div>

                    <div className="card p-5 sm:p-6 mb-6">
                        <h2 className="font-semibold mb-3">About</h2>

                        {user.about ? (
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">{user.about}</p>
                        ) : (
                            <p className="text-sm text-gray-500 italic mb-4">
                                You haven't added a bio yet.
                            </p>
                        )}

                        {hasContactInfo ? (
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
                                {user.location && (
                                    <span className="flex items-center gap-1.5 min-w-0">
                                        <MapPin size={14} className="text-indigo-400 shrink-0" />
                                        <span className="truncate">{user.location}</span>
                                    </span>
                                )}
                                {user.githubUsername && (
                                    <a
                                        href={`https://github.com/${user.githubUsername}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors min-w-0"
                                    >
                                        <Code2 size={14} className="text-indigo-400 shrink-0" />
                                        <span className="truncate">github.com/{user.githubUsername}</span>
                                    </a>
                                )}
                                {user.portfolioUrl && (
                                    <a
                                        href={user.portfolioUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors min-w-0"
                                    >
                                        <Globe size={14} className="text-indigo-400 shrink-0" />
                                        <span className="truncate">{user.portfolioUrl}</span>
                                    </a>
                                )}
                                {user.company && (
                                    <span className="flex items-center gap-1.5 min-w-0">
                                        <Briefcase size={14} className="text-indigo-400 shrink-0" />
                                        <span className="truncate">{user.company}</span>
                                    </span>
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 italic">
                                Add your location, GitHub, or company in Edit Profile.
                            </p>
                        )}
                    </div>

                    <div className="card p-5 sm:p-6 mb-6">
                        <h2 className="font-semibold mb-3">Skills</h2>

                        {user.skills && user.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill, index) => (
                                    <span key={index} className="badge-skill">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                No skills added yet.
                            </p>
                        )}
                    </div>

                    {user.githubUsername && (
                        <div className="card p-5 sm:p-6">
                            <h2 className="font-semibold mb-4 flex items-center gap-2">
                                <Code2 size={18} className="text-indigo-400" /> GitHub Contributions
                            </h2>

                            {!githubStats && (
                                <p className="text-sm text-gray-500">Loading stats...</p>
                            )}

                            {githubStats && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="bg-surface-dark rounded-xl p-4 text-center border border-border">
                                        <p className="text-xl font-bold">{githubStats.repos}</p>
                                        <p className="text-xs text-gray-500 mt-1">Repositories</p>
                                    </div>
                                    <div className="bg-surface-dark rounded-xl p-4 text-center border border-border">
                                        <p className="text-xl font-bold">{githubStats.stars}</p>
                                        <p className="text-xs text-gray-500 mt-1">Stars Earned</p>
                                    </div>
                                    <div className="bg-surface-dark rounded-xl p-4 text-center border border-border col-span-2 sm:col-span-1">
                                        <p className="text-xl font-bold">{githubStats.followers}</p>
                                        <p className="text-xs text-gray-500 mt-1">Followers</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;