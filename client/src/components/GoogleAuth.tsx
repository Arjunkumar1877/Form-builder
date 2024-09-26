import { auth } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signInSuccess } from "../redux/userSlice";
import { FcGoogle } from "react-icons/fc";
import { toast }from "react-toastify";
import axios from "axios";
import { Api } from "../utils/api";

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultsFromGoogle);


      const res = await axios.post(`${Api}/user/google_oauth`, {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
         password: 91000000000000 + Date.now() + Math.floor(Math.random() * 1000)
      })

      console.log(res.data)

      if (res.data.success) {

        console.log(res.data);
        dispatch(signInSuccess(res.data.data));
        navigate("/form_list");
        toast("Succesfully logged In");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-white border py-2 w-full rounded-xl cursor-pointer mt-5 flex justify-center items-center gap-2" onClick={handleGoogleClick}>
    <FcGoogle /> Login with Google
  </div>
  );
};

export default GoogleAuth;

