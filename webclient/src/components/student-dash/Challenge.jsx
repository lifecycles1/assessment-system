import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import FileUpload from "./FileUpload";

const Challenge = () => {
  const location = useLocation();
  const [data] = useState(location.state?.data);
  const [useCodeEditor, setUseCodeEditor] = useState(true);

  // resize tests
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const container = containerRef.current;
    const offsetRight = container.clientWidth - (e.clientX - container.offsetLeft);
    leftRef.current.style.right = `${offsetRight}px`;
    rightRef.current.style.width = `${offsetRight}px`;
    // move drag handle to keep it between both rezised panels
    const dragPosition = container.offsetWidth - offsetRight - dragRef.current.offsetWidth / 2;
    dragRef.current.style.left = `${dragPosition}px`;
  };

  return (
    <div id="container" ref={containerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Left half */}
      <div id="left_panel" ref={leftRef}>
        <Question challenge={data?.challenge} />
      </div>
      {/* Drag bar */}
      <div id="drag" ref={dragRef} onMouseDown={handleMouseDown}></div>
      {/* Right half */}
      <div id="right_panel" ref={rightRef}>
        {useCodeEditor ? <CodeEditor data={data} /> : <FileUpload data={data} />}
      </div>
    </div>
  );
};

export default Challenge;

const Question = ({ challenge }) => {
  return (
    <div className="p-4 h-[100%] overflow-y-auto overflow-x-hidden">
      <div className="flex justify-between">
        <div className="font-bold italic ml-4">{challenge.title}</div>
        <div className="flex mr-4 space-x-3 text-sm">
          <div className="flex space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#34a194" className="w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-gray-500 font-bold">{challenge.suggestedTime}</div>
          </div>
          <div className="text-gray-500 font-semibold">|</div>
          <div className="text-gray-500 font-bold">{challenge.difficulty}</div>
        </div>
      </div>
      <div className="font-semibold mb-4 text-center mt-10">Question</div>
      <div dangerouslySetInnerHTML={{ __html: highlightParameters(challenge.question) }} />
      <div className="font-semibold mt-4 mb-4 text-center">Examples</div>
      <pre className="text-sm whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: highlightParameters(challenge.example) }} />
    </div>
  );
};

const highlightParameters = (string) => {
  const paramPattern = /\$(\w+)\$/g;
  return string.replace(paramPattern, (match, paramName) => `<span class="bg-gray-200 px-2 rounded">${paramName}</span>`);
};

Question.propTypes = {
  challenge: PropTypes.object,
};

// <div className="flex justify-between">
// <div></div>
// <div className="mb-4 flex items-center text-sm mr-12">
//   <button onClick={() => setUseCodeEditor(true)} className={`mr-4 px-2 py-1 rounded ${useCodeEditor ? "bg-blue-600 text-white" : "bg-blue-200 text-gray-600 hover:bg-blue-500 hover:text-gray-200"}`}>
//     Code Editor
//   </button>
//   <div className="text-neutral-200">or</div>
//   <button onClick={() => setUseCodeEditor(false)} className={`ml-4 px-2 py-1 rounded ${!useCodeEditor ? "bg-blue-600 text-white" : "bg-blue-200 text-gray-600 hover:bg-blue-500 hover:text-gray-200"}`}>
//     File Upload
//   </button>
// </div>
// </div>
