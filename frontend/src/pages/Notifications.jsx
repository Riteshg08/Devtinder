import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { UserPlus, Heart, Eye, MessageCircle, Bell } from "lucide-react";

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

const getIcon = (type) => {
    if (type === "request") return UserPlus;
    if (type === "match") return Heart;
    if (type === "profileView") return Eye;
    if (type === "message") return MessageCircle;
    return UserPlus;
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/notifications", {
                withCredentials: true
            });
            setNotifications(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await axios.patch(BASE_URL + "/user/notifications/markAllRead", {}, {
                withCredentials: true
            });
            setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="bg-bg text-white page-container">
            <div className="max-w-2xl mx-auto">

                <div className="flex justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="page-title">Notifications</h1>
                        <p className="page-subtitle">Stay updated on your network activity</p>
                    </div>
                    {notifications.length > 0 && (
                        <button
                            onClick={markAllRead}
                            className="btn-ghost text-sm text-indigo-400 shrink-0"
                        >
                            Mark all read
                        </button>
                    )}
                </div>

                {notifications.length === 0 && (
                    <div className="empty-state card">
                        <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-4">
                            <Bell size={24} className="text-indigo-400" />
                        </div>
                        <p className="text-gray-400 text-sm">No notifications yet!</p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {notifications.map((note) => {
                        const Icon = getIcon(note.type);
                        const user = note.fromUserId;

                        return (
                            <div
                                key={note._id}
                                className={
                                    "flex items-center gap-3 sm:gap-4 card p-4 transition-colors " +
                                    (!note.isRead ? "border-indigo-500/30 bg-surface-elevated" : "")
                                }
                            >
                                {user?.photoUrl ? (
                                    <img
                                        src={user.photoUrl}
                                        alt="photo"
                                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-border shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-surface-dark border border-border flex items-center justify-center shrink-0">
                                        <Icon size={18} className="text-indigo-400" />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm leading-relaxed">{note.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{timeAgo(note.createdAt)}</p>
                                </div>

                                {!note.isRead && (
                                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Notifications;