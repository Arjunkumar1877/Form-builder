import { ChangeEvent, useState, FormEvent, useEffect } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signInSuccess, UserType } from "../redux/userSlice";
import { Api } from "../utils/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";


const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({
    email: "",
    password: ""
  });
  const [userData, setUserData] = useState<UserType>({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any)=> state.user);

  
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));

    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        error = "Email is required.";
      } else if (!emailPattern.test(value)) {
        error = "Enter a valid email address.";
      }
    } else if (name === "password") {
      if (!value) {
        error = "Password is required.";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    validateField("email", userData.email);
    validateField("password", userData.password);

    if (!errors.email && !errors.password && userData.email && userData.password) {
      console.log("Form submitted successfully", userData);
      const res = await axios.post(`${Api}/user/login`, {
        userData
      });

      if(res.data.success){
        dispatch(signInSuccess(res.data.data));
        toast("User Succesfully logged in");
           navigate('/home');
      }else{
        
      }

      console.log(res.data)



    } else {
      console.log("Form has errors", errors);
    }
  };


useEffect(()=>{
  if(currentUser){
    navigate("/home");
  }
},[]);


  return (
    <div className="">
      <section className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5">
          <div className="md:w-1/2 px-16">
            <h1 className="text-[#0A1612] font-bold text-2xl">Login</h1>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="email"
                className={`p-2 rounded-xl border mt-8 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email"
                onChange={handleDataChange}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`p-2 rounded-xl border w-full ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Password"
                  onChange={handleDataChange}
                />
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
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}

              <button
                type="submit"
                className="bg-[#0A1612] rounded-xl text-white py-2 transition-transform duration-300 hover:scale-105"
              >
                Login
              </button>
            </form>

            <div className="mt-10 grid grid-cols-3 items-center text-gray-600">
              <hr className="border-gray-500" />
              <p className="text-center">OR</p>
              <hr className="border-gray-500" />
            </div>

            <div className="bg-white border py-2 w-full rounded-xl cursor-pointer mt-5 flex justify-center items-center gap-2">
              <FcGoogle /> Login with Google
            </div>

            <p className="mt-10 text-xs border-b py-4">Forgot your password?</p>

            <div className="mt-3 text-xs flex justify-between items-center">
              <p className="">Don't have an account?</p>
              <button className="py-2 px-5 bg-white border rounded-xl">
                Signup
              </button>
            </div>
          </div>

          <div className="w-1/2">
            <img
              className="hidden md:block rounded-2xl"
              src="https://images.unsplash.com/photo-1663507897721-c6c216a8fb28?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
