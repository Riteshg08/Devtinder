import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Home, Search, Users, UserPlus, MessageCircle, Bell, TrendingUp, Settings
} from 'lucide-react';

function Sidebar() {
    const location = useLocation();
    const user = useSelector((store) => store.user);

    // list of nav links - easy to add more later, just add an object here
    const navLinks = [
        { name: "Feed", path: "/feed", icon: Home },
        { name: "Search", path: "/search", icon: Search },
        { name: "Connections", path: "/connections", icon: Users },
        { name: "Requests", path: "/requests", icon: UserPlus },
        { name: "Messages", path: "/messages", icon: MessageCircle},
        { name: "Notifications", path: "/notifications", icon: Bell },
        { name: "Dashboard", path: "/dashboard", icon: TrendingUp },
    ];

    return (
        <div className="bg-[#0B1020] flex flex-col text-white w-[280px] h-screen">

            {/* Logo */}
            <div className="flex items-center gap-3 m-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {"</>"}
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                    DevTinder
                </h1>
            </div>

            <hr className="text-gray-600" />

            {/* Nav links */}
            <div className="flex flex-col p-5 gap-1">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;

                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={
                                "flex items-center justify-between px-3 py-2 rounded-lg mb-1 " +
                                (isActive ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-800")
                            }
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={18} />
                                <span>{link.name}</span>
                            </div>

                            {link.badge && (
                                <span className="bg-indigo-500 text-xs rounded-full px-2 py-0.5">
                                    {link.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* pushes settings/user section to the bottom */}
            <div className="mt-auto">
                <hr className="text-gray-600" />

                <Link to="/settings" className="flex items-center gap-3 px-5 py-4 text-gray-300 hover:text-white">
                    <Settings size={18} />
                    <span>Settings</span>
                </Link>

                <div className="flex items-center gap-3 px-5 pb-5">
                    <img
                        src={user?.photoUrl}
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-400">{user?.title}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;