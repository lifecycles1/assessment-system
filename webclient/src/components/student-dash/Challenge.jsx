import { useState } from "react";
import { useLocation } from "react-router-dom";
import Question from "./Question";
import CodeEditor from "./CodeEditor";
import FileUpload from "./FileUpload";

const Challenge = () => {
  const location = useLocation();
  const [data] = useState(location.state?.data);
  const [useCodeEditor, setUseCodeEditor] = useState(true);

  return (
    <div className="p-4 mt-16">
      <div className="flex justify-between">
        <div></div>
        <div className="mb-4 flex items-center text-sm mr-12">
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
          <Question challenge={data?.challenge} />
        </div>
        {/* Right half */}
        <div className="w-1/2 text-center">{useCodeEditor ? <CodeEditor data={data} /> : <FileUpload data={data} />}</div>
      </div>
    </div>
  );
};

export default Challenge;
