import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
    const connection = useSelector(store => store.connections);
    console.log(connection);
    const dispatch = useDispatch();

    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connection", {
                withCredentials: true
            });
            console.log(res.data.data);
            dispatch(addConnection(res?.data?.data));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connection) return <h1>Loading...</h1>;
    if (connection.length === 0) return <h1>No Connections Found!</h1>;

    return (
        <div className="flex flex-col items-center my-10">
            <h1 className="text-2xl font-bold mb-4">Connections</h1>
            {connection.map((conn) => (
                <div
                    key={conn._id}
                    className="flex items-center gap-4 p-4 border rounded-2xl shadow-md hover:shadow-lg transition duration-300 bg-white w-5xl cursor-pointer my-3">
                    <div className="w-16 h-16 flex-shrink-0">
                        <img
                            alt="photo"
                            src={conn.photoUrl}
                            className="w-full h-full object-cover rounded-full border"
                        />
                    </div>
                    <div className="text-left">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {conn.firstName + " " + conn.lastName}
                        </h2>
                        <p className="text-md text-gray-700">
                             {conn.age} YO
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {conn.about}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Connections;