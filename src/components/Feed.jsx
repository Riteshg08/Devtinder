import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    console.log(feed);
    const dispatch = useDispatch();
    const getFeed = async () => {
        try {
            if (feed) return;
            const res = await axios.get(BASE_URL + "/feed", {
                withCredentials: true
            });
            dispatch(addFeed(res.data.users));
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getFeed();
    }, [])
    if (!feed) return <h1>Loading...</h1>;
    if (feed.length === 0) return <h1>No Users Found</h1>;

    return (
        <div className="flex flex-wrap justify-center gap-6 mt-10 px-4">
            {feed.map((user) => (
                <UserCard key={user._id} user={user} />
            ))}
        </div>
    );
};

export default Feed;