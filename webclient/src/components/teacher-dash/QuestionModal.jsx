/* eslint-disable react/prop-types */

const QuestionModal = ({ isOpen, onClose, question, example }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute bg-white  rounded-lg shadow-lg p-4 max-w-xl border-2 border-dashed border-blue-600">
        <span className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl cursor-pointer" onClick={onClose}>
          &times;
        </span>
        <div className="modal-content">
          <div className="p-4">
            <div className="font-semibold text-lg mb-2">Question:</div>
            <pre className="text-gray-700">{question}</pre>
          </div>
          <div className="p-4">
            <div className="font-semibold text-lg mb-2">Example:</div>
            <pre className="text-gray-700">{example}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
