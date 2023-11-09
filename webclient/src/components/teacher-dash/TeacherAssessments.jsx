import { useEffect, useState } from "react";
import axios from "axios";
import AssessmentCard from "../common/AssessmentCard";

const TeacherAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssessments = assessments.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const maxPageButtonsToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtonsToShow / 2));
  const endPage = Math.min(startPage + maxPageButtonsToShow - 1, Math.ceil(assessments.length / itemsPerPage));
  const pageButtons = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

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
    <div className="pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {currentAssessments.map((assessment) => (
          <AssessmentCard key={assessment._id} listType="teacher" assessment={assessment} setAssessments={setAssessments} />
        ))}
      </div>
      <div className="flex justify-center items-center space-x-3 mt-10">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="text-2xl text-neutral-200">
          &#8592;
        </button>
        {pageButtons.map((pageNumber) => (
          <button key={pageNumber} onClick={() => paginate(pageNumber)} className={`w-10 h-10 flex justify-center items-center px-4 py-2 rounded ${currentPage === pageNumber ? "bg-blue-200" : "bg-neutral-200"}`}>
            {pageNumber}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(assessments.length / itemsPerPage)} className="text-2xl text-neutral-200">
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default TeacherAssessments;
