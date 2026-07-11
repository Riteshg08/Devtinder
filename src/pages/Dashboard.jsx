import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Users, UserPlus, Clock, TrendingUp } from "lucide-react";

const Dashboard = () => {
    const user = useSelector((store) => store.user);

    const [connectionsCount, setConnectionsCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [sentCount, setSentCount] = useState(0);

    const fetchStats = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", {
                withCredentials: true
            });
            setConnectionsCount(res?.data?.data?.length || 0);
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

    // check how many profile fields are filled in, out of how many we care about
    const getProfileCompletion = () => {
        if (!user) return 0;

        const fieldsToCheck = [
            user.firstName, user.lastName, user.title, user.company,
            user.location, user.githubUsername, user.portfolioUrl,
            user.linkedinUrl, user.bio, user.photoUrl
        ];

        const filledCount = fieldsToCheck.filter((field) => field && field.trim().length > 0).length;
        const skillsFilled = user.skills && user.skills.length > 0 ? 1 : 0;

        const totalFields = fieldsToCheck.length + 1; // +1 for skills
        const totalFilled = filledCount + skillsFilled;

        return Math.round((totalFilled / totalFields) * 100);
    };

    const profileCompletion = getProfileCompletion();

    return (
        <div className="min-h-screen bg-[#0B1020] text-white p-10">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="opacity-60 mb-8">Welcome back, {user?.firstName}!</p>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-base-300 rounded-xl p-6 flex items-center gap-4">
                    <Users className="text-indigo-400" size={28} />
                    <div>
                        <p className="text-2xl font-bold">{connectionsCount}</p>
                        <p className="text-sm opacity-60">Connections</p>
                    </div>
                </div>

                <div className="bg-base-300 rounded-xl p-6 flex items-center gap-4">
                    <UserPlus className="text-indigo-400" size={28} />
                    <div>
                        <p className="text-2xl font-bold">{pendingCount}</p>
                        <p className="text-sm opacity-60">Pending Requests</p>
                    </div>
                </div>

                <div className="bg-base-300 rounded-xl p-6 flex items-center gap-4">
                    <Clock className="text-indigo-400" size={28} />
                    <div>
                        <p className="text-2xl font-bold">{sentCount}</p>
                        <p className="text-sm opacity-60">Sent Requests</p>
                    </div>
                </div>
            </div>

            {/* Profile completion bar */}
            <div className="bg-base-300 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="text-indigo-400" size={20} />
                    <h2 className="font-semibold">Profile Completion</h2>
                </div>

                <div className="w-full bg-base-100 rounded-full h-3 mb-2">
                    <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full"
                        style={{ width: profileCompletion + "%" }}
                    ></div>
                </div>

                <p className="text-sm opacity-60">{profileCompletion}% complete</p>

                {profileCompletion < 100 && (
                    <p className="text-sm text-indigo-400 mt-3">
                        Complete your profile to get better matches!
                    </p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;