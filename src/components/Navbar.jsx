import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Navbar = () => {

    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await axios.post(BASE_URL + "/logout", {}, {
                withCredentials: true
            });
            dispatch(removeUser());
            return navigate("/login");
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">Devtinder</Link>
            </div>
            {user && <div className="flex items-center">
                <p>Welcome, {user.firstName}</p>
                <div className="dropdown dropdown-end mx-5">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src={user.photoUrl} />
                        </div>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <Link to="/profile" className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </Link>
                        </li>
                        <li><Link to="/user/connection">Connections</Link></li>
                        <li><Link to="/user/request/received">Requests</Link></li>
                        <li><a onClick={handleLogout}>Logout</a></li>
                    </ul>
                </div>
            </div>}
        </div>
    );
};

export default Navbar;