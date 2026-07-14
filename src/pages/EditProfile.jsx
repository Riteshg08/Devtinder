import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import axios from "axios";

const EditProfile = () => {
    const user = useSelector((store) => store.user);

    if (!user) {
        return (
            <div className="loading-page min-h-screen">
                <div className="spinner" />
                <p className="text-gray-400 text-sm">Loading profile...</p>
            </div>
        );
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
        <div className="bg-bg text-white page-container">

            <div className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="page-title">Edit Profile</h1>
                    <p className="page-subtitle">Update your public developer profile</p>
                </div>
                <button
                    className="btn-primary shrink-0 self-start"
                    onClick={saveProfile}
                >
                    Save Changes
                </button>
            </div>

            {error && <p className="error-box max-w-2xl mx-auto mb-4">{error}</p>}

            <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">

                <div className="card p-5 sm:p-6">
                    <h2 className="font-semibold mb-4">Profile Photo</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img
                            src={photoUrl}
                            alt="profile"
                            className="w-20 h-20 rounded-xl object-cover border border-border bg-surface-dark"
                        />
                        <div className="flex-1 w-full">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Paste an image URL"
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Paste a direct image link
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card p-5 sm:p-6">
                    <h2 className="font-semibold mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 text-sm mb-1.5">First Name</label>
                            <input type="text" className="input-field" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-1.5">Last Name</label>
                            <input type="text" className="input-field" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-1.5">Username</label>
                            <input type="text" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-1.5">Age</label>
                            <input type="number" className="input-field" value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-1.5">Gender</label>
                            <select
                                className="input-field"
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
                            <label className="block text-gray-300 text-sm mb-1.5">Location</label>
                            <input type="text" className="input-field" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-300 text-sm mb-1.5">Bio</label>
                        <textarea
                            className="input-field h-24 resize-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="card p-5 sm:p-6">
                    <h2 className="font-semibold mb-4">Professional Info</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 text-sm mb-1.5">Title / Role</label>
                            <input type="text" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-1.5">Company</label>
                            <input type="text" className="input-field" value={company} onChange={(e) => setCompany(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-1.5">GitHub Username</label>
                            <input type="text" className="input-field" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm mb-1.5">Portfolio URL</label>
                            <input type="text" className="input-field" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-gray-300 text-sm mb-1.5">LinkedIn URL</label>
                            <input type="text" className="input-field" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-300 text-sm mb-1.5">Skills (comma separated)</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="JavaScript, React, Node.js"
                            value={skillsInput}
                            onChange={(e) => setSkillsInput(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    className="btn-primary w-full py-3 sm:hidden"
                    onClick={saveProfile}
                >
                    Save Changes
                </button>
            </div>

            {showToast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500/15 border border-green-500/30 text-green-400 px-5 py-3 rounded-xl text-sm font-medium shadow-lg">
                    Profile saved successfully!
                </div>
            )}
        </div>
    );
};

export default EditProfile;
