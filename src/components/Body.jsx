import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Menu } from "lucide-react";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const noSidebarRoutes = ["/", "/login", "/signup"];
    const showSidebar = !noSidebarRoutes.includes(location.pathname);

    const fetchUser = async () => {
        try {
            const res = await axios.get(BASE_URL + "/profile/view", {
                withCredentials: true
            });
            dispatch(addUser(res.data));
        }
        catch (err) {
            if (err.response && err.response.status === 401) {
                navigate("/login");
            }
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="h-screen flex bg-bg overflow-hidden">
            {showSidebar && (
                <>
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    <div className={`
                        fixed lg:static inset-y-0 left-0 z-50
                        transform transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    `}>
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </>
            )}

            <div className="flex-1 flex flex-col min-w-0 h-screen">
                {showSidebar && (
                    <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-bg/95 backdrop-blur-sm sticky top-0 z-30 shrink-0">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="btn-ghost p-2 -ml-1"
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="logo-icon w-8 h-8 text-xs">{"</>"}</div>
                            <span className="font-bold text-white text-sm">DevTinder</span>
                        </div>
                    </div>
                )}

                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Body;
