import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Search as SearchIcon, MapPin, UserPlus, Check } from "lucide-react";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [sentIds, setSentIds] = useState([]);

    // load existing sent requests once, so buttons are correct even on first visit
    const fetchSentRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/request/sent", {
                withCredentials: true
            });
            const sentRequests = res?.data?.data || [];
            // each request stores the other user under toUserId
            const ids = sentRequests.map((req) => req.toUserId._id);
            setSentIds(ids);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSentRequests();
    }, []);

    const runSearch = async () => {
        try {
            const res = await axios.get(
                BASE_URL + "/user/search?q=" + encodeURIComponent(searchQuery),
                { withCredentials: true }
            );
            setResults(res?.data?.data || []);
            setHasSearched(true);
        } catch (err) {
            console.error(err);
        }
    };

    const sendRequest = async (userId) => {
        try {
            await axios.post(
                BASE_URL + "/request/send/interested/" + userId,
                {},
                { withCredentials: true }
            );
            setSentIds([...sentIds, userId]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1020] text-white p-6 sm:p-10">
            <h1 className="text-3xl font-bold mb-6">Search Developers</h1>

            <div className="flex gap-3 mb-8 max-w-xl">
                <input
                    type="text"
                    placeholder="Search by username, role, or skill..."
                    className="input flex-1 bg-base-300 border-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                />
                <button
                    onClick={runSearch}
                    className="btn bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none"
                >
                    <SearchIcon size={18} />
                    Search
                </button>
            </div>

            {hasSearched && results.length === 0 && (
                <p className="opacity-60">No developers found matching that search.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((person) => {
                    const alreadySent = sentIds.includes(person._id);

                    return (
                        <div key={person._id} className="bg-base-300 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={person.photoUrl}
                                    alt="photo"
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="font-semibold">
                                        {person.firstName} {person.lastName}
                                    </h2>
                                    {person.title && (
                                        <p className="text-sm text-indigo-400">{person.title}</p>
                                    )}
                                    {person.location && (
                                        <p className="text-xs opacity-50 flex items-center gap-1">
                                            <MapPin size={12} />
                                            {person.location}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm opacity-70 line-clamp-2 mb-3">
                                {person.about}
                            </p>

                            {person.skills && person.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {person.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="badge bg-indigo-500/20 text-indigo-300 border-none text-xs"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => sendRequest(person._id)}
                                disabled={alreadySent}
                                className={
                                    "w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold " +
                                    (alreadySent
                                        ? "bg-base-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white")
                                }
                            >
                                {alreadySent ? (
                                    <>
                                        <Check size={16} />
                                        Request Sent
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={16} />
                                        Send Request
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Search;