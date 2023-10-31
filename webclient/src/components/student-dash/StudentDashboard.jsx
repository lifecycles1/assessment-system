/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import CodeSubmission from "./CodeSubmission";
import StudentAssessments from "./StudentAssessments";

const StudentDashboard = ({ token }) => {
  const [showSubmissions, setShowSubmissions] = useState(false);
  const toggleView = () => setShowSubmissions((prevState) => !prevState);

  useEffect(() => {
    console.log("student dashboard token", token);
  }, [token]);

  return (
    <div className="relative bg">
      <h1 className="text-2xl font-semibold pl-10">Welcome, {token?.email.split("@")[0]}!</h1>
      <button onClick={toggleView} className="text-sm absolute top-5 right-5 py-1 px-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
        {showSubmissions ? "Code Submission" : "Submitted Assessments"}
      </button>
      {showSubmissions ? <StudentAssessments token={token} /> : <CodeSubmission token={token} />}
    </div>
  );
};

export default StudentDashboard;
