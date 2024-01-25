import StudentDashboard from "../components/student-dash/StudentDashboard";
import TeacherDashboard from "../components/teacher-dash/TeacherDashboard";
import { useAuth } from "../hooks/useAuthContext";

const Dashboard = () => {
  const { token } = useAuth();

  return <div>{token && <div>{token?.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}</div>}</div>;
};

export default Dashboard;
