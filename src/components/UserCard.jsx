import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
    if (!user) return null;
    const { firstName, lastName, age, gender, bio, photoUrl, _id, title, company, location, githubUsername, portfolioUrl, linkedinUrl } = user;
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
        <div>
            <div className="card bg-base-300 w-full sm:w-80 md:w-96 shadow-lg">
                <figure>
                    <img
                        src={photoUrl}
                        alt="profile-picture" />
                </figure>
                <div className="card-body flex">
                    <h2 className="card-title">{firstName + " " + lastName}</h2><span>,</span>
                    <p>{age}</p>
                    <p>{location}</p>
                </div>
            </div>
            <div className="card-actions justify-between py-1">
                <button className="btn bg-transparent rounded-full" onClick={() => handleSendRequest("ignored", _id)}>❌</button>
                <button className="btn bg-transparent rounded-full" onClick={() => handleSendRequest("interested", _id)}>💚</button>
            </div>
        </div>
    )
};

export default UserCard;