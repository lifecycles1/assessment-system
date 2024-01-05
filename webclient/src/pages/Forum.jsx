import { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SideBar from "../components/forum/SideBar";
import Main from "../components/forum/Main";
import { useNavigate, useLocation } from "react-router-dom";

const Forum = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [category, setCategory] = useState("");

  // Use useEffect to initialize category based on URL and persist in local storage
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const newCategory = pathSegments.length > 2 ? pathSegments[2] : "home";
    setCategory(newCategory);
    localStorage.setItem("selectedCategory", newCategory);
  }, [location.pathname]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    localStorage.setItem("selectedCategory", newCategory);
    navigate(`/forum/${newCategory}`);
  };

  return (
    <div>
      <div className="fixed top-0 z-20 w-full">
        <NavigationBar />
      </div>
      <div className="fixed left-0 top-12 overflow-y-auto z-10">
        <SideBar category={category} setCategory={handleCategoryChange} />
      </div>
      <div className="flex-1 ml-[260px] overflow-y-auto">
        <Main category={category} />
      </div>
    </div>
  );
};

export default Forum;
