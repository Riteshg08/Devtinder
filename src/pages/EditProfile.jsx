import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import axios from "axios";



const EditProfile = () => {
    const user = useSelector((store) => store.user);

    if (!user) {
        return <p className="text-white p-10">Loading...</p>;
    }

    return <EditProfileForm user={user} />;
};



const EditProfileForm = ({ user }) => {
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [age, setAge] = useState(user?.age || "");
    const [gender, setGender] = useState(user?.gender || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
    const [username, setUsername] = useState(user?.username || "");
    const [title, setTitle] = useState(user?.title || "");
    const [company, setCompany] = useState(user?.company || "");
    const [location, setLocation] = useState(user?.location || "");
    const [skillsInput, setSkillsInput] = useState(user?.skills ? user.skills.join(", ") : "");
    const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || "");
    const [githubUsername, setGithubUsername] = useState(user?.githubUsername || "");
    const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || "");
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    if (!user) return null;
    console.log("Editprofile");


    const saveProfile = async () => {
        setError("");
        try {
            const skillsArray = skillsInput
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill.length > 0);

            const res = await axios.patch(BASE_URL + "/profile/edit", {
                firstName, lastName, age, gender, bio, photoUrl,
                username, title, company, location,
                skills: skillsArray,
                portfolioUrl, githubUsername, linkedinUrl
            }, {
                withCredentials: true
            });

            dispatch(addUser(res?.data?.data));
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
        catch (err) {
            setError(err?.response?.data || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex-col items-center bg-[#0B1020] text-white p-6 sm:p-10">

            {/* Header row */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Profile</h1>
                <button
                    className="btn bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none p-2 rounded-2xl"
                    onClick={saveProfile}
                >
                    Save Changes
                </button>
            </div>

            {error && <p className="text-red-400 mb-4">{error}</p>}

            <div className="w-full max-w-2xl flex flex-col gap-6">

                {/* Profile Photo section */}
                <div className="bg-gray-800 rounded-2xl p-6">
                    <h2 className="font-semibold mb-4">Profile Photo</h2>
                    <div className="flex items-center gap-4">
                        <img
                            src={photoUrl}
                            alt="profile"
                            className="w-20 h-20 rounded-xl object-cover bg-base-100"
                        />
                        <div className="flex-1">
                            <input
                                type="text"
                                className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100"
                                placeholder="Paste an image URL"
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                            />
                            <p className="text-xs opacity-50 mt-2">
                                Paste a direct image link
                            </p>
                        </div>
                    </div>
                </div>

                {/* Basic Information section */}
                <div className="bg-gray-800 rounded-2xl p-6">
                    <h2 className="font-semibold mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm opacity-60">First Name</label>
                            <input type="text" className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100 mt-1" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm opacity-60">Last Name</label>
                            <input type="text" className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100 mt-1" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm opacity-60">Username</label>
                            <input type="text" className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100 mt-1" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm opacity-60">Age</label>
                            <input type="number" className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100 mt-1" value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm opacity-60">Gender</label>
                            <select
                                className="bg-[#0B1020] p-2 rounded-xl select w-full bg-base-100 mt-1"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="" disabled>Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm opacity-60">Location</label>
                            <input type="text" className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100 mt-1" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm opacity-60">Bio</label>
                        <textarea
                            className="bg-[#0B1020] p-2 rounded-xl textarea w-full bg-base-100 h-24 mt-1"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Professional Info section */}
                <div className="bg-gray-800 rounded-2xl p-6">
                    <h2 className="font-semibold mb-4">Professional Info</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm opacity-60">Title / Role</label>
                            <input type="text" className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100 mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm opacity-60">Company</label>
                            <input type="text" className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100 mt-1" value={company} onChange={(e) => setCompany(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm opacity-60">GitHub Username</label>
                            <input type="text" className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100 mt-1" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm opacity-60">Portfolio URL</label>
                            <input type="text" className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100 mt-1" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm opacity-60">LinkedIn URL</label>
                            <input type="text" className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100 mt-1" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm opacity-60">Skills (comma separated)</label>
                        <input
                            type="text"
                            className="bg-[#0B1020] p-2 rounded-xl input w-full bg-base-100 mt-1"
                            placeholder="JavaScript, React, Node.js"
                            value={skillsInput}
                            onChange={(e) => setSkillsInput(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {showToast && (
                <div className="toast toast-top toast-center">
                    <div className="alert alert-success">
                        <span>Profile saved successfully!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfile;


