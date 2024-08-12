import TeacherAssessments from "./teacher-dash/TeacherAssessments";
import StudentAssessments from "./student-dash/StudentAssessments";
import useAuth from "../hooks/useAuth";

function Assessments() {
  const { decoded } = useAuth();

  return decoded?.role === "teacher" ? <TeacherAssessments /> : <StudentAssessments />;
}

export default Assessments;
