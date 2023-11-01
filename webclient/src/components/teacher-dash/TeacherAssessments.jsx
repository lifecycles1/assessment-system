/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import AssessmentCard from "../common/AssessmentCard";

const TeacherAssessments = () => {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    // Fetch all student's assessments with a "pending" status
    const fetchAssessments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/teacher-assessments");
        setAssessments(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAssessments();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
      {assessments.map((assessment) => (
        <AssessmentCard key={assessment._id} listType="teacher" assessment={assessment} setAssessments={setAssessments} />
      ))}
    </div>
  );
};

export default TeacherAssessments;
