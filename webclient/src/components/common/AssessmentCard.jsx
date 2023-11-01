import PropTypes from "prop-types";
import { useState } from "react";
import TruncateFeedback from "./TruncateFeedback";
import DisplayTestsModal from "../teacher-dash/DisplayTestsModal";
import ViewCodeModal from "./ViewCodeModal";
import ViewQuestionModal from "./ViewQuestionModal";
import axios from "axios";

const AssessmentCard = ({ listType, assessment, setAssessments }) => {
  // modal for running tests
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [testResponseMessage, setTestResponseMessage] = useState(null);
  // modal for viewing question
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  // modal for viewing code of code submissions
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  // update status, grade and feedback
  const [status, setStatus] = useState("pending");
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  // loading state for "Test" button
  const [loading, setLoading] = useState(false);

  const viewCode = (code) => {
    setSelectedCode(code);
    setIsCodeModalOpen(true);
  };

  const viewQuestion = (question) => {
    setSelectedQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const runTest = async (type, submission, question, language) => {
    setTestResponseMessage(null);
    setLoading(true);

    try {
      let response;
      if (type === "file") {
        const endpoint = language === "javascript" ? "jsFile" : "pythonFile";
        response = await axios.post(`https://europe-west2-code-assessment-401704.cloudfunctions.net/${endpoint}`, { fileUrl: submission, question });
      } else if (type === "code") {
        const endpoint = language === "javascript" ? "jscode" : "pythonCode";
        response = await axios.post(`https://europe-west2-code-assessment-401704.cloudfunctions.net/${endpoint}`, { code: submission, question });
      }
      if (response.data.error) {
        setTestResponseMessage(response.data.error);
      }
      setModalData(response.data);
      setIsModalOpen(true);
    } catch (error) {
      setTestResponseMessage("Error running tests.");
    } finally {
      setLoading(false);
    }
  };

  const updateAssessment = async (assessment) => {
    setResponseMessage(null);
    const { _id, fileUrl, evaluation } = assessment;

    let type;
    if (fileUrl) {
      type = "file";
    } else {
      type = "code";
    }

    const updatedFields = {
      type,
      status,
      ...(grade !== undefined && { grade: grade || evaluation.grade }),
      ...(feedback !== undefined && { feedback: feedback || evaluation.feedback }),
    };

    try {
      await axios.put(`http://localhost:3000/teacher-assessments/mark/${_id}`, updatedFields);

      // if teacher marks assessment as "completed", filtering out the updated assessment from the UI state will be sufficient
      // because the backend doesn't return assessments with a "completed" status
      if (status === "completed") setAssessments((assessments) => assessments.filter((a) => a._id !== _id));
      else setResponseMessage("Assessment updated.");
    } catch (error) {
      setResponseMessage("Error updating assessment.");
    }
  };
  return (
    <>
      {listType === "teacher" ? (
        <>
          <div key={assessment._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 mx-4 border border-gray-300">
            <div className="p-4 border-r relative">
              {assessment.fileUrl ? (
                //  teacher's view of file submissions
                <>
                  <div className="flex justify-between">
                    <div>Student Email: {assessment.email}</div>
                    <div className="text-sm italic">file submission</div>
                  </div>
                  <div className="flex justify-between my-2">
                    <div className="text-sm">date of submission: {new Date(assessment.createdAt).toLocaleString()}</div>
                    <div className="italic">{assessment.language}</div>
                  </div>
                  <div className="space-x-4 text-sm">
                    <button onClick={() => window.open(assessment.fileUrl, "_blank")} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View File
                    </button>
                    <button onClick={() => viewQuestion(assessment.question)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View Question
                    </button>
                    <button onClick={() => runTest("file", assessment.fileUrl, assessment.question, assessment.language)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      {loading ? "Testing..." : "Test"}
                    </button>
                  </div>
                </>
              ) : (
                // teacher's view of code submissions
                <>
                  <div className="flex justify-between">
                    <div>Student Email: {assessment.email}</div>
                    <div className="text-sm italic">code submission</div>
                  </div>
                  <div className="flex justify-between my-2">
                    <div className="text-sm">date of submission: {new Date(assessment.createdAt).toLocaleString()}</div>
                    <div className="italic">{assessment.language}</div>
                  </div>
                  <div className="space-x-4 text-sm">
                    <button onClick={() => viewCode(assessment.code)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View Code
                    </button>
                    <button onClick={() => viewQuestion(assessment.question)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View Question
                    </button>
                    <button onClick={() => runTest("code", assessment.code, assessment.question, assessment.language)} className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      {loading ? "Testing..." : "Test"}
                    </button>
                  </div>
                </>
              )}
            </div>
            {/* teachers view - update/view status, grade and feedback for both type submissions (file and code) */}
            <div className="pb-4 px-4">
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-10 text-sm">
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="grow p-2 border border-gray-300 rounded">
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <input value={grade} onChange={(e) => setGrade(e.target.value)} type="text" placeholder="Grade" className="grow p-2 border border-gray-300 rounded" />
                </div>
                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Feedback" className="text-sm p-2 border border-gray-300 rounded resize-none" rows="4" />
                {assessment.evaluation && (
                  <div className="mt-4 pt-2">
                    <div className="flex space-x-2 items-center">
                      <div className="text-sm font-semibold">Grade: </div>
                      <div>{assessment.evaluation.grade}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Feedback:</div>
                      <TruncateFeedback text={assessment.evaluation.feedback} maxWords={80} />
                    </div>
                  </div>
                )}
                {responseMessage && <div className={`text-sm text-end ${responseMessage.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>{responseMessage}</div>}
                <button onClick={() => updateAssessment(assessment)} className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Save
                </button>
              </div>
            </div>
          </div>
          {isModalOpen && <DisplayTestsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} responseData={modalData} errorMessage={testResponseMessage} />}
          {isQuestionModalOpen && <ViewQuestionModal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} question={selectedQuestion} />}
          {isCodeModalOpen && <ViewCodeModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} code={selectedCode} />}
        </>
      ) : (
        // listType === "student"
        <>
          <div key={assessment._id} className="bg-white border-r rounded-lg shadow-lg p-4 hover:shadow-xl transition-transform transform hover:scale-105">
            {assessment.fileUrl ? (
              // student's view of file submissions
              <div className="block">
                <div className="flex justify-between my-2">
                  <div className=" font-semibold">{assessment.question.name}</div>
                  <div className="text-sm italic">file submission</div>
                </div>
                <div className="flex justify-between my-2">
                  <div className="text-sm">date of submission: {new Date(assessment.createdAt).toLocaleString()}</div>
                  <div className="italic">{assessment.language}</div>
                </div>
                <div className="flex justify-between mt-4">
                  <div className="text-sm">Status: {assessment.status}</div>
                  <div className="space-x-3">
                    <button onClick={() => viewQuestion(assessment.question)} className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View Question
                    </button>
                    <button onClick={() => window.open(assessment.fileUrl, "_blank")} className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View File
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // student's view of code submissions
              <>
                <div className="flex justify-between my-2">
                  <div className="font-semibold">{assessment.question.name}</div>
                  <div className="text-sm italic">code submission</div>
                </div>
                <div className="flex justify-between my-2">
                  <div className="text-sm">date of submission: {new Date(assessment.createdAt).toLocaleString()}</div>
                  <div className="italic">{assessment.language}</div>
                </div>
                <div className="flex justify-between mt-4">
                  <div className="text-sm">Status: {assessment.status}</div>
                  <div className="space-x-3">
                    <button onClick={() => viewQuestion(assessment.question)} className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View Question
                    </button>
                    <button onClick={() => viewCode(assessment.code)} className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View Code
                    </button>
                  </div>
                </div>
              </>
            )}
            {/* student's view - view status, grade and feedback for both type submissions (file and code).
            student can't see their grade and feedback until the teacher marks the assessment as "completed",
            because teacher could've added a grade or a feedback without yet changing the status to "completed" */}
            {assessment.status !== "pending" && assessment.evaluation && (
              <div className="mt-4 border-t pt-2 border-neutral-400">
                <div className="flex space-x-2 items-center">
                  <div className="text-sm font-semibold">Grade: </div>
                  <div className="">{assessment.evaluation.grade}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Feedback:</div>
                  <TruncateFeedback text={assessment.evaluation.feedback} maxWords={80} />
                </div>
              </div>
            )}
          </div>
          {isQuestionModalOpen && <ViewQuestionModal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} question={selectedQuestion} />}
          {isCodeModalOpen && <ViewCodeModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} code={selectedCode} />}
        </>
      )}
    </>
  );
};

AssessmentCard.propTypes = {
  listType: PropTypes.string,
  assessment: PropTypes.object.isRequired,
  setAssessments: PropTypes.func,
};

export default AssessmentCard;
