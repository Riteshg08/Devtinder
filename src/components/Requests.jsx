import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { UserPlus, Clock, MapPin } from "lucide-react";

// small helper to turn a date into "2h ago" style text
const timeAgo = (dateString) => {
    if (!dateString) return "";
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + "m ago";
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + "h ago";
    const days = Math.floor(hours / 24);
    return days + "d ago";
};

const Requests = () => {
    const requests = useSelector((state) => state.request);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("received");
    const [sentRequests, setSentRequests] = useState([]);

    const reviewRequest = async (status, _id) => {
        try {
            await axios.post(
                BASE_URL + "/request/review/" + status + "/" + _id,
                {},
                { withCredentials: true }
            );
            dispatch(removeRequest(_id));
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    const fetchRequest = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/request/received", {
                withCredentials: true
            });
            dispatch(addRequests(res?.data?.data));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSentRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/request/sent", {
                withCredentials: true
            });
            setSentRequests(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRequest();
        fetchSentRequests();
    }, []);

    const incomingCount = requests ? requests.length : 0;
    const outgoingCount = sentRequests.length;

    return (
        <div className="min-h-screen bg-[#0B1020] text-white p-10">
            <h1 className="text-3xl font-bold mb-6">Connection Requests</h1>

            {/* Tab switcher - two big pill buttons side by side */}
            <div className="flex gap-3 mb-8">
                <button
                    type="button"
                    onClick={() => setActiveTab("received")}
                    className={
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold " +
                        (activeTab === "received"
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                            : "bg-base-300 text-gray-300")
                    }
                >
                    <UserPlus size={18} />
                    Incoming ({incomingCount})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("sent")}
                    className={
                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold " +
                        (activeTab === "sent"
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                            : "bg-base-300 text-gray-300")
                    }
                >
                    <Clock size={18} />
                    Outgoing ({outgoingCount})
                </button>
            </div>

            {/* Incoming tab */}
            {activeTab === "received" && (
                <div className="flex flex-col gap-4">
                    {incomingCount === 0 && (
                        <p className="text-center opacity-60 mt-10">No Requests Found!</p>
                    )}

                    {requests && requests.map((req) => {
                        const user = req.fromUserId;

                        return (
                            <div key={req._id} className="bg-base-300 rounded-2xl p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            alt="photo"
                                            src={user.photoUrl}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                        <div>
                                            <h2 className="font-semibold">
                                                {user.firstName + " " + user.lastName}
                                            </h2>
                                            {user.title && (
                                                <p className="text-sm text-indigo-400">{user.title}</p>
                                            )}
                                            {user.location && (
                                                <p className="text-xs opacity-60 flex items-center gap-1 mt-1">
                                                    <MapPin size={12} />
                                                    {user.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-xs opacity-50">{timeAgo(req.createdAt)}</span>
                                </div>

                                {user.skills && user.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {user.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="badge bg-base-100 border-none text-indigo-300 text-xs"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        className="flex-1 py-2 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600"
                                        onClick={() => reviewRequest("accepted", req._id)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="flex-1 py-2 rounded-lg font-semibold bg-base-100 text-gray-300"
                                        onClick={() => reviewRequest("rejected", req._id)}
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Outgoing tab */}
            {activeTab === "sent" && (
                <div className="flex flex-col gap-4">
                    {outgoingCount === 0 && (
                        <p className="text-center opacity-60 mt-10">No Sent Requests Found!</p>
                    )}

                    {sentRequests.map((req) => {
                        const user = req.toUserId;

                        return (
                            <div key={req._id} className="bg-base-300 rounded-2xl p-5">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <img
                                            alt="photo"
                                            src={user.photoUrl}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                        <div>
                                            <h2 className="font-semibold">
                                                {user.firstName + " " + user.lastName}
                                            </h2>
                                            {user.title && (
                                                <p className="text-sm text-indigo-400">{user.title}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-xs opacity-60 italic">Pending</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Requests;