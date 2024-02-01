import TeacherAssessments from "./teacher-dash/TeacherAssessments";
import StudentAssessments from "./student-dash/StudentAssessments";
import { useAuth } from "../hooks/useAuthContext";

function Assessments() {
  const { token } = useAuth();

  return token?.role === "teacher" ? <TeacherAssessments /> : <StudentAssessments />;
}

export default Assessments;
