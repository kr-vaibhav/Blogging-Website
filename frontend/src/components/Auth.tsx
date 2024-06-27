import { Link, useNavigate} from "react-router-dom";
import { signupInput } from "../../node_modules/@kr-vaibhav/blogging-website/dist/index";
import { useState, ChangeEvent } from "react";
import { BACKEND_URL } from "../../config";
import axios from "axios";



export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<signupInput>({
        name: "",
        email: "",
        password: ""
    });
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = ()=>{
        setPasswordVisible(!passwordVisible);
    }

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch(e) {
            alert("Error while signing up");
        }
    }

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold">
                            {type === "signup" ? "Create an account" : "Sign in to your account"}
                        </div>
                        <div className="text-slate-500">
                            {type === "signin" ? "Don't have an account?" : "Already have an account?" }
                            <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Sign up" : "Sign in"}
                            </Link>
                        </div>
                    </div>
                    <div className="pt-8">
                        {type === "signup" ? 
                            <LabelledInput 
                                label="Name" 
                                placeholder="Kumar Vaibhav..." 
                                onChange={(e) => setPostInputs({ ...postInputs, name: e.target.value })} 
                            /> : null}
                        <LabelledInput 
                            label="Username" 
                            placeholder="vaibhav@gmail.com" 
                            onChange={(e) => setPostInputs({ ...postInputs, email: e.target.value })} 
                        />
                        <div className="relative">
                            <LabelledInput  
                                label="Password" 
                                type={passwordVisible ? "text" : "password"} 
                                placeholder="123456" 
                                onChange={(e) => setPostInputs({ ...postInputs, password: e.target.value })}
                             />
                             <button 
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center px-4 pt-11 text-gray-600"
                             >
                                {passwordVisible ? "Hide" : "Show"}
                             </button>
                        </div>
                        <button 
                            onClick={sendRequest} 
                            type="button" 
                            className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        >
                            {type === "signup" ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (
        <div>
            <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
            <input 
                onChange={onChange} 
                type={type || "text"} 
                id="first_name" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder={placeholder} 
                required 
            />
        </div>
    );
}