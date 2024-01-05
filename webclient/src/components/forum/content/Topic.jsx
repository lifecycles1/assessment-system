import PropTypes from "prop-types";
import NavigationBar from "../../NavigationBar";
import SideBar from "../SideBar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import NewReplyModal from "../modals/NewReplyModal";
import { updateFeed } from "../../../utils/forum/common";
import leftArrow from "../../../assets/left-arrow.svg";
import heartOutline from "../../../assets/heart-outline.svg";

const MessageTile = ({ topic, onReply }) => {
  const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const topicCreationDate = new Date(topic.createdAt);
  const createdAt = monthAbbreviations[topicCreationDate.getMonth()] + " '" + (topicCreationDate.getFullYear() % 100);
  const dateOfLastReply = topic.replies && topic.replies[topic.replies.length - 1]?.createdAt;
  const uniqueUserCount = [...new Set(topic.replies?.map((reply) => reply.creator._id))];

  return (
    <div className="flex space-x-4 pr-20 w-full">
      <img src={topic.creator?.picture || "https://via.placeholder.com/40"} alt="User" className="mt-3.5 w-10 h-10 rounded-full" />
      <div className="my-5 w-full">
        <p className="text-gray-400 font-semibold">{topic.creator?.email}</p>
        <p className="text-gray-800 mt-4">{topic.message}</p>
        <div className="flex justify-between mt-10">
          <div></div>
          <div className="space-x-4 flex">
            <button className="flex items-center space-x-2 px-4 py-2 transition duration-300 ease-in-out hover:bg-gray-200">
              <img src={heartOutline} alt="Heart Outline" className="w-4 h-4" />
            </button>
            <button onClick={() => onReply("topic", topic._id, topic.creator._id, topic.message)} className="flex items-center space-x-2 px-4 py-2 text-gray-400 transition duration-300 ease-in-out hover:bg-gray-200">
              <img src={leftArrow} alt="Left Arrow" className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>
        </div>
        <div className="flex mt-4 border border-gray-300">
          <div className="flex">
            <div className="p-2">
              <div className="mb-2 text-sm text-gray-500">Created</div>
              <div className="flex">
                <img src={topic.creator?.picture || "https://via.placeholder.com/40"} alt="User" className="w-6 h-6 rounded-full mr-2" />
                <div>{createdAt}</div>
              </div>
            </div>
            <div className="p-2">
              <div className="mb-2 text-sm text-gray-500">Last Reply</div>
              <div className="flex">
                <img src={topic.creator?.picture || "https://via.placeholder.com/40"} alt="User" className="w-6 h-6 rounded-full mr-2" />
                <div>{dateOfLastReply}</div>
              </div>
            </div>
          </div>
          <div className="flex ml-10 p-2 space-x-6">
            <div>
              <div className="mb-2 text-sm text-gray-500">Replies</div>
              <div>{topic.replies?.length}</div>
            </div>
            <div>
              <div className="mb-2 text-sm text-gray-500">Views</div>
              <div>{topic.views}</div>
            </div>
            <div>
              <div className="mb-2 text-sm text-gray-500">Users</div>
              <div>{uniqueUserCount.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReplyTile = ({ reply, onReply }) => {
  return (
    <div className="flex space-x-4 pr-20 w-full">
      <img src={reply.creator.picture || "https://via.placeholder.com/40"} alt="User" className="mt-3.5 w-10 h-10 rounded-full" />
      <div className="my-5 w-full">
        <p className="text-gray-400 font-semibold">{reply.creator.email}</p>
        <p className="text-gray-800 mt-4">{reply.message}</p>
        <div className="flex justify-between mt-10">
          <div></div>
          <div className="space-x-4 flex">
            <button className="flex items-center space-x-2 px-4 py-2 transition duration-300 ease-in-out hover:bg-gray-200">
              <img src={heartOutline} alt="Heart Outline" className="w-4 h-4" />
            </button>
            <button onClick={() => onReply("reply", reply._id, reply.creator._id, reply.message, reply.creator.email, reply.creator.picture)} className="flex items-center space-x-2 px-4 py-2 text-gray-400 transition duration-300 ease-in-out hover:bg-gray-200">
              <img src={leftArrow} alt="Left Arrow" className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Topic = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState(localStorage.getItem("selectedCategory"));
  const [topic, setTopic] = useState({});
  const [replies, setReplies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    topicId: null,
    title: null,
    parentType: null,
    parentMessageId: null,
    parentMessageCreator: null,
    parentMessage: null,
    parentMessageCreatorEmail: null,
    parentMessageCreatorPicture: null,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const fetchTopic = async () => {
      const { topicId } = location.state;
      try {
        const response = await axios.get(`http://localhost:3000/topics/${category}/${topicId}`, {
          signal: abortController.signal,
        });
        setTopic(response.data);
        setReplies(response.data.replies);
        console.log("response.data", response.data);
      } catch (error) {
        console.error("Error fetching topic:", error);
      }
    };
    fetchTopic();
    return () => abortController.abort();
  }, [category, location.state]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    localStorage.setItem("selectedCategory", newCategory);
    navigate(`/forum/${newCategory}`);
  };

  const onReply = (parentType, parentMessageId, parentMessageCreator, parentMessage, parentMessageCreatorEmail = null, parentMessageCreatorPicture = null) => {
    setIsModalOpen({
      isOpen: true,
      topicId: topic._id,
      title: topic.title,
      parentType,
      parentMessageId,
      parentMessageCreator,
      parentMessage,
      parentMessageCreatorEmail,
      parentMessageCreatorPicture,
    });
  };

  return (
    <div>
      <div className="fixed top-0 z-20 w-full">
        <NavigationBar />
      </div>
      <div className="fixed left-0 top-12 overflow-y-auto z-10">
        <SideBar category={category} setCategory={handleCategoryChange} />
      </div>
      <div className="flex-1 ml-[260px] overflow-y-auto mt-8 p-12">
        <h2 className="text-2xl font-bold mb-3">{topic.title}</h2>
        <div className="mb-8">{topic.category}</div>
        <div className="message-box">
          <MessageTile topic={topic} onReply={onReply} />
        </div>
        <div className="replies-box">
          {replies.map((reply) => (
            <ReplyTile key={reply._id} reply={reply} onReply={onReply} />
          ))}
        </div>
        <div className="mt-20">
          <button onClick={() => onReply("topic", topic._id, topic.creator._id, topic.message)} className="flex items-center space-x-2 bg-gray-700 rounded text-white px-4 py-2 transition duration-300 ease-in-out hover:bg-gray-800">
            <img src={leftArrow} alt="Left Arrow" className="w-4 h-4" />
            <span>Reply</span>
          </button>
        </div>
        {isModalOpen.isOpen && (
          <NewReplyModal
            topicId={isModalOpen.topicId}
            title={isModalOpen.title}
            parentType={isModalOpen.parentType}
            parentMessageId={isModalOpen.parentMessageId}
            parentMessageCreator={isModalOpen.parentMessageCreator}
            parentMessage={isModalOpen.parentMessage}
            parentMessageCreatorEmail={isModalOpen.parentMessageCreatorEmail}
            parentMessageCreatorPicture={isModalOpen.parentMessageCreatorPicture}
            onClose={() => setIsModalOpen({ isOpen: false })}
            updateFeed={(newReply) => updateFeed(newReply, setReplies)}
          />
        )}
      </div>
    </div>
  );
};

MessageTile.propTypes = {
  topic: PropTypes.object,
  onReply: PropTypes.func,
};

ReplyTile.propTypes = {
  reply: PropTypes.object,
  onReply: PropTypes.func,
};

export default Topic;
