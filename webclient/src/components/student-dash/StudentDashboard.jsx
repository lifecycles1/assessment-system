import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CodeSubmission from "./CodeSubmission";
import StudentAssessments from "./StudentAssessments";
import axios from "axios";

const StudentDashboard = ({ token }) => {
  const [assessments, setAssessments] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const toggleView = () => setShowSubmissions((prevState) => !prevState);

  const fetchAssessments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/student-assessments/${token.email}`);
      setAssessments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssessments();
    // unlikely to change, so no dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <h1 className="text-2xl text-neutral-200 font-semibold pl-10">Welcome, {token.email.split("@")[0]}!</h1>
      <button onClick={toggleView} className="text-sm absolute top-5 right-5 py-1 px-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
        {showSubmissions ? "Code Submission" : "Submitted Assessments"}
      </button>
      {showSubmissions ? <StudentAssessments assessments={assessments} /> : <CodeSubmission token={token} />}
    </div>
  );
};

StudentDashboard.propTypes = {
  token: PropTypes.object.isRequired,
};

export default StudentDashboard;
