/* eslint-disable react/prop-types */
import TeacherAssessments from "./TeacherAssessments";

const TeacherDashboard = ({ token }) => {
  return (
    <div>
      <h1>Welcome, {token.email.split("@")[0]}</h1>
      <TeacherAssessments />
    </div>
  );
};

export default TeacherDashboard;
