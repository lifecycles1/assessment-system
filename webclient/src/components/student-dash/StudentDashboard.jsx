import { useEffect, useState } from "react";
import CodeSubmission from "./CodeSubmission";
import StudentAssessments from "./StudentAssessments";
import jwt_decode from "jwt-decode";

const StudentDashboard = () => {
  const [email, setEmail] = useState(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const toggleView = () => setShowSubmissions((prevState) => !prevState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setEmail(decoded.email);
    }
  }, []);

  return (
    <div className="relative">
      {email && <h1 className="text-2xl font-semibold">Welcome, {email.split("@")[0]}!</h1>}
      <button onClick={toggleView} className="absolute top-5 right-5 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
        {showSubmissions ? "Code Submission" : "Submitted Assessments"}
      </button>
      {showSubmissions ? <StudentAssessments /> : <CodeSubmission />}
    </div>
  );
};

export default StudentDashboard;
