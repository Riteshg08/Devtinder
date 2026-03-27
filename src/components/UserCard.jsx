const UserCard = ({ user }) => {
    if (!user) return null; 
    const { firstName, lastName, age, gender, about } = user;
    return (
        <div className="card bg-base-300 w-96 shadow-sm">
            <figure>
                <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes" />
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