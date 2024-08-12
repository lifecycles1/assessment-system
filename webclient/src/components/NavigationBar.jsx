import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const NavigationBar = () => {
  const { decoded } = useAuth();
  const navigate = useNavigate();
  const [sendLogout, { isSuccess }] = useSendLogoutMutation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess]);

  const ProfileDropdown = () => {
    const handleLogout = () => {
      try {
        sendLogout();
        setIsOpen(false);
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };
    return (
      <div className="absolute right-0 top-0 mt-12 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
        <Link to="/forum/u/summary" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200" onClick={() => setIsOpen(false)}>
          Profile
        </Link>
        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200" onClick={() => setIsOpen(false)}>
          Settings
        </Link>
        <button onClick={handleLogout} className="block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-200 w-full text-left">
          Logout
        </button>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-20 bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex justify-between items-center h-12">
      {/* Left section - Logo */}
      <div className="text-white text-lg font-semibold">Your Logo</div>

      {decoded && (
        <ul className="flex space-x-4">
          <li>
            <Link to="/dashboard" className="text-white hover:underline">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/forum/home" className="text-white hover:underline">
              Forum
            </Link>
          </li>
        </ul>
      )}

      {decoded && (
        <div className="relative">
          <button onClick={() => setIsOpen((prev) => !prev)} className="flex items-center space-x-2 text-white hover:underline">
            <img src="https://via.placeholder.com/40" alt="profile picture" className="w-8 h-8 rounded-full" title={decoded?.email?.split("@")[0]} />
          </button>
          {isOpen && <ProfileDropdown />}
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
