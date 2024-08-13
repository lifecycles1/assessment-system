import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoutes from "./components/PrivateRoutes";
import Dashboard from "./pages/Dashboard";
import LearningPaths from "./components/student-dash/LearningPaths";
import LearningPath from "./components/student-dash/LearningPath";
import Challenge from "./components/student-dash/Challenge";
import Forum from "./pages/Forum";
import Topic from "./components/forum/content/Topic";
import Profile from "./pages/Profile";
import Summary from "./components/forum/profile/Summary";
import Activity from "./components/forum/profile/Activity";
import Badges from "./components/forum/profile/Badges";
import Preferences from "./components/forum/profile/Preferences";
import NavigationBar from "./components/NavigationBar";
import Assessments from "./components/Assessments";
import Settings from "./pages/Settings";
import { store } from "./app/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route element={<PrivateRoutes />}>
            {/* dashboard */}
            <Route path="dashboard" element={<Dashboard />} />
            {/* dashboard -> learning paths -> challenge */}
            <Route path="dashboard/lp" element={<LearningPaths />} />
            <Route path="dashboard/lp/:pathTitle" element={<LearningPath />} />
            <Route path="dashboard/lp/:pathTitle/:challengeTitle" element={<Challenge />} />
            {/* dashboard -> assessments */}
            <Route path="dashboard/assessments" element={<Assessments />} />
            {/* forum */}
            <Route path="forum/:category" element={<Forum />} />
            <Route path="forum/:category/t/:topicId" element={<Topic />} />
            {/* forum profile */}
            <Route path="forum/u" element={<Profile />}>
              <Route path="summary" element={<Summary />} />
              <Route path="activity" element={<Activity />} />
              <Route path="badges" element={<Badges />} />
              <Route path="preferences" element={<Preferences />} />
            </Route>
            {/* settings */}
            <Route path="settings" element={<Settings />} />
            {/*  */}
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
