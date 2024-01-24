import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoutes from "./components/PrivateRoutes";
import Profile from "./pages/Profile";
import Forum from "./pages/Forum";
import Main from "./components/forum/Main";
import Topic from "./components/forum/Content/Topic";
import Summary from "./components/forum/profile/Summary";
import Activity from "./components/forum/profile/Activity";
import Badges from "./components/forum/profile/Badges";
import Preferences from "./components/forum/profile/Preferences";
import LearningPaths from "./components/student-dash/LearningPaths";
import LearningPath from "./components/student-dash/LearningPath";
import Challenge from "./components/student-dash/Challenge";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route element={<PrivateRoutes />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/lp" element={<LearningPaths />} />
          <Route path="dashboard/lp/:pathTitle" element={<LearningPath />} />
          <Route path="dashboard/lp/:pathTitle/:challengeTitle" element={<Challenge />} />
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
