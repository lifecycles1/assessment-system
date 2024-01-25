import { useEffect, useState } from "react";
import AssessmentCard from "../common/AssessmentCard";
import axios from "axios";
import { useAuth } from "../../hooks/useAuthContext";

const StudentAssessments = () => {
  const { token } = useAuth();
  const [assessments, setAssessments] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchAssessments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/student-assessments/${token.email}`);
        setAssessments(response.data);
        console.log("response", response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAssessments();
  }, [token]);

  return (
    <div>
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
