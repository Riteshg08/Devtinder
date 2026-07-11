import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { X, RotateCcw, Star, Heart, MapPin, Briefcase, Code2, Globe } from "lucide-react";

import { BASE_URL } from "../utils/constants";
import { addUserToFeed, removeUserFromFeed } from "../utils/feedSlice";

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();

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

            dispatch(removeUserFromFeed(user._id));
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
        return <h1 className="text-center my-10 text-xl text-white">Loading...</h1>;
    }

    if (feed.length === 0) {
        return <h1 className="text-center my-10 text-xl text-white">No Users Found</h1>;
    }

    const currentUser = feed[0];

    return (
        <div className="min-h-screen bg-[#0B1020] text-white p-6 sm:p-10">
            <h1 className="text-2xl font-bold mb-8">Discover Developers</h1>

            <div className="flex flex-col lg:flex-row justify-center gap-8">

                {/* Swipeable card + action buttons */}
                <div className="flex flex-col items-center">
                    <motion.div
                        key={currentUser._id}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        whileTap={{ scale: 1.02 }}
                        whileDrag={{ rotate: 12 }}
                        onDragEnd={handleDragEnd}
                        className="w-80 bg-base-300 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                    >
                        {/* Photo with badges overlaid */}
                        <div className="relative h-64">
                            <img
                                src={currentUser.photoUrl}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                            <span className="absolute top-3 right-3 bg-green-500 text-xs font-semibold px-3 py-1 rounded-full">
                                Available
                            </span>
                        </div>

                        {/* Card details */}
                        <div className="p-5">
                            <div className="flex justify-between items-start">
                                <h2 className="text-lg font-bold">
                                    {currentUser.firstName} {currentUser.lastName}
                                    {currentUser.age && <span className="font-normal">, {currentUser.age}</span>}
                                </h2>
                                {currentUser.location && (
                                    <span className="text-xs opacity-50 flex items-center gap-1">
                                        <MapPin size={12} />
                                        {currentUser.location}
                                    </span>
                                )}
                            </div>

                            {currentUser.title && (
                                <p className="text-sm text-indigo-400">{currentUser.title}</p>
                            )}

                            <p className="text-sm opacity-70 mt-2 line-clamp-2">
                                {currentUser.about}
                            </p>

                            {currentUser.skills && currentUser.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {currentUser.skills.map((skill, index) => (
                                        <span key={index} className="badge bg-indigo-500/20 text-indigo-300 border-none text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {currentUser.company && (
                                <div className="flex items-center gap-1 text-xs opacity-50 mt-3">
                                    <Briefcase size={12} />
                                    {currentUser.company}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Action buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => handleSwipe("left", currentUser)}
                            className="w-14 h-14 rounded-full bg-base-300 border-2 border-red-500 text-red-500 flex items-center justify-center hover:bg-red-500/10"
                        >
                            <X size={24} />
                        </button>
                        <button
                            onClick={getFeed}
                            className="w-12 h-12 rounded-full bg-base-300 text-gray-400 flex items-center justify-center hover:bg-base-100"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            className="w-12 h-12 rounded-full bg-base-300 text-indigo-400 flex items-center justify-center hover:bg-base-100"
                        >
                            <Star size={18} />
                        </button>
                        <button
                            onClick={() => handleSwipe("right", currentUser)}
                            className="w-14 h-14 rounded-full bg-base-300 border-2 border-green-500 text-green-500 flex items-center justify-center hover:bg-green-500/10"
                        >
                            <Heart size={24} />
                        </button>
                    </div>
                </div>

                {/* Side details panel - desktop only */}
                <div className="hidden lg:flex flex-col gap-4 w-72">

                    <div className="bg-base-300 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={currentUser.photoUrl} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h3 className="font-semibold text-sm">{currentUser.firstName} {currentUser.lastName}</h3>
                                {currentUser.title && <p className="text-xs text-indigo-400">{currentUser.title}</p>}
                            </div>
                        </div>
                        <p className="text-sm opacity-70">{currentUser.about}</p>
                    </div>

                    {currentUser.githubUsername && (
                        <div className="bg-base-300 rounded-2xl p-5">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Code2 size={16} /> GitHub Stats
                            </h3>

                            {!githubStats && (
                                <p className="text-xs opacity-40">Loading stats...</p>
                            )}

                            {githubStats && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-base-100 rounded-xl p-3 text-center">
                                        <p className="text-xl font-bold">{githubStats.repos}</p>
                                        <p className="text-xs opacity-50">Repos</p>
                                    </div>
                                    <div className="bg-base-100 rounded-xl p-3 text-center">
                                        <p className="text-xl font-bold">{githubStats.stars}</p>
                                        <p className="text-xs opacity-50">Stars</p>
                                    </div>
                                    <div className="bg-base-100 rounded-xl p-3 text-center col-span-2">
                                        <p className="text-xl font-bold">{githubStats.followers}</p>
                                        <p className="text-xs opacity-50">Followers</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {(currentUser.githubUsername || currentUser.portfolioUrl || currentUser.linkedinUrl) && (
                        <div className="bg-base-300 rounded-2xl p-5">
                            <h3 className="font-semibold mb-3">Links</h3>
                            <div className="flex flex-col gap-2 text-sm">
                                {currentUser.githubUsername && (
                                    <a href={`https://github.com/${currentUser.githubUsername}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-400 hover:underline">
                                        <Code2 size={14} /> github.com/{currentUser.githubUsername}
                                    </a>
                                )}
                                {currentUser.portfolioUrl && (
                                    <a href={currentUser.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-400 hover:underline">
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