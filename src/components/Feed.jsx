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
    return feed && feed.length > 0 && (
        <div className="flex justify-center my-28 ">
            <UserCard user={feed[0]}></UserCard>
        </div>
    );
};

export default Feed;