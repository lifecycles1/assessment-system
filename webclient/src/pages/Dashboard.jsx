import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import StudentDashboard from "../components/student-dash/StudentDashboard";
import TeacherDashboard from "../components/teacher-dash/TeacherDashboard";
import NavigationBar from "../components/NavigationBar";

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setUserRole(decoded.role);
    }
  }, []);

  return (
    <div>
      <NavigationBar />
      {userRole === "student" ? <StudentDashboard /> : <TeacherDashboard />}
    </div>
  );
};

export default Dashboard;
