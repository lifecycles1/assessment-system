import PropTypes from "prop-types";
import AssessmentCard from "../common/AssessmentCard";

const StudentAssessments = ({ assessments }) => {
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

StudentAssessments.propTypes = {
  assessments: PropTypes.array.isRequired,
};

export default StudentAssessments;
