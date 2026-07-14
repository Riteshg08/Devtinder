import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { UserPlus, Clock, MapPin, X } from "lucide-react";

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

    const cancelRequest = async (targetUserId) => {
        try {
            await axios.delete(BASE_URL + "/request/cancel/" + targetUserId, {
                withCredentials: true
            });
            setSentRequests(sentRequests.filter((req) => req.toUserId._id !== targetUserId));
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
        <div className="bg-bg text-white page-container">
            <div className="max-w-2xl mx-auto">
                <h1 className="page-title mb-2">Connection Requests</h1>
                <p className="page-subtitle mb-6">Manage incoming and outgoing requests</p>

                <div className="flex gap-2 sm:gap-3 mb-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab("received")}
                        className={"tab-btn flex-1 text-xs sm:text-sm px-2 sm:px-4 " + (activeTab === "received" ? "tab-btn-active" : "tab-btn-inactive")}
                    >
                        <UserPlus size={16} className="shrink-0" />
                        <span className="truncate">Incoming ({incomingCount})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("sent")}
                        className={"tab-btn flex-1 text-xs sm:text-sm px-2 sm:px-4 " + (activeTab === "sent" ? "tab-btn-active" : "tab-btn-inactive")}
                    >
                        <Clock size={16} className="shrink-0" />
                        <span className="truncate">Outgoing ({outgoingCount})</span>
                    </button>
                </div>

                {activeTab === "received" && (
                    <div className="flex flex-col gap-4">
                        {incomingCount === 0 && (
                            <div className="flex flex-col items-center text-center py-12 sm:py-16 px-4">
                                <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-4">
                                    <UserPlus size={24} className="text-indigo-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-1">No incoming requests</h3>
                                <p className="text-gray-400 text-sm max-w-xs">
                                    When someone sends you a connection request, it'll show up here.
                                </p>
                            </div>
                        )}

                        {requests && requests.map((req) => {
                            const user = req.fromUserId;

                            return (
                                <div key={req._id} className="card p-4 sm:p-5">
                                    <div className="flex justify-between items-start mb-3 gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                alt="photo"
                                                src={user.photoUrl}
                                                className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border border-border shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <h2 className="font-semibold text-sm sm:text-base truncate">
                                                    {user.firstName + " " + user.lastName}
                                                </h2>
                                                {user.title && (
                                                    <p className="text-xs sm:text-sm text-indigo-400 truncate">{user.title}</p>
                                                )}
                                                {user.location && (
                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                        <MapPin size={12} className="shrink-0" />
                                                        <span className="truncate">{user.location}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 shrink-0">{timeAgo(req.createdAt)}</span>
                                    </div>

                                    {user.skills && user.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {user.skills.map((skill, index) => (
                                                <span key={index} className="badge-skill">{skill}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            className="btn-primary flex-1 py-2.5"
                                            onClick={() => reviewRequest("accepted", req._id)}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="btn-secondary flex-1 py-2.5"
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

                {activeTab === "sent" && (
                    <div className="flex flex-col gap-4">
                        {outgoingCount === 0 && (
                            <div className="flex flex-col items-center text-center py-12 sm:py-16 px-4">
                                <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-4">
                                    <Clock size={24} className="text-indigo-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-1">No pending requests</h3>
                                <p className="text-gray-400 text-sm max-w-xs">
                                    Requests you send from Feed or Search will appear here until they're accepted.
                                </p>
                            </div>
                        )}

                        {sentRequests.map((req) => {
                            const user = req.toUserId;

                            return (
                                <div key={req._id} className="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            alt="photo"
                                            src={user.photoUrl}
                                            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border border-border shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <h2 className="font-semibold text-sm sm:text-base truncate">
                                                {user.firstName + " " + user.lastName}
                                            </h2>
                                            {user.title && (
                                                <p className="text-xs sm:text-sm text-indigo-400 truncate">{user.title}</p>
                                            )}
                                            <p className="text-xs text-amber-400/80 flex items-center gap-1.5 mt-1">
                                                <Clock size={12} className="shrink-0" />
                                                <span className="truncate">Pending · Sent {timeAgo(req.createdAt)}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => cancelRequest(user._id)}
                                        className="flex items-center justify-center gap-1.5 text-sm font-medium text-red-400 border border-red-500/30 rounded-full px-4 py-2 hover:bg-red-500/10 transition shrink-0 w-full sm:w-auto"
                                    >
                                        <X size={14} />
                                        Cancel
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requests;
