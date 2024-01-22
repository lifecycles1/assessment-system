// import PropTypes from "prop-types";
// import { useEffect, useState } from "react";
// import CodeSubmission from "./CodeSubmission";
// import StudentAssessments from "./StudentAssessments";
// import axios from "axios";

// const StudentDashboard = ({ token }) => {
//   const [assessments, setAssessments] = useState([]);
//   const [showSubmissions, setShowSubmissions] = useState(false);
//   const toggleView = () => setShowSubmissions((prevState) => !prevState);

//   const fetchAssessments = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3000/student-assessments/${token.email}`);
//       setAssessments(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchAssessments();
//     // unlikely to change, so no dependencies
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="relative">
//       <button onClick={toggleView} className="text-sm absolute top-[15px] right-5 py-1 px-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
//         {showSubmissions ? "Code Submission" : "Submitted Assessments"}
//       </button>
//       {showSubmissions ? <StudentAssessments assessments={assessments} /> : <CodeSubmission token={token} />}
//     </div>
//   );
// };

// StudentDashboard.propTypes = {
//   token: PropTypes.object.isRequired,
// };

// export default StudentDashboard;

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const StudentDashboard = ({ token }) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      <div className="col-span-3">
        <Link to="lp" state={{ token }}>
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:to-cyan-600 p-8 text-white rounded-md cursor-pointer">
            <img src="https://via.placeholder.com/40" alt="Learning Paths" className="mb-4 rounded-md" />
            <h2 className="text-2xl font-bold">Learning Paths</h2>
          </div>
        </Link>
      </div>
      {/* Add more tiles as needed */}
    </div>
  );
};

StudentDashboard.propTypes = {
  token: PropTypes.object.isRequired,
};

export default StudentDashboard;
