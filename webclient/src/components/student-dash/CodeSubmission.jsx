import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import FileUpload from "./FileUpload";
import Question from "./Question";
import axios from "axios";

const CodeSubmission = ({ token }) => {
  const [useCodeEditor, setUseCodeEditor] = useState(true);
  const [question, setQuestion] = useState(null);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get("http://localhost:3000/question");
      setQuestion(response.data);
    } catch (error) {
      console.error("Error fetching question and examples:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  return (
    <div className="p-4">
      {/* <h2 className="text-xl font-semibold mb-4 ml-96 text-center text-neutral-200">Code Submission</h2> */}
      <div className="mb-4">
        <div className="flex items-center justify-center ml-96 text-sm">
          <button onClick={() => setUseCodeEditor(true)} className={`mr-4 px-2 py-1 rounded ${useCodeEditor ? "bg-blue-600 text-white" : "bg-blue-200 text-gray-600 hover:bg-blue-500 hover:text-gray-200"}`}>
            Code Editor
          </button>
          <div className="text-neutral-200">or</div>
          <button onClick={() => setUseCodeEditor(false)} className={`ml-4 px-2 py-1 rounded ${!useCodeEditor ? "bg-blue-600 text-white" : "bg-blue-200 text-gray-600 hover:bg-blue-500 hover:text-gray-200"}`}>
            File Upload
          </button>
        </div>
      </div>
      <div className="flex">
        {/* Left half */}
        <div className="w-1/2 border border-gray-300 rounded-md bg-white">
          <Question question={question} />
        </div>
        {/* Right half */}
        <div className="w-1/2 text-center">{useCodeEditor ? <CodeEditor token={token} question={question} /> : <FileUpload token={token} question={question} />}</div>
      </div>
    </div>
  );
};

CodeSubmission.propTypes = {
  token: PropTypes.object.isRequired,
};

export default CodeSubmission;
