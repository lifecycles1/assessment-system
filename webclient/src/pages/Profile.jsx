import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SideBar from "../components/forum/SideBar";
import axios from "axios";
import { useAuth } from "../hooks/useAuthContext";

const Profile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState(localStorage.getItem("selectedCategory"));
  const [selectedTab, setSelectedTab] = useState("summary");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/profile/${token.id}`);
        console.log("profile page data", response.data);
        setUserData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [token]);

  const handleTabClick = (tab) => {
    setSelectedTab((prev) => (prev === tab ? prev : tab));
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    localStorage.setItem("selectedCategory", newCategory);
    navigate(`/forum/${newCategory}`);
  };

  return (
    <div>
      <div className="fixed left-0 top-12 overflow-y-auto z-10">
        <SideBar category={category} setCategory={handleCategoryChange} />
      </div>
      <div className="flex-1 ml-[260px] overflow-y-auto mt-8 p-12">
        <div className="flex space-x-7 border-b pb-4">
          <img src="https://via.placeholder.com/150" alt="User" className="w-16 h-16 rounded-full" />
          <div className="mt-1">
            <div className="text-xl font-bold ">{token?.email.split("@")[0]}</div>
            <div>
              <span className="text-gray-500">Joined </span>
              {new Date(token?.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Link to="summary" onClick={() => handleTabClick("summary")} className={`flex-1 p-3 ${selectedTab === "summary" ? "border-b-4 border-gray-800" : "hover:border-b-4 border-gray-300 hover:text-gray-500"}`}>
            Summary
          </Link>
          <Link to="activity" onClick={() => handleTabClick("activity")} className={`flex-1 p-3 ${selectedTab === "activity" ? "border-b-4 border-gray-800" : "hover:border-b-4 border-gray-300 hover:text-gray-500"}`}>
            Activity
          </Link>
          <Link to="badges" onClick={() => handleTabClick("badges")} className={`flex-1 p-3 ${selectedTab === "badges" ? "border-b-4 border-gray-800" : "hover:border-b-4 border-gray-300 hover:text-gray-500"}`}>
            Badges
          </Link>
          <Link to="preferences" onClick={() => handleTabClick("preferences")} className={`flex-1 p-3 ${selectedTab === "preferences" ? "border-b-4 border-gray-800" : "hover:border-b-4 border-gray-300 hover:text-gray-500"}`}>
            Preferences
          </Link>
        </div>
        {userData && <Outlet context={userData} />}
      </div>
    </div>
  );
};

export default Profile;
