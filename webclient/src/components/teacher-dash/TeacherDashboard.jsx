import PropTypes from "prop-types";
import TeacherAssessments from "./TeacherAssessments";

const TeacherDashboard = ({ token }) => {
  return (
    <div>
      <h1 className="text-neutral-200 text-2xl font-semibold">Welcome, {token.email.split("@")[0]}</h1>
      <TeacherAssessments />
    </div>
  );
};

TeacherDashboard.propTypes = {
  token: PropTypes.object.isRequired,
};

export default TeacherDashboard;
