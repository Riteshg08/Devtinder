import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addUserToFeed } from "../utils/feedSlice";
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
            dispatch(addUserToFeed(res.data.users));
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getFeed();
    }, [])
    if (!feed) return <h1 className="justify-center my-10">Loading...</h1>;
    if (feed.length === 0) return <h1 className="justify-center my-10">No Users Found</h1>;

    return (
        <div className="flex justify-center mt-10 px-4">
            <UserCard user={feed[0]} />
        </div>
    );
};

export default Feed;