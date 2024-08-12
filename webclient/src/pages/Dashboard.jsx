import StudentDashboard from "../components/student-dash/StudentDashboard";
import TeacherDashboard from "../components/teacher-dash/TeacherDashboard";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { decoded } = useAuth();

  return <div>{decoded && <div>{decoded?.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}</div>}</div>;
};

export default Dashboard;
