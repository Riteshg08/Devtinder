import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { X, RotateCcw, Star, Heart, MapPin, Briefcase, Code2, Globe, Users } from "lucide-react";

import { BASE_URL } from "../utils/constants";
import { addUserToFeed, removeUserFromFeed, restoreUserToFeed } from "../utils/feedSlice";

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();

    const [lastSwiped, setLastSwiped] = useState(null);

    const getFeed = async () => {
        try {
            if (feed) return;

            const res = await axios.get(BASE_URL + "/feed", {
                withCredentials: true,
            });

            dispatch(addUserToFeed(res.data.users));
        } catch (err) {
            console.error(err);
        }
    };

    const [githubStats, setGithubStats] = useState(null);

    const fetchGithubStats = async (githubUsername) => {
        try {
            const res = await axios.get(
                BASE_URL + "/profile/github-stats/" + githubUsername,
                { withCredentials: true }
            );
            setGithubStats(res?.data?.data);
        } catch (err) {
            console.error(err);
            setGithubStats(null);
        }
    };

    const handleSwipe = async (direction, user) => {
        try {
            const status = direction === "right" ? "interested" : "ignored";

            await axios.post(
                `${BASE_URL}/request/send/${status}/${user._id}`,
                {},
                { withCredentials: true }
            );
            setLastSwiped({ user, status });
            dispatch(removeUserFromFeed(user._id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUndo = async () => {
        if (!lastSwiped) return;

        try {
            await axios.delete(
                BASE_URL + "/request/undo/" + lastSwiped.user._id,
                { withCredentials: true }
            );

            dispatch(restoreUserToFeed(lastSwiped.user));
            setLastSwiped(null); // only one level of undo allowed
        } catch (err) {
            console.error(err);
        }
    };

    const handleDragEnd = (event, info) => {
        if (!feed || feed.length === 0) return;

        const swipeThreshold = 120;

        if (info.offset.x > swipeThreshold) {
            handleSwipe("right", feed[0]);
        } else if (info.offset.x < -swipeThreshold) {
            handleSwipe("left", feed[0]);
        }
    };

    useEffect(() => {
        getFeed();
    }, []);

    useEffect(() => {
        const githubUsername = feed?.[0]?.githubUsername;
        if (githubUsername) {
            fetchGithubStats(githubUsername);
        } else {
            setGithubStats(null);
        }
    }, [feed?.[0]?._id]);

    if (!feed) {
        return (
            <div className="loading-page min-h-screen">
                <div className="spinner" />
                <p className="text-gray-400 text-sm">Loading developers...</p>
            </div>
        );
    }

    if (feed.length === 0) {
        return (
            <div className="min-h-screen bg-bg empty-state">
                <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-4">
                    <Users size={28} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No developers found</h3>
                <p className="text-gray-400 text-sm max-w-sm">Check back later for new profiles to discover.</p>
            </div>
        );
    }

    const currentUser = feed[0];

    return (
        <div className="w-full min-h-screen bg-bg text-white page-container">
            <h1 className="page-title mb-6 sm:mb-8">Discover Developers</h1>

            <div className="flex flex-col lg:flex-row justify-center items-start gap-8">

                <div className="flex flex-col items-center w-full max-w-sm mx-auto">
                    <motion.div
                        key={currentUser._id}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        whileTap={{ scale: 1.02 }}
                        whileDrag={{ rotate: 12 }}
                        onDragEnd={handleDragEnd}
                        className="w-full max-w-xs sm:max-w-sm card overflow-hidden cursor-grab active:cursor-grabbing shadow-xl shadow-black/20"
                    >
                        <div className="relative h-56 sm:h-64">
                            <img
                                src={currentUser.photoUrl}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                            <span className="absolute top-3 right-3 bg-green-500/90 text-xs font-semibold px-3 py-1 rounded-full">
                                Available
                            </span>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start gap-2">
                                <h2 className="text-lg font-bold">
                                    {currentUser.firstName} {currentUser.lastName}
                                    {currentUser.age && <span className="font-normal text-gray-400">, {currentUser.age}</span>}
                                </h2>
                                {currentUser.location && (
                                    <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
                                        <MapPin size={12} />
                                        {currentUser.location}
                                    </span>
                                )}
                            </div>

                            {currentUser.title && (
                                <p className="text-sm text-indigo-400 mt-0.5">{currentUser.title}</p>
                            )}

                            <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                                {currentUser.about}
                            </p>

                            {currentUser.skills && currentUser.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {currentUser.skills.map((skill, index) => (
                                        <span key={index} className="badge-skill">{skill}</span>
                                    ))}
                                </div>
                            )}

                            {currentUser.company && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                                    <Briefcase size={12} />
                                    {currentUser.company}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <div className="flex gap-3 sm:gap-4 mt-6">
                        <button
                            onClick={() => handleSwipe("left", currentUser)}
                            className="btn-icon w-12 h-12 sm:w-14 sm:h-14 card-elevated border-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                            <X size={22} />
                        </button>
                        <button
                            onClick={handleUndo}
                            disabled={!lastSwiped}
                            className={
                                "btn-icon w-11 h-11 sm:w-14 sm:h-14 card-elevated border-2 " +
                                (lastSwiped
                                    ? "border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
                                    : "border-border text-gray-600 cursor-not-allowed opacity-40")
                            }
                            title={lastSwiped ? "Undo last swipe" : "Nothing to undo"}
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            onClick={() => handleSwipe("right", currentUser)}
                            className="btn-icon w-12 h-12 sm:w-14 sm:h-14 card-elevated border-2 border-green-500/50 text-green-400 hover:bg-green-500/10"
                        >
                            <Heart size={22} />
                        </button>
                    </div>
                </div>

                <div className="hidden lg:flex flex-col gap-4 w-72">

                    <div className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={currentUser.photoUrl} alt="profile" className="w-10 h-10 rounded-full object-cover border border-border" />
                            <div>
                                <h3 className="font-semibold text-sm">{currentUser.firstName} {currentUser.lastName}</h3>
                                {currentUser.title && <p className="text-xs text-indigo-400">{currentUser.title}</p>}
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">{currentUser.about}</p>
                    </div>

                    {currentUser.githubUsername && (
                        <div className="card p-5">
                            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                                <Code2 size={16} /> GitHub Stats
                            </h3>

                            {!githubStats && (
                                <p className="text-xs text-gray-500">Loading stats...</p>
                            )}

                            {githubStats && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-surface-dark rounded-xl p-3 text-center border border-border">
                                        <p className="text-xl font-bold">{githubStats.repos}</p>
                                        <p className="text-xs text-gray-500">Repos</p>
                                    </div>
                                    <div className="bg-surface-dark rounded-xl p-3 text-center border border-border">
                                        <p className="text-xl font-bold">{githubStats.stars}</p>
                                        <p className="text-xs text-gray-500">Stars</p>
                                    </div>
                                    <div className="bg-surface-dark rounded-xl p-3 text-center col-span-2 border border-border">
                                        <p className="text-xl font-bold">{githubStats.followers}</p>
                                        <p className="text-xs text-gray-500">Followers</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {(currentUser.githubUsername || currentUser.portfolioUrl || currentUser.linkedinUrl) && (
                        <div className="card p-5">
                            <h3 className="font-semibold mb-3 text-sm">Links</h3>
                            <div className="flex flex-col gap-2 text-sm">
                                {currentUser.githubUsername && (
                                    <a href={`https://github.com/${currentUser.githubUsername}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-400 hover:underline">
                                        <Code2 size={14} /> github.com/{currentUser.githubUsername}
                                    </a>
                                )}
                                {currentUser.portfolioUrl && (
                                    <a href={currentUser.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-400 hover:underline truncate">
                                        <Globe size={14} /> {currentUser.portfolioUrl}
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Feed;
