/* eslint-disable react/prop-types */
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div ref={modalContentRef} className="absolute bg-white rounded-lg shadow-2xl shadow-sky-950 p-4 max-w-xl w-[500px] border-2 border-dashed border-blue-600/50">
        <span className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl cursor-pointer" onClick={onClose}>
          &times;
        </span>
        <div className="modal-content">
          {errorMessage ? (
            <div className="mt-6">
              <div>Execution error: program had a runtime error.</div>
              <div className="text-red-600 font-semibold text-lg mb-4 mt-6 whitespace-normal">{errorMessage}</div>
            </div>
          ) : (
            <div className="bg-gray-100 p-4 rounded-md border border-gray-300 mt-4">
              <div className={`font-semibold text-lg mb-2 ${responseData.isCorrect.every((result) => result) ? "text-green-600" : "text-red-600"}`}>{responseData.isCorrect.every((result) => result) ? "All Tests Passed" : "Tests Failed"}</div>
              <div className="h-[350px] overflow-x-auto overflow-y-auto">
                {responseData.inputs.map((input, index) => (
                  <div key={index} className="mb-4 border p-4 rounded-md">
                    <div className="font-semibold">Test Case {index + 1}:</div>
                    <div className="mb-2 flex">
                      <div className="flex-1">
                        <div className={`font-semibold ${responseData.isCorrect[index] ? "text-green-600" : "text-red-600"}`}>Input:</div>
                        <div className="text-gray-700">{JSON.stringify(input)}</div>
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${responseData.isCorrect[index] ? "text-green-600" : "text-red-600"}`}>Output:</div>
                        <div className="text-gray-700">{JSON.stringify(responseData.outputs[index])}</div>
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${responseData.isCorrect[index] ? "text-green-600" : "text-red-600"}`}>Expected Output:</div>
                        <div className="text-gray-700">{JSON.stringify(responseData.expectedOutputs[index])}</div>
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

export default DisplayTestsModal;
