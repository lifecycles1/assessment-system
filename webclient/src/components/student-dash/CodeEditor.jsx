/* eslint-disable react/prop-types */
import { useState } from "react";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import AceEditor from "react-ace";
import axios from "axios";

const CodeEditor = ({ token, question }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [javascriptCode, setJavascriptCode] = useState(`function solution(a) {\n// write your solution here\n}`);
  const [pythonCode, setPythonCode] = useState(`def solution(a):`);
  const [responseMessage, setResponseMessage] = useState(null);
  const [testResults, setTestResults] = useState(null);

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
    setResponseMessage(null);
    const codeToSubmit = selectedLanguage === "javascript" ? javascriptCode : pythonCode;
    const payload = {
      email: token.email,
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

  const scrollToTestResults = () => {
    window.scroll({
      top: window.scrollY + 400,
      behavior: "smooth",
    });
  };

  return (
    <div className="rounded-md p-4 border border-gray-300 mx-auto w-[600px] bg-[#272822]">
      <div className="mb-4 -mt-4">
        <div className="flex items-center space-x-4 py-4 -mb-4 text-sm">
          <button onClick={() => setSelectedLanguage("javascript")} className={`px-2 py-1 rounded border border-[#0a0a0a] text-gray-300 ${selectedLanguage === "javascript" ? "bg-[#1a1a1a]" : "bg-[#272822] hover:bg-[#1a1a1a]"}`}>
            JavaScript
          </button>
          <button onClick={() => setSelectedLanguage("python")} className={`px-2 py-1 rounded border border-[#0a0a0a] text-gray-300 ${selectedLanguage === "python" ? "bg-[#1a1a1a]" : "bg-[#272822] hover:bg-[#1a1a1a]"}`}>
            Python
          </button>
        </div>
      </div>
      {selectedLanguage === "javascript" && <AceEditor mode={selectedLanguage} theme="monokai" onChange={(newCode) => setJavascriptCode(newCode)} value={javascriptCode} editorProps={{ $blockScrolling: true }} setOptions={{ useWorker: false }} width="100%" height="300px" />}
      {selectedLanguage === "python" && <AceEditor mode={selectedLanguage} theme="monokai" onChange={(newCode) => setPythonCode(newCode)} value={pythonCode} editorProps={{ $blockScrolling: true }} setOptions={{ useWorker: false }} width="100%" height="300px" />}
      <div className="flex justify-center items-center space-x-12 text-sm border-t border-b border-blue-200/40 py-1">
        <button onClick={submitCode} className="px-2 py-1 bg-[#23776d] text-white rounded hover:bg-[#14756a]">
          Submit Code
        </button>
        <button onClick={runTests} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          Run Tests
        </button>
        {testResults && (
          <div onClick={scrollToTestResults} className="relative cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#807e7e" className="w-4 -ml-11">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        )}
      </div>
      {responseMessage && <div className={`mt-4 text-sm ${responseMessage.includes("successfully") ? "text-[#23776d]" : "text-red-400"}`}>{responseMessage}</div>}
      {testResults && (
        <div className="px-4 py-2 rounded-b-md bg-[#272822]">
          <div className={`font-semibold text-lg mb-2 ${testResults.isCorrect.every((result) => result) ? "text-[#23776d]" : "text-red-400"}`}>{`Tests Passed: ${testResults.isCorrect.filter((result) => result).length}/${testResults.isCorrect.length}`}</div>
          <div className="h-[350px] overflow-y-auto">
            {testResults.inputs.map((input, index) => (
              <div key={index} className="mb-4 border p-4 rounded-md overflow-x-auto">
                <div className="flex px-4 justify-between">
                  <div className="font-semibold text-gray-400">Test Case {index + 1}:</div>
                  <div className={`${testResults.isCorrect[index] ? "text-[#46c3b4]" : "text-red-400"}`}>{testResults.isCorrect[index] ? "Passed ✓" : "Wrong answer ✗"}</div>
                </div>
                <div className="mb-2 flex break-all space-x-10 text-neutral-200">
                  <div className="flex-1">
                    <div className="">Input:</div>
                    <div className="font-semibold">{JSON.stringify(input)}</div>
                  </div>
                  <div className="flex-1">
                    <div className="">Output:</div>
                    <div className="font-semibold">{JSON.stringify(testResults.outputs[index])}</div>
                  </div>
                  <div className="flex-1">
                    <div className="">Expected Output:</div>
                    <div className="font-semibold">{JSON.stringify(testResults.expectedOutputs[index])}</div>
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
