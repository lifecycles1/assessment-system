import PropTypes from "prop-types";

const ViewCodeModal = ({ isOpen, onClose, code }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="absolute bg-white rounded-lg shadow-2xl shadow-sky-950 p-4 h-[450px] w-[570px] overflow-y-auto border-2 border-dashed border-blue-600/50">
        <span className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl cursor-pointer" onClick={onClose}>
          &times;
        </span>
        <div className="modal-content">
          <pre className="text-gray-700 whitespace-pre-wrap">{code}</pre>
        </div>
      </div>
    </div>
  );
};

ViewCodeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
};

export default ViewCodeModal;
