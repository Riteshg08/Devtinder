import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";


const Login = () => {
    const [emailId, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState();

    const handleSignUp = async() => {
        try{
            const res = await axios.post(BASE_URL + "/signup",{
                firstName,lastName,email: emailId,password
            }, {
                withCredentials: true
            });
            dispatch(addUser(res.data.user));
            navigate("/profile");
        }
        catch(err){
            setError(err?.response?.data || "Something went wrong!");
        }
    }


    const handleLogin = async () => {
        try {
            const res = await axios.post(BASE_URL + "/login", {
                email: emailId,
                password
            }, {
                withCredentials: true
            });
            dispatch(addUser(res.data.user));
            navigate("/");
        }
        catch (err) {
            setError(err?.response?.data || "Something went wrong");
        }
    };

    return (
        <div className="flex justify-center items-center p-40">
            <div className="card card-border bg-base-300 w-96">
                <div className="card-body">
                    <h2 className="card-title justify-center">{isLoggedIn ? "Login" : "Sign Up"}</h2>
                    {!isLoggedIn && (
                        <>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend" >First Name</legend>
                                <input type="text" className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </fieldset>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend" >Last Name</legend>
                                <input type="text" className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </fieldset>
                        </>
                    )}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend" >Email Id</legend>
                        <input type="email" className="input" value={emailId} onChange={(e) => setEmail(e.target.value)} />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend" >Password</legend>
                        <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </fieldset>
                    <p className="text-red-500">{error}</p>
                    <div className="card-actions justify-center p-2">
                        <button className="btn btn-primary" onClick={isLoggedIn ? handleLogin : handleSignUp}>
                            {isLoggedIn ? "Login" : "Sign Up"}
                        </button>
                    </div>
                    <p className="text-center cursor-pointer" onClick={() => setIsLoggedIn(!isLoggedIn)}>
                        {!isLoggedIn ? "Existing User? Login Here" : "New User? Sign Up Here"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;