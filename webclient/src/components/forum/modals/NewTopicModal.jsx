import PropTypes from "prop-types";
import { useState } from "react";
import { useCreateTopicMutation } from "../../../features/forum/topicsApiSlice";

const NewTopicModal = ({ onClose, updateFeed }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [createTopic, { isError, error }] = useCreateTopicMutation();

  const handleSubmit = async () => {
    if (title && message && category) {
      try {
        const response = await createTopic({ title, message, category }).unwrap();
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
          <h2>Create a new Topic</h2>
          <span className="text-xl cursor-pointer" onClick={onClose}>
            &times;
          </span>
        </div>
        <input className="w-1/2 h-9 outline-none border border-gray-500 p-3 mb-3" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Type title, or paste a link here" />
        <select className="w-1/4 h-9 outline-none border border-gray-500 text-gray-500 mb-3" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="general">general</option>
          <option value="help">help</option>
          <option value="feedback">feedback</option>
          <option value="bug-reports">bug reports</option>
          <option value="editorials">editorials</option>
          <option value="announcements">announcements</option>
        </select>
        <textarea className="outline-none border border-gray-500 min-h-[120px] max-h-[200px] w-1/2 mb-3" value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="space-x-5">
          <button onClick={handleSubmit} className="bg-gray-700 rounded text-white px-4 py-2 transition duration-300 ease-in-out hover:bg-gray-800">
            Create Topic
          </button>
          <button onClick={onClose} className="hover:text-red-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

NewTopicModal.propTypes = {
  onClose: PropTypes.func,
  updateFeed: PropTypes.func,
};

export default NewTopicModal;
