import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import StudentDashboard from "../components/student-dash/StudentDashboard";
import TeacherDashboard from "../components/teacher-dash/TeacherDashboard";
import NavigationBar from "../components/NavigationBar";

const Dashboard = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const encoded = localStorage.getItem("token");
    if (encoded) {
      const decoded = jwt_decode(encoded);
      setToken(decoded);
    }
  }, []);

  if (!token) return null;

  return (
    <div className="bg-gray-800">
      <NavigationBar />
      <div className="h-[calc(100vh-3rem)] overflow-y-auto">{token?.role === "teacher" ? <TeacherDashboard token={token} /> : <StudentDashboard token={token} />}</div>
    </div>
  );
};

export default Dashboard;
