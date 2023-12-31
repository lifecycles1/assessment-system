import PropTypes from "prop-types";
import { useState } from "react";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import AceEditor from "react-ace";
import axios from "axios";
import LoadingButton from "../common/LoadingButton";

const CodeEditor = ({ token, question }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [javascriptCode, setJavascriptCode] = useState(`function solution(a) {\n// write your solution here\n}`);
  const [pythonCode, setPythonCode] = useState(`def solution(a):`);
  const [responseMessage, setResponseMessage] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [loadingSubmitBtn, setLoadingSubmitBtn] = useState(false);
  const [loadingTestsBtn, setLoadingBtn] = useState(false);

  const runTests = async () => {
    setLoadingBtn(true);
    const codeToRun = selectedLanguage === "javascript" ? javascriptCode : pythonCode;
    const endpoint = selectedLanguage === "javascript" ? "jsCode" : "pythonCode";
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
    } finally {
      setLoadingBtn(false);
    }
  };

  const submitCode = async () => {
    setLoadingSubmitBtn(true);
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
    } finally {
      setLoadingSubmitBtn(false);
    }
  };

  const scrollToTestResults = () => {
    window.scroll({
      top: window.scrollY + 400,
      behavior: "smooth",
    });
  };

  return (
    <div className="rounded-md p-4 mx-auto w-[600px]">
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
        <LoadingButton type="button" onClick={submitCode} loading={loadingSubmitBtn} className="w-[97px] px-2 py-1 bg-[#23776d] text-white rounded hover:bg-[#14756a]" text="Submit Code" />
        <LoadingButton type="button" onClick={runTests} loading={loadingTestsBtn} className="w-[74px] px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" text="Run Tests" />
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
        <div className="px-4 py-2 rounded-b-md bg-gray-800">
          <div className={`font-semibold text-lg mb-2 ${testResults.isCorrect.every((result) => result) ? "text-[#23776d]" : "text-red-400"}`}>{`Tests Passed: ${testResults.isCorrect.filter((result) => result).length}/${testResults.isCorrect.length}`}</div>
          <div className="h-[350px] overflow-y-auto">
            {testResults.inputs.map((input, index) => (
              <div key={index} className="mb-4 border p-4 rounded-md overflow-x-auto">
                <div className="flex px-4 justify-between">
                  <div className="font-semibold text-gray-400">Test Case {index + 1}:</div>
                  <div className="flex items-center text-neutral-500">
                    <span className="mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </span>
                    {testResults.executionTimes[index].toFixed(3)} ms
                  </div>
                  <div className="flex items-center text-neutral-500">
                    <span className="mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                        />
                      </svg>
                    </span>
                    {(testResults.memoryUsages[index] / 1024 / 1024).toFixed(4)} MB
                  </div>
                  <div className={`${testResults.isCorrect[index] ? "text-[#46c3b4]" : "text-red-400"}`}>{testResults.isCorrect[index] ? "Passed ✓" : "Wrong answer ✗"}</div>
                </div>
                {testResults.logs[0].length !== 0 && (
                  <div className="mb-4 flex flex-col items-center">
                    <div className="text-gray-400">Console Output:</div>
                    <div className="text-neutral-200 font-semibold mb-4 whitespace-pre-line break-all">{testResults.logs[index].join("\n")}</div>
                    <div className="w-48 border-b"></div>
                  </div>
                )}
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

CodeEditor.propTypes = {
  token: PropTypes.object.isRequired,
  question: PropTypes.object,
};

export default CodeEditor;
