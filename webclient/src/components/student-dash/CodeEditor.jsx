import PropTypes from "prop-types";
import { useRef, useState } from "react";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import AceEditor from "react-ace";
import axios from "axios";
import LoadingButton from "../common/LoadingButton";
import useAuth from "../../hooks/useAuth";

const CodeEditor = ({ data }) => {
  const { decoded } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const paramNames = extractParameters(data.challenge.question, data.challenge.example);
  const paramArray = paramNames.split(",");
  const savedJavascriptCode = data.challenge.challengeProgress?.code.find((code) => code.language === "javascript")?.code;
  const savedPythonCode = data.challenge.challengeProgress?.code.find((code) => code.language === "python")?.code;
  const [javascriptCode, setJavascriptCode] = useState(savedJavascriptCode || `function solution(${paramNames}) {\n// write your solution here\n}`);
  const [pythonCode, setPythonCode] = useState(savedPythonCode || `def solution(${paramNames}):`);
  const [responseMessage, setResponseMessage] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [loadingSubmitBtn, setLoadingSubmitBtn] = useState(false);
  const [loadingTestsBtn, setLoadingBtn] = useState(false);
  // resize refs for tests slide-up bar
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  const testsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const runTests = async () => {
    setLoadingBtn(true);
    setResponseMessage(null);
    setTestResults(null);

    try {
      // run tests
      const codeToRun = selectedLanguage === "javascript" ? javascriptCode : pythonCode;
      const endpoint = selectedLanguage === "javascript" ? "jsCode" : "pythonCode";
      const response = await axios.post(`https://europe-west2-code-assessment-401704.cloudfunctions.net/${endpoint}`, {
        code: codeToRun,
        question: data.challenge,
      });
      if (response.data.error) {
        setResponseMessage(response.data.error);
        return;
      }
      // set height to expand initial hight by a few pixels to indicate tests are expandable
      setIsDragging(true); // workaround to temporary use the same state variable: allow resizing to auto expand tests bar if not run yet
      if (testsRef.current.clientHeight < 40) {
        dragRef.current.style.top = `${containerRef.current.clientHeight - 36 - dragRef.current.offsetHeight / 2 - 80}px`;
        testsRef.current.style.height = "80px";
      }

      setTestResults(response.data);
      return response.data;
    } catch (error) {
      setResponseMessage("Error running tests.");
    } finally {
      setIsDragging(false);
      setLoadingBtn(false);
    }
  };

  const submitCode = async () => {
    setLoadingSubmitBtn(true);
    try {
      // run tests first to make sure code is correct
      const results = await runTests();
      // if any of the tests failed, don't submit/save code to database
      if (!results.isCorrect.every((result) => result)) {
        setResponseMessage("Please make sure all tests pass before submitting.");
        return;
      }
      const codeToSubmit = selectedLanguage === "javascript" ? javascriptCode : pythonCode;
      // submit-assessment endpoint temporarily deprecated
      const endpoint = data.challenge.type === "learningPath" ? "submit-pathChallenge" : "submit-assessment";
      const payload =
        data.challenge.type === "learningPath"
          ? // learning path challenge
            {
              userId: decoded.id,
              pathProgressId: data.pathProgressId,
              challengeId: data.challenge._id,
              language: selectedLanguage,
              code: codeToSubmit,
            }
          : // assessment challenge
            {
              email: decoded.email,
              language: selectedLanguage,
              question: data.challenge,
              code: codeToSubmit,
            };
      // deployed version - http://localhost:8080/ replaced with /api/ (see dispatch.yaml)
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/${endpoint}`, payload);
      setResponseMessage(response.data.message === "success" ? "Code submitted successfully!" : "Code submission failed.");
    } catch (error) {
      setResponseMessage("Error submitting code.");
      console.error(error);
    } finally {
      setLoadingSubmitBtn(false);
    }
  };

  // resize tests
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseDown = (e) => {
    e.preventDefault(); // prevent text selection while resizing
    if (!testResults) return; // don't allow resizing if tests haven't been run yet
    setIsDragging(true);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const drag = dragRef.current;
    // Adjust the position of the drag handle with e.clientY and constrain it within the container
    const dragPos = e.clientY - 36.5 - drag.offsetHeight / 2;
    const minPos = containerRef.current.clientHeight - 69.5 - drag.offsetHeight / 2; // closed
    const maxPos = 36.5 - drag.offsetHeight / 2;
    drag.style.top = `${Math.min(Math.max(dragPos, maxPos), minPos)}px`;
    // add/remove height to tests slide up bar height - min 36
    testsRef.current.style.height = `${Math.max(containerRef.current.clientHeight - e.clientY, 36)}px`;
  };

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className="h-[100%] flex flex-col relative">
      {/* top bar - language buttons */}
      <div className="h-[36px] bg-[#272822] px-4 flex items-center">
        <div className="flex flex-1">
          <div className="flex-1">
            <button onClick={() => setSelectedLanguage("javascript")} className={`px-2 rounded border border-[#0a0a0a] text-gray-300 ${selectedLanguage === "javascript" ? "bg-[#1a1a1a]" : "bg-[#272822] hover:bg-[#1a1a1a]"}`}>
              JavaScript
            </button>
          </div>
          <div className="flex-grow">
            <button onClick={() => setSelectedLanguage("python")} className={`px-2 rounded border border-[#0a0a0a] text-gray-300 ${selectedLanguage === "python" ? "bg-[#1a1a1a]" : "bg-[#272822] hover:bg-[#1a1a1a]"}`}>
              Python
            </button>
          </div>
        </div>
        <div className="flex-grow text-right"></div>
      </div>
      {/* editor - code editor */}
      <div className="flex-grow relative">
        {selectedLanguage === "javascript" ? (
          <AceEditor style={{ height: "100%", width: "100%" }} mode={selectedLanguage} theme="monokai" onChange={(newCode) => setJavascriptCode(newCode)} value={javascriptCode} editorProps={{ $blockScrolling: true }} setOptions={{ useWorker: false }} />
        ) : selectedLanguage === "python" ? (
          <AceEditor style={{ height: "100%", width: "100%" }} mode={selectedLanguage} theme="monokai" onChange={(newCode) => setPythonCode(newCode)} value={pythonCode} editorProps={{ $blockScrolling: true }} setOptions={{ useWorker: false }} />
        ) : null}
      </div>
      {/* drag bar - draggable bar to resize slide-up bar */}
      <div ref={dragRef} onMouseDown={handleMouseDown} className="z-10 absolute bottom-[65px] left-1/2 -translate-x-1/2 h-[10px] w-[48px] rounded bg-[#1a1a1a] cursor-row-resize border-t border-blue-200"></div>
      {/* slide-up bar - run tests, and test results */}
      <div ref={testsRef} className="bg-[#272822] h-[36px] overflow-y-auto overflow-x-hidden border-t border-blue-200/40">
        <div className="flex w-full px-4 h-[35px] bg-[#272822] items-center sticky top-0 border-b border-blue-200/40">
          <div className="border-b-2 border-blue-500 cursor-default">TESTS</div>
          <div className="flex-1 text-end h-[26px] whitespace-nowrap">
            <LoadingButton onClick={runTests} className="bg-blue-500 w-[82px] px-2 mt-[1px] text-white rounded-sm hover:bg-blue-600" type="button" loading={loadingTestsBtn} text="Run Tests" />
          </div>
        </div>
        <div>
          <Tests paramArray={paramArray} responseMessage={responseMessage} testResults={testResults} />
        </div>
      </div>
      {/* bottom bar - submit code */}
      <div className="bg-[#272822] px-4 h-[36px] flex justify-center items-center border-t border-blue-200/40">
        <div className="flex-1"></div>
        <div className="flex-shrink-0">
          <LoadingButton onClick={submitCode} className="bg-[#23776d] px-2 text-white rounded-sm hover:bg-[#14756a]" type="button" loading={loadingSubmitBtn} text="Submit" />
        </div>
      </div>
    </div>
  );
};

const extractParameters = (questionString, exampleString) => {
  const combinedString = questionString + " " + exampleString;
  const paramPattern = /\$(\w+)\$/g; // will match parameter names surrounded by dollar signs
  let paramNames = "";
  let match;
  while ((match = paramPattern.exec(combinedString)) !== null) {
    paramNames += match[1] + ", ";
  }
  paramNames = paramNames.slice(0, -2); // remove trailing comma and space
  return paramNames;
};

CodeEditor.propTypes = {
  data: PropTypes.object,
};

export default CodeEditor;

const Tests = ({ paramArray, responseMessage, testResults }) => {
  return (
    <div>
      {responseMessage && <div className={`mt-4 text-sm ${responseMessage.includes("successfully") ? "text-[#23776d]" : "text-red-400"}`}>{responseMessage}</div>}
      {testResults && (
        <div className="px-4 py-2 rounded-b-md">
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
                    {testResults.executionTimes?.[index].toFixed(3)} ms
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
                    {(testResults.memoryUsages?.[index] / 1024 / 1024).toFixed(4)} MB
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
                    {input.map((param, index) => (
                      <div key={index} className="font-semibold">
                        {`${paramArray[index]}: ${JSON.stringify(param)}`}
                      </div>
                    ))}
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

Tests.propTypes = {
  paramArray: PropTypes.array,
  responseMessage: PropTypes.string,
  testResults: PropTypes.object,
};
