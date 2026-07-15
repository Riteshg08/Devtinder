import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/constants";
import { Search, Send, ArrowLeft, Phone, Video, MoreVertical, Check, CheckCheck , MessageCircle} from "lucide-react";

const timeAgo = (dateString) => {
    if (!dateString) return "";
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return "now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + "m ago";
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + "h ago";
    const days = Math.floor(hours / 24);
    return days + "d ago";
};

const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Messages = () => {
    const user = useSelector((store) => store.user);
    const userId = user?._id;
    const location = useLocation();

    const [connections, setConnections] = useState([]);
    const [conversations, setConversations] = useState({}); // keyed by userId -> { lastMessageText, lastMessageAt, unreadCount }
    const [selectedConn, setSelectedConn] = useState(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isOtherTyping, setIsOtherTyping] = useState(false);

    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", {
                withCredentials: true
            });
            setConnections(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchConversations = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/conversations", {
                withCredentials: true
            });
            setConversations(res?.data?.data || {});
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchConnections();
        fetchConversations();
    }, []);

    useEffect(() => {
        if (location.state?.openChatWith) {
            setSelectedConn(location.state.openChatWith);
        }
    }, [location.state]);

    const fetchMessages = async (targetUserId) => {
        try {
            const res = await axios.get(BASE_URL + "/messages/" + targetUserId, {
                withCredentials: true
            });
            setMessages(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (targetUserId) => {
        try {
            await axios.patch(BASE_URL + "/messages/" + targetUserId + "/read", {}, {
                withCredentials: true
            });
            // reflect it locally too, so unread badges disappear right away
            setConversations((prev) => ({
                ...prev,
                [targetUserId]: { ...prev[targetUserId], unreadCount: 0 }
            }));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!userId || !selectedConn) return;

        const targetUserId = selectedConn._id;

        fetchMessages(targetUserId);
        markAsRead(targetUserId);
        setIsOtherTyping(false);

        const socket = io(BASE_URL);
        socketRef.current = socket;

        socket.emit("joinChat", { userId, targetUserId });

        socket.on("messageReceived", (message) => {
            const isThisChat =
                (message.senderId === userId && message.receiverId === targetUserId) ||
                (message.senderId === targetUserId && message.receiverId === userId);

            if (isThisChat) {
                setMessages((prev) => [...prev, message]);

                // if the message just arrived while this chat is open, mark it read immediately
                if (message.senderId === targetUserId) {
                    markAsRead(targetUserId);
                }
            }

            // refresh the sidebar preview regardless of which chat is open
            fetchConversations();
        });

        socket.on("userTyping", ({ userId: typingUserId }) => {
            if (typingUserId === targetUserId) {
                setIsOtherTyping(true);
            }
        });

        socket.on("userStoppedTyping", ({ userId: typingUserId }) => {
            if (typingUserId === targetUserId) {
                setIsOtherTyping(false);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, selectedConn]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOtherTyping]);

    const handleTyping = (value) => {
        setNewMessage(value);

        if (!socketRef.current || !selectedConn) return;

        socketRef.current.emit("typing", { userId, targetUserId: selectedConn._id });

        // stop the "typing" signal 1.5s after the last keystroke
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit("stopTyping", { userId, targetUserId: selectedConn._id });
        }, 1500);
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !selectedConn) return;

        socketRef.current.emit("sendMessage", {
            senderId: userId,
            receiverId: selectedConn._id,
            text: newMessage
        });

        socketRef.current.emit("stopTyping", { userId, targetUserId: selectedConn._id });
        setNewMessage("");
    };

    return (
        <div className="h-full bg-bg text-white flex">

            {/* Left pane */}
            <div className={
                "w-full sm:w-80 border-r border-gray-800 flex-col " +
                (selectedConn ? "hidden sm:flex" : "flex")
            }>
                <div className="p-4 sm:p-5">
                    <h1 className="text-xl font-bold mb-3">Messages</h1>
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {connections.length === 0 && (
                        <p className="opacity-60 text-sm px-5">No connections to message yet!</p>
                    )}

                    {connections.map((conn) => {
                        const convo = conversations[conn._id];

                        return (
                            <div
                                key={conn._id}
                                onClick={() => setSelectedConn(conn)}
                                className={
                                    "flex items-center gap-3 px-4 sm:px-5 py-3 cursor-pointer border-l-2 " +
                                    (selectedConn?._id === conn._id
                                        ? "bg-gray-800 border-indigo-500"
                                        : "border-transparent hover:bg-gray-800/60")
                                }
                            >
                                <div className="relative shrink-0">
                                    <img
                                        src={conn.photoUrl}
                                        alt="photo"
                                        className="w-11 h-11 rounded-full object-cover"
                                    />
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-bg"></span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="font-semibold text-sm truncate">
                                            {conn.firstName + " " + conn.lastName}
                                        </h2>
                                        {convo?.lastMessageAt && (
                                            <span className="text-xs text-gray-500 shrink-0">
                                                {timeAgo(convo.lastMessageAt)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs text-gray-500 truncate">
                                            {convo?.lastMessageText || conn.title || "Say hello!"}
                                        </p>
                                        {convo?.unreadCount > 0 && (
                                            <span className="bg-indigo-500 text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shrink-0">
                                                {convo.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right pane */}
            <div className={
                "flex-1 flex-col " +
                (selectedConn ? "flex" : "hidden sm:flex")
            }>
                {!selectedConn && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                        <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-5">
                            <MessageCircle size={32} className="text-indigo-400" />
                        </div>
                        <h3 className="font-semibold text-lg text-white mb-1">Your Messages</h3>
                        <p className="text-gray-500 text-sm max-w-xs">
                            Select a conversation from the left to start chatting with your connections.
                        </p>
                    </div>
                )}

                {selectedConn && (
                    <>
                        {/* Chat header */}
                        <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-800">
                            <div className="flex items-center gap-3 min-w-0">
                                <button
                                    onClick={() => setSelectedConn(null)}
                                    className="sm:hidden text-gray-400 hover:text-white shrink-0"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <img
                                    src={selectedConn.photoUrl}
                                    alt="photo"
                                    className="w-9 h-9 rounded-full object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                    <h2 className="font-semibold text-sm truncate">
                                        {selectedConn.firstName + " " + selectedConn.lastName}
                                    </h2>
                                    <p className="text-xs text-green-400">
                                        {isOtherTyping ? "Typing..." : "Online now"}
                                    </p>
                                </div>
                            </div>

                            {/* decorative header icons - no call/video feature built yet */}
                            {/* <div className="flex items-center gap-2 shrink-0">
                                <button className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition" title="Voice call (coming soon)">
                                    <Phone size={16} />
                                </button>
                                <button className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition" title="Video call (coming soon)">
                                    <Video size={16} />
                                </button>
                                <button className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition" title="More options">
                                    <MoreVertical size={16} />
                                </button>
                            </div> */}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 flex flex-col gap-3 overflow-y-auto p-4 sm:p-6">
                            {messages.map((msg, index) => {
                                const isMine = msg.senderId === userId;
                                return (
                                    <div
                                        key={index}
                                        className={"flex flex-col " + (isMine ? "items-end" : "items-start")}
                                    >
                                        <div
                                            className={
                                                "max-w-[75%] sm:max-w-xs px-4 py-2 rounded-2xl text-sm " +
                                                (isMine ? "bg-indigo-600" : "bg-gray-800")
                                            }
                                        >
                                            {msg.text}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 px-1">
                                            <span className="text-xs text-gray-500">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                            {isMine && (
                                                msg.isRead
                                                    ? <CheckCheck size={13} className="text-indigo-400" />
                                                    : <Check size={13} className="text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {isOtherTyping && (
                                <div className="flex items-center gap-2">
                                    <img
                                        src={selectedConn.photoUrl}
                                        alt="photo"
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <div className="bg-gray-800 rounded-2xl px-4 py-2 flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                    </div>
                                </div>
                            )}

                            <div ref={bottomRef}></div>
                        </div>

                        {/* Input bar */}
                        <div className="flex gap-3 p-4 border-t border-gray-800">
                            <input
                                type="text"
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => handleTyping(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button
                                onClick={sendMessage}
                                className="btn btn-circle bg-indigo-600 hover:bg-indigo-500 border-none p-2 rounded"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Messages;