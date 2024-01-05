import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoutes from "./components/PrivateRoutes";
import Profile from "./pages/Profile";
import Forum from "./pages/Forum";
import Main from "./components/forum/Main";
import Topic from "./components/forum/Content/Topic";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forum" element={<Forum />}>
            <Route path=":category" element={<Main />} />
          </Route>
          <Route path="/forum/:category/t/:id" element={<Topic />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
