/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import AceEditor from "react-ace";
import axios from "axios";
import jwt_decode from "jwt-decode";

const CodeEditor = ({ question }) => {
  const [email, setEmail] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [javascriptCode, setJavascriptCode] = useState(`function solution(a) {\n// write your solution here\n}`);
  const [pythonCode, setPythonCode] = useState(`def solution(a):`);
  const [responseMessage, setResponseMessage] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const pythonIndentationMessage = "Python code must be indented with 6 spaces.";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setEmail(decoded.email);
    }
  }, []);

  const runTests = async () => {
    const codeToRun = selectedLanguage === "javascript" ? javascriptCode : pythonCode;
    const endpoint = selectedLanguage === "javascript" ? "jscode" : "pythonCode";
    setResponseMessage(null);
    setTestResults(null);
    try {
      const response = await axios.post(`https://europe-west2-code-assessment-401704.cloudfunctions.net/${endpoint}`, {
        code: codeToRun,
        question: question,
      });
      if (response.data.error) {
        setResponseMessage(response.data.error);
        return;
      }
      setTestResults(response.data);
    } catch (error) {
      setResponseMessage("Error running tests.");
    }
  };

  const submitCode = async () => {
    const codeToSubmit = selectedLanguage === "javascript" ? javascriptCode : pythonCode;
    const payload = {
      email: email,
      language: selectedLanguage,
      question: question,
      code: codeToSubmit,
    };
    try {
      const response = await axios.post("http://localhost:3000/submit-code", payload);
      setResponseMessage(response.data.message === "success" ? "Code submitted successfully!" : "Code submission failed.");
    } catch (error) {
      setResponseMessage("Error submitting code.");
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-100 rounded-md p-4 border border-gray-300 mx-auto w-[600px]">
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => setSelectedLanguage("javascript")} className={`px-4 py-1 rounded-full ${selectedLanguage === "javascript" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"}`}>
            JavaScript
          </button>
          <button onClick={() => setSelectedLanguage("python")} className={`px-4 py-1 rounded-full ${selectedLanguage === "python" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"}`}>
            Python
          </button>
          {selectedLanguage === "python" && <div className="text-sm text-gray-600">{pythonIndentationMessage}</div>}
        </div>
      </div>
      {selectedLanguage === "javascript" && <AceEditor mode={selectedLanguage} theme="monokai" onChange={(newCode) => setJavascriptCode(newCode)} value={javascriptCode} editorProps={{ $blockScrolling: true }} setOptions={{ useWorker: false }} width="100%" height="300px" />}
      {selectedLanguage === "python" && <AceEditor mode={selectedLanguage} theme="monokai" onChange={(newCode) => setPythonCode(newCode)} value={pythonCode} editorProps={{ $blockScrolling: true }} setOptions={{ useWorker: false, tabSize: 6 }} width="100%" height="300px" />}
      <div className="space-x-10">
        <button onClick={runTests} className="px-4 py-2 bg-blue-500 text-white rounded-full mt-4 hover:bg-blue-600">
          Run Tests
        </button>
        <button onClick={submitCode} className="px-4 py-2 bg-blue-500 text-white rounded-full mt-4 hover:bg-blue-600">
          Submit Code
        </button>
      </div>
      {responseMessage && <div className="mt-4 text-sm text-gray-600">{responseMessage}</div>}
      {testResults && (
        <div className="bg-gray-100 p-4 rounded-md border border-gray-300 mt-4">
          <div className={`font-semibold text-lg mb-2 ${testResults.isCorrect.every((result) => result) ? "text-green-600" : "text-red-600"}`}>{testResults.isCorrect.every((result) => result) ? "All Tests Passed" : "Tests Failed"}</div>
          <div className="h-[350px] overflow-x-auto overflow-y-auto">
            {testResults.inputs.map((input, index) => (
              <div key={index} className="mb-4 border p-4 rounded-md">
                <div className="font-semibold">Test Case {index + 1}:</div>
                <div className="mb-2 flex">
                  <div className="flex-1">
                    <div className={`font-semibold ${testResults.isCorrect[index] ? "text-green-600" : "text-red-600"}`}>Input:</div>
                    <div className="text-gray-700">{JSON.stringify(input)}</div>
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${testResults.isCorrect[index] ? "text-green-600" : "text-red-600"}`}>Output:</div>
                    <div className="text-gray-700">{JSON.stringify(testResults.outputs[index])}</div>
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${testResults.isCorrect[index] ? "text-green-600" : "text-red-600"}`}>Expected Output:</div>
                    <div className="text-gray-700">{JSON.stringify(testResults.expectedOutputs[index])}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
