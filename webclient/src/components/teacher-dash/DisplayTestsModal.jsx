import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const DisplayTestsModal = ({ isOpen, onClose, responseData, errorMessage }) => {
  const modalContentRef = useRef();

  useEffect(() => {
    if (isOpen) {
      const closeOnOutsideClick = (e) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
          onClose();
        }
      };

      document.addEventListener("click", closeOnOutsideClick);

      return () => {
        document.removeEventListener("click", closeOnOutsideClick);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div ref={modalContentRef} className="absolute rounded-lg shadow-2xl shadow-sky-950 bg-white p-4 w-[600px] border-2 border-dashed border-blue-600/50">
        <span className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl cursor-pointer" onClick={onClose}>
          &times;
        </span>
        <div className="modal-content">
          {errorMessage ? (
            <div className="mt-6">
              <div className="text-gray-500">Execution error: program had a runtime error.</div>
              <div className="text-red-600 font-semibold text-lg mb-4 mt-6 whitespace-normal">{errorMessage}</div>
            </div>
          ) : (
            <div className="p-4 rounded-md mt-4">
              <div className={`font-semibold text-lg mb-2 ${responseData.isCorrect.every((result) => result) ? "text-[#23776d]" : "text-red-400"}`}>{`Tests Passed: ${responseData.isCorrect.filter((result) => result).length}/${responseData.isCorrect.length}`}</div>
              <div className="h-[350px] overflow-y-auto">
                {responseData.inputs.map((input, index) => (
                  <div key={index} className="mb-4 border border-gray-300 p-4 rounded-md overflow-x-auto">
                    <div className="flex px-4 justify-between">
                      <div className="font-semibold text-gray-500">Test Case {index + 1}:</div>
                      <div className={`${responseData.isCorrect[index] ? "text-[#46c3b4]" : "text-red-400"}`}>{responseData.isCorrect[index] ? "Passed ✓" : "Wrong answer ✗"}</div>
                    </div>
                    <div className="mb-2 px-4 py-2 flex space-x-10 text-center break-all">
                      <div className="flex-1">
                        <div>Input:</div>
                        <div className="font-semibold">{JSON.stringify(input)}</div>
                      </div>
                      <div className="flex-1">
                        <div>Output:</div>
                        <div className="font-semibold">{JSON.stringify(responseData.outputs[index])}</div>
                      </div>
                      <div className="flex-1">
                        <div>Expected Output:</div>
                        <div className="font-semibold">{JSON.stringify(responseData.expectedOutputs[index])}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

DisplayTestsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  responseData: PropTypes.object.isRequired,
  errorMessage: PropTypes.string,
};

export default DisplayTestsModal;
