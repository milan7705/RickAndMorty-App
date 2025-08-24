import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="relative bg-gray-800 text-white px-4 py-3">
      <nav className="flex justify-between items-center max-w-4xl mx-auto">
        <Link to="/characters" className="text-lg font-semibold">
          <img src="\src\assets\Rick_and_Morty.svg" alt="rick&mort-icon" />
        </Link>
        {user && (
          <button
            onClick={handleLogout}
            className="absolute top-[15px] right-[15px] hover:bg-[#00B1CA] px-3 py-1 rounded hover:border-stone-100"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
