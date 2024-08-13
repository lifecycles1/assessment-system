import AssessmentCard from "../common/AssessmentCard";
import { useGetStudentAssessmentsQuery } from "../../features/assessments/assessmentsApiSlice";
import useAuth from "../../hooks/useAuth";

const StudentAssessments = () => {
  const { decoded } = useAuth();
  const { data: assessments, error } = useGetStudentAssessmentsQuery({ email: decoded.email });

  return (
    <div className="bg-gray-800 h-[calc(100vh-48px)] overflow-y-auto">
      <h2 className="text-2xl text-center font-semibold mb-4 text-neutral-200">Your Assessments</h2>
      {error && (
        <div className="text-red-500 text-center">
          <span>{error.status} : </span>
          {error.data?.message || "An error occurred. Please try again later."}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-20">
        {assessments?.map((assessment) => (
          <AssessmentCard key={assessment._id} assessment={assessment} />
        ))}
      </div>
    </div>
  );
};

export default StudentAssessments;
