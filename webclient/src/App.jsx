import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoutes from "./components/PrivateRoutes";
import Profile from "./pages/Profile";
import Forum from "./pages/Forum";
import Main from "./components/forum/Main";
import Topic from "./components/forum/Content/Topic";
import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Summary from "./components/forum/profile/Summary";
import Activity from "./components/forum/profile/Activity";
import Badges from "./components/forum/profile/Badges";
import Preferences from "./components/forum/profile/Preferences";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const encoded = localStorage.getItem("token");
    if (encoded) {
      const decoded = jwt_decode(encoded);
      setToken(decoded);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const updateDaysVisited = async () => {
        try {
          await axios.put(`http://localhost:3000/profile/${token.id}/days-visited`);
        } catch (error) {
          console.log(error);
        }
      };
      updateDaysVisited();
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route element={<PrivateRoutes />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="forum" element={<Forum />}>
            <Route path=":category" element={<Main />} />
          </Route>
          <Route path="forum/:category/t/:id" element={<Topic />} />
          <Route path="forum/u/:id" element={<Profile />}>
            <Route path="summary" element={<Summary />} />
            <Route path="activity" element={<Activity />} />
            <Route path="badges" element={<Badges />} />
            <Route path="preferences" element={<Preferences />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
