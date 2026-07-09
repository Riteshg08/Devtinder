import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { MessageCircle, MoreHorizontal, Search } from "lucide-react";

const Connections = () => {
    const connection = useSelector(store => store.connections);
    const dispatch = useDispatch();

    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", {
                withCredentials: true
            });
            dispatch(addConnection(res?.data?.data));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connection) return <h1 className="text-white p-10">Loading...</h1>;
    if (connection.length === 0) return <h1 className="text-white p-10">No Connections Found!</h1>;

    return (
        <div className="min-h-screen  p-10 text-white">
            {/* Header */}
            <h1 className="text-3xl font-bold">Connections</h1>
            <p className="opacity-60 mb-6">{connection.length} connections</p>

            {/* Search box - UI only for now */}
            <div className="relative mb-6">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 "
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Search connections..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-2xl py-2 pl-12 pr-4 text-white placeholder-gray-400"
                />
            </div>

            {/* List of connections */}
            <div className="flex flex-col gap-3 rounded-xl">
                {connection.map((conn) => (
                    <div
                        key={conn._id}
                        className="bg-gray-800 flex items-center justify-between bg-base-300 rounded-xl px-5 py-3"
                    >
                        {/* left side: photo + info */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    alt="photo"
                                    src={conn.photoUrl}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                {/* small green online dot */}
                                {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-300"></span> */}
                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    {conn.firstName + " " + conn.lastName}
                                </h2>

                                {(conn.title || conn.company) && (
                                    <p className="text-sm text-indigo-400">
                                        {conn.title}{conn.title && conn.company ? " @ " : ""}{conn.company}
                                    </p>
                                )}

                                {conn.skills && conn.skills.length > 0 && (
                                    <p className="text-xs opacity-50 mt-1">
                                        {conn.skills.join("  ·  ")}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* right side: action buttons */}
                        <div className="flex items-center gap-2">
                            <button className="btn btn-circle btn-sm border-none">
                                <MessageCircle size={16} />
                            </button>
                            <button className="btn btn-circle btn-sm bg-base-100 border-none">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Connections;