import { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import FileUpload from "./FileUpload";
import Question from "./Question";
import axios from "axios";

const CodeSubmission = () => {
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
    <div className="p-4 -mt-10">
      <h2 className="text-2xl font-semibold mb-4 ml-96 text-center">Code Submission</h2>
      <div className="mb-4">
        <div className="flex items-center justify-center ml-96">
          <button onClick={() => setUseCodeEditor(true)} className={`mr-4 px-4 py-2 rounded-full ${useCodeEditor ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"}`}>
            Code Editor
          </button>
          <div>or</div>
          <button onClick={() => setUseCodeEditor(false)} className={`ml-4 px-4 py-2 rounded-full ${!useCodeEditor ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"}`}>
            File Upload
          </button>
        </div>
      </div>
      <div className="flex">
        {/* Left half */}
        <div className="w-1/2 border border-gray-300 rounded-md">
          <Question question={question} />
        </div>
        {/* Right half */}
        <div className="w-1/2 text-center">{useCodeEditor ? <CodeEditor question={question} /> : <FileUpload question={question} />}</div>
      </div>
    </div>
  );
};

export default CodeSubmission;
