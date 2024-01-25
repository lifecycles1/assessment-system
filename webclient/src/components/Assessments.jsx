import TeacherAssessments from "./teacher-dash/TeacherAssessments";
import StudentAssessments from "./student-dash/StudentAssessments";
import { useAuth } from "../hooks/useAuthContext";

function Assessments() {
  const { token } = useAuth();

  return <div>{token && <div>{token?.role === "teacher" ? <TeacherAssessments /> : <StudentAssessments />}</div>}</div>;
}

export default Assessments;
