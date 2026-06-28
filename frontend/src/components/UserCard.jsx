import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
    if (!user) return null;
    const { firstName, lastName, age, gender, about, photoUrl, _id } = user;
    const dispatch = useDispatch();

    const handleSendRequest = async (status, _id) => {
        try {
            const res = await axios.post(BASE_URL + "/request/send/" + status + "/" + _id, {}, {
                withCredentials: true
            });
            dispatch(removeUserFromFeed(_id));
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="card bg-base-300 w-full sm:w-80 md:w-96 shadow-lg">
            <figure>
                <img
                    src={photoUrl}
                    alt="profile-picture" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{firstName + " " + lastName}</h2>
                <p>{about}</p>
                <div className="card-actions justify-between py-1">
                    <button className="btn bg-red-500 text-white" onClick={() => handleSendRequest("ignored", _id)}>Ignored</button>
                    <button className="btn bg-green-500 text-white" onClick={() => handleSendRequest("interested", _id)}>Interested</button>
                </div>
            </div>
        </div>
    )
};

export default UserCard;