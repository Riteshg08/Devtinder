import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addConnection } from "../utils/connectionSlice";
import { MessageCircle, Search, UserMinus, Users, AlertTriangle } from "lucide-react";

const Connections = () => {
    const connection = useSelector(store => store.connections);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState("");
    const [confirmTarget, setConfirmTarget] = useState(null); // { id, name } or null

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

    // opens the confirmation modal instead of removing right away
    const askRemoveConnection = (targetUserId, name) => {
        setConfirmTarget({ id: targetUserId, name });
    };

    // runs only after the user actually confirms in the modal
    const confirmRemoveConnection = async () => {
        if (!confirmTarget) return;

        try {
            await axios.delete(BASE_URL + "/user/connections/" + confirmTarget.id, {
                withCredentials: true
            });
            dispatch(addConnection(connection.filter((conn) => conn._id !== confirmTarget.id)));
        } catch (err) {
            console.error(err);
        } finally {
            setConfirmTarget(null);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connection) {
        return (
            <div className="loading-page min-h-screen">
                <div className="spinner" />
                <p className="text-gray-400 text-sm">Loading connections...</p>
            </div>
        );
    }

    if (connection.length === 0) {
        return (
            <div className="bg-bg page-container">
                <h1 className="page-title">Connections</h1>
                <p className="page-subtitle mb-8">0 connections</p>
                <div className="empty-state card">
                    <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-4">
                        <Users size={24} className="text-indigo-400" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">No connections yet</h3>
                    <p className="text-gray-400 text-sm">Start swiping on the feed to build your network.</p>
                </div>
            </div>
        );
    }

    const filteredConnections = connection.filter((conn) => {
        const query = searchText.toLowerCase();
        const fullName = (conn.firstName + " " + conn.lastName).toLowerCase();
        const title = (conn.title || "").toLowerCase();
        const company = (conn.company || "").toLowerCase();
        const skills = (conn.skills || []).join(" ").toLowerCase();

        return (
            fullName.includes(query) ||
            title.includes(query) ||
            company.includes(query) ||
            skills.includes(query)
        );
    });

    return (
        <div className="bg-bg text-white page-container">
            <h1 className="page-title">Connections</h1>
            <p className="page-subtitle mb-6">{connection.length} connections</p>

            <div className="search-with-icon mb-6 max-w">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                />
                <input
                    type="text"
                    placeholder="Search connections..."
                    className="input-field"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            {filteredConnections.length === 0 && (
                <p className="text-gray-400 text-sm">No connections match your search.</p>
            )}

            <div className="flex flex-col gap-3">
                {filteredConnections.map((conn) => (
                    <div key={conn._id} className="list-row">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <img
                                alt="photo"
                                src={conn.photoUrl}
                                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-border shrink-0"
                            />

                            <div className="min-w-0">
                                <h2 className="font-semibold text-sm sm:text-base truncate">
                                    {conn.firstName + " " + conn.lastName}
                                </h2>

                                {(conn.title || conn.company) && (
                                    <p className="text-sm text-indigo-400 truncate">
                                        {conn.title}{conn.title && conn.company ? " @ " : ""}{conn.company}
                                    </p>
                                )}

                                {conn.skills && conn.skills.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1 truncate hidden sm:block">
                                        {conn.skills.join(" · ")}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => navigate("/messages", { state: { openChatWith: conn } })}
                                className="btn-icon w-10 h-10 bg-indigo-600 text-white hover:opacity-90"
                                title="Message"
                            >
                                <MessageCircle size={16} />
                            </button>
                            <button
                                onClick={() => askRemoveConnection(conn._id, conn.firstName + " " + conn.lastName)}
                                className="btn-icon w-10 h-10 card-elevated text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-border"
                                title="Remove connection"
                            >
                                <UserMinus size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Centered confirmation modal - only shows when confirmTarget is set */}
            {confirmTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* dark overlay behind the modal */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setConfirmTarget(null)}
                    ></div>

                    <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                            <AlertTriangle size={22} className="text-red-400" />
                        </div>

                        <h3 className="font-semibold text-lg mb-2">Remove connection?</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Remove <span className="text-white font-medium">{confirmTarget.name}</span> from your connections? This can't be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmTarget(null)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRemoveConnection}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Connections;