import axios from "axios";
import { ChangeEvent, useState, FormEvent } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Api } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        toast("User data saved sucessfully.")
       navigate('/login');
      }else{
        toast("User already exist");
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

  return (
    <div className="">
      <section className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5">
          <div className="w-1/2">
            <img
              className="hidden md:block rounded-2xl"
              src="https://images.unsplash.com/photo-1663507897721-c6c216a8fb28?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>

          <div className="md:w-1/2 px-16">
            <h1 className="text-[#0A1612] font-bold text-2xl">Signup</h1>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <input
                  onChange={handleChangeData}
                  type="text"
                  name="name"
                  className="p-2 rounded-xl border mt-8 w-full"
                  placeholder="Name"
                />
                {dataError.name && (
                  <p className="text-red-500 text-sm">{dataError.name}</p>
                )}
              </div>

              <div>
                <input
                  onChange={handleChangeData}
                  type="text"
                  name="email"
                  className="p-2 rounded-xl border w-full"
                  placeholder="Email"
                />
                {dataError.email && (
                  <p className="text-red-500 text-sm">{dataError.email}</p>
                )}
              </div>

              <div className="relative">
                <input
                  onChange={handleChangeData}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="p-2 rounded-xl border w-full"
                  placeholder="Password"
                />
                {dataError.password && (
                  <p className="text-red-500 text-sm">{dataError.password}</p>
                )}
                {showPassword ? (
                  <FaEyeSlash
                    onClick={handleShowPassword}
                    className="absolute top-3 right-3 cursor-pointer"
                  />
                ) : (
                  <FaRegEye
                    onClick={handleShowPassword}
                    className="absolute top-3 right-3 cursor-pointer"
                  />
                )}
              </div>

              <div className="relative">
                <input
                  onChange={handleChangeData}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="p-2 rounded-xl border w-full"
                  placeholder="Confirm Password"
                />
                {dataError.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {dataError.confirmPassword}
                  </p>
                )}
                {showConfirmPassword ? (
                  <FaEyeSlash
                    onClick={handleShowConfirmPassword}
                    className="absolute top-3 right-3 cursor-pointer"
                  />
                ) : (
                  <FaRegEye
                    onClick={handleShowConfirmPassword}
                    className="absolute top-3 right-3 cursor-pointer"
                  />
                )}
              </div>

              <button className="bg-[#0A1612] rounded-xl text-white py-2  transition-transform duration-300 hover:scale-105">
                Signup
              </button>
            </form>

            <div className="mt-10 grid grid-cols-3 items-center text-gray-600 ">
              <hr className="border-gray-500" />
              <p className="text-center">OR</p>
              <hr className="border-gray-500" />
            </div>

            {/* <div className="bg-white border py-2 w-full rounded-xl cursor-pointer mt-5 flex justify-center items-center gap-2">
              <FcGoogle /> Signup with Google
            </div> */}

            <div className="mt-3 text-xs flex justify-between items-center">
              <p>Already have an account?</p>
              <Link to={'/'} className="py-2 px-5 bg-white border rounded-xl">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
