import { useEffect, useState } from "react";
import AssessmentCard from "../common/AssessmentCard";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const StudentAssessments = () => {
  const { decoded } = useAuth();
  const [assessments, setAssessments] = useState(null);

  useEffect(() => {
    if (!decoded) return;
    const fetchAssessments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/student-assessments/${decoded.email}`);
        setAssessments(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAssessments();
  }, [decoded]);

  return (
    <div className="bg-gray-800 h-[calc(100vh-48px)] overflow-y-auto">
      <h2 className="text-2xl text-center font-semibold mb-4 text-neutral-200">Your Assessments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-20">
        {assessments?.map((assessment) => (
          <AssessmentCard key={assessment._id} assessment={assessment} />
        ))}
      </div>
    </div>
  );
};

export default StudentAssessments;
