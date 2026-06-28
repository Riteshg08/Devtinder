import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeRequest } from "../utils/requestSlice";

const Requests = () => {
    const requests = useSelector((state) => state.request);
    const dispatch = useDispatch();

    const reviewRequest = async (status, _id) => {
        console.log("Button clicked with status:", status, "and request ID:", _id);
        try {
            const res = await axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, {
                withCredentials: true
            });
            dispatch(removeRequest(_id));
        }
        catch (err) {
            console.error(err.response?.data || err.message);
        }
    }

    const fetchRequest = async () => {
        try {
            const res = await axios.get(
                BASE_URL + "/user/request/received",
                { withCredentials: true }
            );
            dispatch(addRequests(res?.data?.data));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRequest();
    }, []);

    if (!requests) return <h1 className="text-center mt-10">Loading...</h1>;
    if (requests.length === 0)
        return <h1 className="text-center mt-10">No Requests Found!</h1>;

    return (
        <div className="flex flex-col items-center my-10">
            <h1 className="text-2xl font-bold mb-4">Requests</h1>

            {requests.map((req) => {
                const user = req.fromUserId;

                return (
                    <div
                        key={req._id}
                        className="flex items-center justify-between gap-4 p-4 border rounded-2xl shadow-md hover:shadow-lg transition duration-300 bg-white w-3xl cursor-pointer my-3"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 flex-shrink-0">
                                <img
                                    alt="photo"
                                    src={user.photoUrl}
                                    className="w-full h-full object-cover rounded-full border"
                                />
                            </div>

                            <div className="text-left">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {user.firstName + " " + user.lastName}
                                </h2>
                                <p className="text-md text-gray-700">
                                    {user.age} YO
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {user.about}
                                </p>
                            </div>
                        </div>

                        <div className="card-actions justify-between py-1">
                            <button className="btn bg-green-500 text-white border-none" onClick={() => reviewRequest("accepted", req._id)}>
                                Accept
                            </button>
                            <button className="btn bg-red-500 text-white border-none" onClick={() => reviewRequest("rejected", req._id)}>
                                Reject
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Requests;