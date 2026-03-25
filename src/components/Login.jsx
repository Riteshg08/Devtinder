import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {addUser} from "../utils/userSlice"; 
import { useNavigate  } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
    const [emailId, setEmail] = useState("sharadha@gmail.com");
    const [password, setPassword] = useState("qwert");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try{
             const res = await axios.post(BASE_URL+"/login",{
                email:emailId,
                password
             },{
                withCredentials:true
             });
             dispatch(addUser(res.data.user));
             navigate("/");
        }
        catch(err){
                console.error(err);
        }
    };

    return (
        <div className="flex justify-center items-center p-40">
            <div className="card card-border bg-base-300 w-96">
                <div className="card-body">
                    <h2 className="card-title justify-center">Login</h2>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend" >Email Id</legend>
                        <input type="email" className="input" value={emailId} onChange={(e)=> setEmail(e.target.value)}/>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend" >Password</legend>
                        <input type="password" className="input" value={password } onChange={(e)=> setPassword(e.target.value)}/>
                    </fieldset>
                    <div className="card-actions justify-center p-3">
                        <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;