import PropTypes from "prop-types";

const ViewQuestionModal = ({ isOpen, onClose, question }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="absolute bg-white rounded-lg shadow-2xl shadow-sky-950 p-4 border-2 border-dashed border-blue-600/50 w-[650px] h-[450px] overflow-y-auto">
        <span className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl cursor-pointer" onClick={onClose}>
          &times;
        </span>
        <div className="modal-content">
          <div className="flex space-x-2 p-4">
            <div className="font-semibold">{question.name}</div>
            <div className="italic">
              ({question.suggestedTime}, {question.difficulty.toLowerCase()})
            </div>
          </div>
          <div className="p-4">
            <div className="font-semibold mb-2">Question:</div>
            <pre className="text-gray-700">{question.question}</pre>
          </div>
          <div className="p-4">
            <div className="font-semibold mb-2">Example:</div>
            <pre className="text-gray-700">{question.example}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

ViewQuestionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
};

export default ViewQuestionModal;
