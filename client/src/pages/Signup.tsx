import axios from "axios";
import { ChangeEvent, useState, FormEvent, useEffect } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { Api } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleAuth from "../components/GoogleAuth";
import { useSelector } from "react-redux";

type UserSignupDataType = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const { currentUser } = useSelector((state: any)=> state.user);
  const [dataError, setDataError] = useState<Partial<UserSignupDataType>>({});
  const [userData, setUserData] = useState<UserSignupDataType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();


  const handleChangeData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    handleValidateForm(name, value);
  };

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const valid = handleInputValidity();
    if (
      !dataError.name &&
      !dataError.email &&
      !dataError.password &&
      !dataError.confirmPassword &&
      !valid
    ) {
      console.log("Form Submitted Successfully: ", userData);

      const res = await axios.post(`${Api}/user/signup`, {
        name: userData.name,
        email: userData.email,
        password: userData.password
      })

      console.log(res.data)
      if(res.data.success){
        toast("User data saved successfully.")
       navigate('/login');
      }else{
        toast("User already exists");
      }
    } else {
      console.log("Validation Errors: ", dataError);
    }
  };

  const handleInputValidity = () => {
    let valid = true;
    if (
      userData.confirmPassword !== "" &&
      userData.name !== "" &&
      userData.email !== "" &&
      userData.password !== ""
    ) {
      valid = false;
    }
    return valid;
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleValidateForm = (name: string, value: string) => {
    let error = "";

    if (name === "name") {
      if (!value) {
        error = "Name is required.";
      } else if (value.length < 3) {
        error = "Name must be at least 3 characters.";
      }
    } else if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        error = "Email is required.";
      } else if (!emailPattern.test(value)) {
        error = "Enter a valid email address.";
      }
    } else if (name === "password") {
      if (value.length < 6) {
        error = "Password must be at least 6 characters.";
      }
    } else if (name === "confirmPassword") {
      if (value !== userData.password) {
        error = "Passwords do not match.";
      }
    }

    setDataError((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  useEffect(()=>{
    if(currentUser){
      navigate("/form_list");
    }
  
    const loadserver = async()=> {
      const res = await axios(`${Api}/user/loading`);
      if(res.data){
        console.log("server loaded on render platform....");
      }else{
        console.log("server is still loading on the render...");
      }
    }
    loadserver();
  
  },[currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <section className="bg-white shadow-lg rounded-2xl max-w-3xl flex flex-col md:flex-row w-full overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1663507897721-c6c216a8fb28?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Signup"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-bold text-[#0A1612] mb-6">Signup</h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <input
                onChange={handleChangeData}
                type="text"
                name="name"
                className="p-3 rounded-xl border w-full"
                placeholder="Name"
                value={userData.name}
              />
              {dataError.name && (
                <p className="text-red-500 text-sm mt-1">{dataError.name}</p>
              )}
            </div>

            <div>
              <input
                onChange={handleChangeData}
                type="email"
                name="email"
                className="p-3 rounded-xl border w-full"
                placeholder="Email"
                value={userData.email}
              />
              {dataError.email && (
                <p className="text-red-500 text-sm mt-1">{dataError.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                onChange={handleChangeData}
                type={showPassword ? "text" : "password"}
                name="password"
                className="p-3 rounded-xl border w-full"
                placeholder="Password"
                value={userData.password}
              />
              {dataError.password && (
                <p className="text-red-500 text-sm mt-1">{dataError.password}</p>
              )}
              {showPassword ? (
                <FaEyeSlash
                  onClick={handleShowPassword}
                  className="absolute top-4 right-4 cursor-pointer"
                />
              ) : (
                <FaRegEye
                  onClick={handleShowPassword}
                  className="absolute top-4 right-4 cursor-pointer"
                />
              )}
            </div>

            <div className="relative">
              <input
                onChange={handleChangeData}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="p-3 rounded-xl border w-full"
                placeholder="Confirm Password"
                value={userData.confirmPassword}
              />
              {dataError.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {dataError.confirmPassword}
                </p>
              )}
              {showConfirmPassword ? (
                <FaEyeSlash
                  onClick={handleShowConfirmPassword}
                  className="absolute top-4 right-4 cursor-pointer"
                />
              ) : (
                <FaRegEye
                  onClick={handleShowConfirmPassword}
                  className="absolute top-4 right-4 cursor-pointer"
                />
              )}
            </div>

            <button className="bg-[#0A1612] rounded-xl text-white py-3 transition-transform duration-300 hover:scale-105">
              Signup
            </button>
          </form>

          <div className="my-6 grid grid-cols-3 items-center text-gray-600">
            <hr className="border-gray-500" />
            <p className="text-center">OR</p>
            <hr className="border-gray-500" />
          </div>

          <GoogleAuth />

          <div className="mt-6 text-sm text-gray-700 flex justify-between items-center">
            <p>Already have an account?</p>
            <Link to={'/'} className="py-2 px-5 bg-white border rounded-xl hover:bg-gray-200">
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
