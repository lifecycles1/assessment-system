import PropTypes from "prop-types";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewTopicModal from "../modals/NewTopicModal";
import { updateFeed } from "../../../utils/forum/common";

const TopicTile = ({ topic }) => {
  return (
    <div className="flex items-center border-b border-gray-200">
      <div className="w-[560px] h-[85px] flex flex-col justify-center mr-20">
        <Link to={`${topic.category}/t/${topic._id}`} className="text-lg">
          {topic.title.substring(0, 115)}...
        </Link>
        <div className="text-sm">{topic.category}</div>
      </div>
      <div className="w-[200px] flex space-x-1">
        <img src={topic.creator?.picture || "https://via.placeholder.com/40"} alt="User" className="w-6 h-6 rounded-full" />
        <img src={topic.creator?.picture || "https://via.placeholder.com/40"} alt="User" className="w-6 h-6 rounded-full" />
        <img src={topic.creator?.picture || "https://via.placeholder.com/40"} alt="User" className="w-6 h-6 rounded-full" />
        <img src={topic.creator?.picture || "https://via.placeholder.com/40"} alt="User" className="w-6 h-6 rounded-full" />
      </div>
      <div className="flex space-x-20 text-lg text-gray-600">
        <div>{topic.replies.length}</div>
        <div>{topic.views}</div>
      </div>
    </div>
  );
};

const TopicList = ({ category }) => {
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!category) return;
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/topics/${category}`);
        setTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchTopics();
  }, [category]);

  return (
    <div className="mt-8 p-5">
      <div className="flex justify-between mt-8 mb-4 items-center">
        <div className="flex">
          <div className="space-x-2">
            <button className="border border-gray-400 px-4 py-2 transition transform hover:scale-105">general</button>
            <button className="border border-gray-400 px-4 py-2 transition transform hover:scale-105">all tags</button>
          </div>
          <div className="space-x-2 ml-5">
            <button className="border border-gray-400 px-4 py-2 transition transform hover:scale-105">Latest</button>
            <button className="border border-gray-400 px-4 py-2 transition transform hover:scale-105">Top</button>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gray-700 rounded text-white px-4 py-2 transition duration-300 ease-in-out hover:bg-gray-800">
          + New Topic
        </button>
      </div>
      <div className="flex justify-between items-center border-b border-gray-200 text-lg text-gray-600">
        <div>Topic</div>
        <div className="flex space-x-10 mr-[15px]">
          <div>Replies</div>
          <div>Views</div>
        </div>
      </div>
      {topics.map((topic) => (
        <TopicTile key={topic._id} topic={topic} />
      ))}
      {isModalOpen && <NewTopicModal onClose={() => setIsModalOpen(false)} updateFeed={(newTopic) => updateFeed(newTopic, setTopics)} />}
    </div>
  );
};

TopicTile.propTypes = {
  topic: PropTypes.object,
  index: PropTypes.number,
};

TopicList.propTypes = {
  category: PropTypes.string,
};

export default TopicList;
