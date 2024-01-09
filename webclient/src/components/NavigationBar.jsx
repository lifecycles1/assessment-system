import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const NavigationBar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const encoded = localStorage.getItem("token");
    if (encoded) {
      const decoded = jwt_decode(encoded);
      setToken(decoded);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const ProfileDropdown = () => {
    return (
      <div className="absolute right-0 top-0 mt-12 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
          Your Profile
        </Link>
        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
          Settings
        </Link>
        <button onClick={handleLogout} className="block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-200 w-full text-left">
          Logout
        </button>
      </div>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex justify-between items-center h-12">
      {/* Logo on the left */}
      <div className="text-white text-lg font-semibold">Your Logo</div>

      {/* Navigation Routes in the middle */}
      <ul className="flex space-x-4">
        <li>
          <Link to="/dashboard" className="text-white hover:underline">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/profile" className="text-white hover:underline">
            Profile
          </Link>
        </li>
        <li>
          <Link to="/forum/home" className="text-white hover:underline">
            Forum
          </Link>
        </li>
      </ul>

      {/* Profile dropdown on the right corner */}
      <div className="relative">
        <button onClick={() => setIsOpen((prev) => !prev)} className="flex items-center space-x-2 text-white hover:underline">
          <img src="https://via.placeholder.com/40" alt="User" className="w-8 h-8 rounded-full" title={token?.email.split("@")[0]} />
        </button>
        {isOpen && <ProfileDropdown />}
      </div>
    </nav>
  );
};

export default NavigationBar;
