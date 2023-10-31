/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import AssessmentCard from "../common/AssessmentCard";

const StudentAssessments = ({ token }) => {
  const [assessments, setAssessments] = useState([]);

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
  }, [token.email]);

  return (
    <div>
      <h2 className="text-2xl text-center font-semibold mb-4">Your Assessments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-20 border">
        {assessments.map((assessment) => (
          <AssessmentCard key={assessment._id} assessment={assessment} />
        ))}
      </div>
    </div>
  );
};

export default StudentAssessments;
