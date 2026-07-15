import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Search as SearchIcon, MapPin, UserPlus, Check, Users, Clock } from "lucide-react";

const timeAgo = (dateString) => {
    if (!dateString) return "";
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + "m ago";
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + "h ago";
    const days = Math.floor(hours / 24);
    return days + "d ago";
};

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [sentIds, setSentIds] = useState([]);
    const [recentHistory, setRecentHistory] = useState([]);
    const [loadingRecent, setLoadingRecent] = useState(true);

    const fetchSentRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/request/sent", {
                withCredentials: true
            });
            const sentRequests = res?.data?.data || [];
            setSentIds(sentRequests.map((req) => req.toUserId._id));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRecentHistory = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/search-history", {
                withCredentials: true
            });
            setRecentHistory(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingRecent(false);
        }
    };

    useEffect(() => {
        fetchSentRequests();
        fetchRecentHistory();
    }, []);

    const logSearchHistory = async (people) => {
        try {
            await axios.post(
                BASE_URL + "/user/search-history",
                { searchedUserIds: people.map((p) => p._id) },
                { withCredentials: true }
            );
        } catch (err) {
            console.error(err);
        }
    };

    const runSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            const res = await axios.get(
                BASE_URL + "/user/search?q=" + encodeURIComponent(searchQuery),
                { withCredentials: true }
            );
            const people = res?.data?.data || [];
            setResults(people);
            setHasSearched(true);

            if (people.length > 0) {
                logSearchHistory(people);
            }
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

    const PersonCard = ({ person, searchedAt }) => {
        const alreadySent = sentIds.includes(person._id);

        return (
            <div className="card p-4 sm:p-5 hover:border-violet-500/20 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <img
                            src={person.photoUrl}
                            alt="photo"
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-border shrink-0"
                        />
                        <div className="min-w-0">
                            <h2 className="font-semibold truncate">
                                {person.firstName} {person.lastName}
                            </h2>
                            {person.title && (
                                <p className="text-sm text-indigo-400 truncate">{person.title}</p>
                            )}
                            {person.location && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin size={12} />
                                    {person.location}
                                </p>
                            )}
                        </div>
                    </div>
                    {searchedAt && (
                        <span className="text-xs text-gray-500 shrink-0">{timeAgo(searchedAt)}</span>
                    )}
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                    {person.about}
                </p>

                {person.skills && person.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {person.skills.slice(0, 4).map((skill, index) => (
                            <span key={index} className="badge-skill">{skill}</span>
                        ))}
                    </div>
                )}

                <button
                    onClick={() => sendRequest(person._id)}
                    disabled={alreadySent}
                    className={
                        "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all " +
                        (alreadySent
                            ? "bg-surface-elevated text-gray-500 cursor-not-allowed border border-border"
                            : "btn-primary")
                    }
                >
                    {alreadySent ? (<><Check size={16} /> Request Sent</>) : (<><UserPlus size={16} /> Send Request</>)}
                </button>
            </div>
        );
    };

    const showingResults = hasSearched && results.length > 0;
    const showingNoResults = hasSearched && results.length === 0;
    const showingRecent = !hasSearched && !loadingRecent && recentHistory.length > 0;
    const showingEmptyState = !hasSearched && !loadingRecent && recentHistory.length === 0;

    return (
        <div className="min-h-screen bg-bg text-white page-container">
            <h1 className="page-title mb-2">Search Developers</h1>
            <p className="page-subtitle mb-6">Find developers by username, role, or skill</p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full sm:max-w-xl">
                <input
                    type="text"
                    placeholder="Search by username, role, or skill..."
                    className="input-field flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                />
                <button
                    onClick={runSearch}
                    className="btn-primary w-full sm:w-auto shrink-0"
                >
                    <SearchIcon size={18} />
                    Search
                </button>
            </div>

            {showingResults && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {results.map((person) => (
                        <PersonCard key={person._id} person={person} />
                    ))}
                </div>
            )}

            {showingNoResults && (
                <p className="text-gray-400 text-sm">No developers found matching that search.</p>
            )}

            {showingRecent && (
                <div>
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-4">
                        <Clock size={16} />
                        Recently Searched
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {recentHistory.map((entry) => (
                            <PersonCard key={entry.person._id} person={entry.person} searchedAt={entry.searchedAt} />
                        ))}
                    </div>
                </div>
            )}

            {showingEmptyState && (
                <div className="empty-state">
                    <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
                        <Users size={28} className="text-indigo-400" />
                    </div>
                    <h3 className="font-semibold mb-1">Find developers to connect with</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                        Search by username, role, or skill above to get started.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Search;
