import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      localStorage.setItem("token", await userCred.user.getIdToken());
      navigate("/characters");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className=" form-center bg-white/30 backdrop-blur-sm max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-md"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

      <input
        type="email"
        id="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="relative mb-4">
        <input
          type={showPassword ? "password" : "text"}
          id="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-stone-50 hover:text-stone-200 focus:outline-none border-none bg-[#3B3B3B]"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-sm shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Register;
