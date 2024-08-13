import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewTopicModal from "../modals/NewTopicModal";
import { updateFeed } from "../../../utils/forum/common";
import { useGetTopicsQuery } from "../../../features/forum/topicsApiSlice";

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
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const { data: topicsData, error } = useGetTopicsQuery(category, { skip: category.length === 0 });

  useEffect(() => {
    if (topicsData) setTopics(topicsData);
  }, [topicsData]);

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
      {error && (
        <div className="text-red-500">
          <span>{error.status} : </span>
          {error.data?.message || "An error occurred. Please try again later."}
        </div>
      )}
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
