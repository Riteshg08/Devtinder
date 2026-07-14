import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import {
    Home, Search, Users, UserPlus, MessageCircle, Bell, TrendingUp, Settings, X
} from 'lucide-react';

function Sidebar({ onClose }) {
    const location = useLocation();
    const user = useSelector((store) => store.user);

    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);

    const fetchCounts = async () => {
        try {
            const notifRes = await axios.get(BASE_URL + "/user/notifications", {
                withCredentials: true
            });
            const notifications = notifRes?.data?.data || [];
            const unreadCount = notifications.filter((n) => !n.isRead).length;
            setUnreadNotifications(unreadCount);
        } catch (err) {
            console.error(err);
        }

        try {
            const reqRes = await axios.get(BASE_URL + "/user/request/received", {
                withCredentials: true
            });
            const requests = reqRes?.data?.data || [];
            setPendingRequests(requests.length);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCounts();
    }, []);

    const navLinks = [
        { name: "Feed", path: "/feed", icon: Home },
        { name: "Connections", path: "/connections", icon: Users },
        { name: "Requests", path: "/requests", icon: UserPlus, badge: pendingRequests },
        { name: "Messages", path: "/messages", icon: MessageCircle, badge: 3 },
        { name: "Notifications", path: "/notifications", icon: Bell, badge: unreadNotifications },
        { name: "Dashboard", path: "/dashboard", icon: TrendingUp },
    ];

    const isActive = (path) => {
        if (path === "/messages") {
            return location.pathname.startsWith("/messages");
        }
        return location.pathname === path;
    };

    return (
        <div className="bg-bg flex flex-col text-white w-[280px] h-screen border-r border-border shrink-0 ">

            <div className="flex items-center justify-between p-4 sm:p-5">
                <Link to="/feed" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <div className="logo-icon">{"</>"}</div>
                    <h1 className="text-lg font-bold text-white">DevTinder</h1>
                </Link>
                <button
                    onClick={onClose}
                    className="lg:hidden btn-ghost p-1.5"
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="h-px bg-border mx-4" />

            <nav className="flex flex-col p-3 gap-0.5 flex-1 overflow-y-auto">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.path);

                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={
                                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 " +
                                (active
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "text-gray-400 hover:bg-surface-elevated hover:text-white")
                            }
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={18} />
                                <span className="text-sm font-medium">{link.name}</span>
                            </div>

                            {link.badge > 0 && (
                                <span className="bg-indigo-500 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                                    {link.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-border">
                <Link
                    to="/settings"
                    className={
                        "flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-surface-elevated transition-colors " +
                        (location.pathname === "/settings" ? "text-white bg-surface-elevated" : "")
                    }
                >
                    <Settings size={18} />
                    <span className="text-sm font-medium">Settings</span>
                </Link>

                <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-4 hover:bg-surface-elevated transition-colors rounded"
                >
                    <img
                        src={user?.photoUrl}
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-border"
                    />
                    <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.title}</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;
