import PropTypes from "prop-types";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewTopicModal from "../modals/NewTopicModal";
import { updateFeed } from "../../../utils/forum/common";
import { useAuth } from "../../../hooks/useAuthContext";

const TopicTile = ({ topic }) => {
  return (
    <div className="flex items-center border-b border-gray-200">
      <div className="w-[560px] h-[85px] flex flex-col justify-center mr-20 pl-2">
        <Link to={`/forum/${topic.category}/t/${topic._id}`} className="text-lg">
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
        <div>{topic.replies?.length}</div>
        <div>{topic.views}</div>
      </div>
    </div>
  );
};

const TopicList = ({ category }) => {
  const { token } = useAuth();
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (!token) return;
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/topics/${category}?userId=${token.id}`);
        setTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    if (category.length > 0) fetchTopics();
  }, [category, token]);

  const sortTopics = (type) => {
    // toggle sort order (type === "latest" is not toggleable)
    if (type !== "latest") setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    const sortedTopics = [...topics];
    // sort topics based on criteria
    if (type === "replyCount") {
      sortedTopics.sort((a, b) => {
        if (sortOrder === "desc") return b.replies.length - a.replies.length;
        else return a.replies.length - b.replies.length;
      });
    } else if (type === "views") {
      sortedTopics.sort((a, b) => {
        if (sortOrder === "desc") return b.views - a.views;
        else return a.views - b.views;
      });
    } else if (type === "latest") {
      sortedTopics.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setTopics(sortedTopics);
  };

  return (
    <div className="p-5 h-[calc(100vh-48px)] overflow-y-auto">
      <div className="flex justify-between mt-8 mb-4 items-center">
        <div className="flex">
          <div className="space-x-2">
            <button className="border border-gray-400 px-4 py-2 transition transform hover:scale-105">general</button>
            <button className="border border-gray-400 px-4 py-2 transition transform hover:scale-105">all tags</button>
          </div>
          <div className="space-x-2 ml-5">
            <button onClick={() => sortTopics("latest")} className="border border-gray-400 px-4 py-2 transition transform hover:scale-105">
              Latest
            </button>
            <button className="border border-gray-400 px-4 py-2 transition transform hover:scale-105">Top</button>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gray-700 rounded text-white px-4 py-2 transition duration-300 ease-in-out hover:bg-gray-800">
          + New Topic
        </button>
      </div>
      <div className="flex justify-between items-center border-b border-gray-200 text-lg text-gray-600">
        <div className="pl-1">Topic</div>
        <div className="flex space-x-10 mr-[15px]">
          <div onClick={() => sortTopics("replyCount")}>Replies</div>
          <div onClick={() => sortTopics("views")}>Views</div>
          {/* <div>Activity</div> */}
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
};

TopicList.propTypes = {
  category: PropTypes.string.isRequired,
};

export default TopicList;
