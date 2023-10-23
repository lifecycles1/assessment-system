import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import DisplayTestsModal from "./DisplayTestsModal";
import QuestionModal from "./QuestionModal";
import ViewCodeModal from "./ViewCodeModal";

const TeacherAssessments = () => {
  const [role, setRole] = useState(null); // ["student", "teacher"]
  const [assessments, setAssessments] = useState([]);
  // modal for running tests
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState("");
  // modal for viewing question
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [selectedExample, setSelectedExample] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  // modal for viewing code of code submissions
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  const viewQuestion = (question, example) => {
    setSelectedQuestion(question);
    setSelectedExample(example);
    setIsQuestionModalOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setRole(decoded.role);
    }
  }, []);

  useEffect(() => {
    if (role !== "teacher") return;
    // Fetch all student's assessments with a "pending" status
    const fetchAssessments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/teacher-assessments");
        const initialAssessments = response.data.map((assessment) => ({
          ...assessment,
          loading: false,
        }));
        setAssessments(initialAssessments);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAssessments();
  }, [role]);

  const runTest = async (type, submission, question, language, index) => {
    setResponseMessage(null);
    // Create a copy of the assessments array to modify the loading state
    // so that only the clicked "Test" button displays a loading state while the test is running
    // instead of all "Test" buttons displaying a loading state
    const updatedAssessments = [...assessments];
    updatedAssessments[index].loading = true;
    setAssessments(updatedAssessments);

    try {
      let response;
      if (type === "file") {
        const data = { fileUrl: submission, question };
        response = await axios.post(`https://europe-west2-code-assessment-401704.cloudfunctions.net/jsFile`, data);
      } else if (type === "code") {
        const endpoint = language === "javascript" ? "jscode" : "pythonCode";
        response = await axios.post(`https://europe-west2-code-assessment-401704.cloudfunctions.net/${endpoint}`, {
          code: submission,
          question,
        });
      }
      console.log(response.data);
      if (response.data.error) {
        setResponseMessage(response.data.error);
      }
      setModalData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      setResponseMessage("Error running tests.");
    } finally {
      updatedAssessments[index].loading = false;
      setAssessments(updatedAssessments);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {assessments.map((assessment, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 mx-4 border border-gray-300">
            <div className="p-4 border-r relative">
              {assessment.fileUrl ? (
                <div>
                  <div className="flex justify-between">
                    <div>Student Email: {assessment.email}</div>
                    <div className="text-sm italic">file submission</div>
                  </div>
                  <div className="flex justify-between my-2">
                    <div className="text-sm">date of submission: {new Date(assessment.createdAt).toLocaleString()}</div>
                    <div className="italic">{assessment.language}</div>
                  </div>
                  {assessment.evaluation && (
                    <div>
                      <div>Grade: {assessment.evaluation.grade}</div>
                      <div>Feedback: {assessment.evaluation.feedback}</div>
                    </div>
                  )}
                  <div className="space-x-20">
                    <button onClick={() => window.open(assessment.fileUrl, "_blank")} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      View File
                    </button>
                    <button onClick={() => viewQuestion(assessment.question.question, assessment.question.example)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      View Question
                    </button>
                    <button onClick={() => runTest("file", assessment.fileUrl, assessment.question, assessment.language, index)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      {assessment.loading ? "Testing..." : "Test"}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between">
                    <div>Student Email: {assessment.email}</div>
                    <div className="text-sm italic">code submission</div>
                  </div>
                  <div className="flex justify-between my-2">
                    <div className="text-sm">date of submission: {new Date(assessment.createdAt).toLocaleString()}</div>
                    <div className="italic">{assessment.language}</div>
                  </div>
                  {assessment.evaluation && (
                    <div>
                      <div>Grade: {assessment.evaluation.grade}</div>
                      <div>Feedback: {assessment.evaluation.feedback}</div>
                    </div>
                  )}
                  <div className="space-x-20">
                    <button
                      onClick={() => {
                        setSelectedCode(assessment.code);
                        setIsCodeModalOpen(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      View Code
                    </button>
                    <button onClick={() => viewQuestion(assessment.question.question, assessment.question.example)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      View Question
                    </button>
                    <button onClick={() => runTest("code", assessment.code, assessment.question, assessment.language, index)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      {assessment.loading ? "Testing..." : "Test"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-10">
                  <select className="grow p-2 border border-gray-300 rounded-md">
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <input type="text" placeholder="Grade" className="grow p-2 border border-gray-300 rounded-md" />
                </div>
                <textarea placeholder="Feedback" className="p-2 border border-gray-300 rounded-md resize-none" rows="4" />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && <DisplayTestsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} responseData={modalData} errorMessage={responseMessage} />}
      {isQuestionModalOpen && <QuestionModal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} question={selectedQuestion} example={selectedExample} />}
      {isCodeModalOpen && <ViewCodeModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} code={selectedCode} />}
    </div>
  );
};

export default TeacherAssessments;
