import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AssessmentCard from "../common/AssessmentCard";

const TeacherAssessments = () => {
  // // pagination
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 4;
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentAssessments = assessments.slice(indexOfFirstItem, indexOfLastItem);
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // const maxPageButtonsToShow = 5;
  // const startPage = Math.max(1, currentPage - Math.floor(maxPageButtonsToShow / 2));
  // const endPage = Math.min(startPage + maxPageButtonsToShow - 1, Math.ceil(assessments.length / itemsPerPage));
  // const pageButtons = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  const [assessments, setAssessments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    // Fetch all student's assessments with a "pending" status
    const fetchAssessments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teacher-assessments?page=${page}`);
        if (response.data.length > 0) {
          // instead of normally spreading the response data with prev, we filter out any duplicates
          // because of the double execution of useEffect in StrictMode on initial render
          setAssessments((prev) => [...prev, ...response.data.filter((assessment) => !prev.some((prevAssessment) => prevAssessment._id === assessment._id))]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAssessments();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const currentLoaderRef = loaderRef.current;

    if (currentLoaderRef) observer.observe(currentLoaderRef);

    return () => {
      if (currentLoaderRef) observer.unobserve(currentLoaderRef);
    };
  }, [hasMore]);
  return (
    <div className="bg-gray-800 p-4 pb-6 h-[calc(100vh-48px)] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map((assessment) => (
          <AssessmentCard key={assessment._id} listType="teacher" assessment={assessment} setAssessments={setAssessments} />
        ))}
      </div>
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center items-center mt-10">
          <div className="w-6 h-6 border-t-2 border-gray-200 animate-spin rounded-full"></div>
        </div>
      )}
      {/* <div className="flex justify-center items-center space-x-3 mt-10">
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
      </div> */}
    </div>
  );
};

export default TeacherAssessments;
