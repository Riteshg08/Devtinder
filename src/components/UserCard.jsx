const UserCard = ({ user }) => {
    if (!user) return null; 
    const { firstName, lastName, age, gender, about, photoUrl } = user;
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
                    <button className="btn bg-red-500 text-white">Ignored</button>
                    <button className="btn bg-green-500 text-white">Interested</button>
                </div>
            </div>
        </div>
    )
};
  
export default UserCard;