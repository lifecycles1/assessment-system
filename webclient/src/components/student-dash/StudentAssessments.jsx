import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const StudentAssessments = () => {
  const [email, setEmail] = useState(null);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setEmail(decoded.email);
    }
  }, []);

  const fetchAssessments = async () => {
    if (!email) return;
    try {
      const response = await axios.get(`http://localhost:3000/student-assessments/${email}`);
      setAssessments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [email]);

  return (
    <div>
      <h2 className="text-2xl text-center font-semibold mb-4">Your Assessments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-20 border">
        {assessments.map((assessment, index) => (
          <div key={index} className="bg-white border-r rounded-lg shadow-lg p-4 hover:shadow-xl transition-transform transform hover:scale-105">
            {assessment.fileUrl ? (
              <a href={assessment.fileUrl} className="block">
                <div className="text-lg font-semibold mt-2">{assessment.fileName}</div>
                <div>Status: {assessment.status}</div>
                {assessment.evaluation && (
                  <div>
                    <div>Grade: {assessment.evaluation.grade}</div>
                    <div>Feedback: {assessment.evaluation.feedback}</div>
                  </div>
                )}
              </a>
            ) : (
              <div>
                <div className="text-lg font-semibold">{assessment.language} Code Assessment</div>
                <div>Created At: {assessment.createdAt}</div>
                <div>Status: {assessment.status}</div>
                {assessment.evaluation && (
                  <div>
                    <div>Grade: {assessment.evaluation.grade}</div>
                    <div>Feedback: {assessment.evaluation.feedback}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAssessments;
