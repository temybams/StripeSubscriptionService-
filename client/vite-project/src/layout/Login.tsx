import  { useState } from "react";
import firebase from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        toast.error("Please fill all the fields");
        setIsLoading(false);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log("Please provide a valid email");
        return;
      }
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      if (response.user) {
        setEmail("");
        setPassword("");

        toast.success("Login successful!");
        window.setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    } catch (error: any) {
      console.log("Login error", error);
      toast.error("Login failed. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center w-full mx-auto h-screen diagonal-background ">
      <form
        onSubmit={handleSubmit}
        className="grid place-items-center lg:w-5/12 sm:w-9/12 w-11/12 mx-auto bg-white text-[#4f7cff] 
      shadow-2xl rounded-3xl"
      >
        <div className="pt-16 pb-4 text-3xl font-bold capitalize">
          Login To serVices
        </div>

        {/* Email field */}
        <div className="w-full flex flex-col px-14 py-8">
          <label>Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 mt-1 text-lg outline-none"
            placeholder="example@123.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* Password field */}
        <div className="w-full flex flex-col px-14 pb-8">
          <label>Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 mt-1 text-lg outline-none"
            placeholder="******"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Register link */}
        <div className="w-full flex justify-between items-center px-14 pb-8 text-[#3d5fc4]">
          <div>Don't have an account?</div>
          <div>
            <a href="/register" className="hover:underline">
              Register Now
            </a>
          </div>
        </div>
        {/* Login button */}
        <div className="mx-auto flex justify-center items-center pt-6 pb-16">
          <button
            type="submit"
            className={`bg-[#3d5fc4] text-white rounded-md text-base uppercase w-24 py-2 ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
