import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // pages where we do NOT want to show the sidebar
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

    return (
        <div className="min-h-screen flex bg-[#0B1020]">
            {showSidebar && (
                <div className="border-r border-gray-600">
                    <Sidebar />
                </div>
            )}

            <div className="grow">
                <Outlet />
            </div>
        </div>
    );
};

export default Body;