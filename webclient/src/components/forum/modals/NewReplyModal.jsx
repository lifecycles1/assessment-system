import PropTypes from "prop-types";
import { useState } from "react";
import leftArrow from "../../../assets/left-arrow.svg";
import { useAddReplyMutation } from "../../../features/forum/topicsApiSlice";

const NewReplyModal = ({ topicId, title, parentType, parentMessageId, parentMessageCreator, parentMessage, parentMessageCreatorEmail, parentMessageCreatorPicture, onClose, updateFeed }) => {
  const [message, setMessage] = useState("");
  const [addReply, { isError, error }] = useAddReplyMutation();

  const handleSubmit = async () => {
    if (message && parentMessageId && parentMessageCreator && parentMessage) {
      try {
        const response = await addReply({ message, parentMessageId, parentMessageCreator, parentMessage, topicId }).unwrap();
        updateFeed(response);
        onClose();
      } catch (err) {
        console.log(err);
        setMessage(error);
      }
    }
  };

  return (
    <div className="fixed left-0 bottom-0 z-50 w-full overflow-y-auto">
      <div className="flex flex-col bg-white transition-all duration-300 ease-in-out py-3 px-5 border-t-8 border-gray-800">
        <div className="flex justify-between mb-3">
          {parentType === "topic" ? (
            <div>
              <h2>{title}</h2>
            </div>
          ) : (
            <div className="flex space-x-3 items-center">
              <img src={parentMessageCreatorPicture || "https://via.placeholder.com/40"} alt="User" className="w-10 h-10 rounded-full" />
              <div className="text-gray-400 font-semibold">{parentMessageCreatorEmail}</div>
            </div>
          )}
          <span className="text-xl cursor-pointer" onClick={onClose}>
            &times;
          </span>
        </div>
        <textarea className="outline-none border border-gray-500 min-h-[120px] max-h-[200px] w-1/2 mb-3" value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="space-x-5 flex">
          <button onClick={handleSubmit} className="flex items-center space-x-2 bg-gray-700 rounded text-white px-4 py-2 transition duration-300 ease-in-out hover:bg-gray-800">
            <img src={leftArrow} alt="Left Arrow" className="w-4 h-4" />
            <span>Reply</span>
          </button>
          <button onClick={onClose} className="hover:text-red-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

NewReplyModal.propTypes = {
  topicId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  parentType: PropTypes.string.isRequired,
  parentMessageId: PropTypes.string.isRequired,
  parentMessageCreator: PropTypes.string.isRequired,
  parentMessage: PropTypes.string.isRequired,
  parentMessageCreatorEmail: PropTypes.string,
  parentMessageCreatorPicture: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  updateFeed: PropTypes.func.isRequired,
};

export default NewReplyModal;
