import { Link, useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
        {/* Add more navigation routes as needed */}
      </ul>

      {/* Logout button on the right corner */}
      <button onClick={handleLogout} className="text-white hover:underline cursor-pointer">
        Logout
      </button>
    </nav>
  );
};

export default NavigationBar;
