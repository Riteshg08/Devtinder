import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="grow">
                <Outlet />
            </div>

            <Footer />
        </div>
    );
};

export default Body;