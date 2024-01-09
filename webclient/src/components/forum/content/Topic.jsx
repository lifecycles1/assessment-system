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
import jwt_decode from "jwt-decode";
import heartSolid from "../../../assets/heart-solid.svg";

const MessageTile = ({ topic, onReply, userId }) => {
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    setLikes(topic.likes);
  }, [topic.likes]);

  const topicCreationDate = calculateTimeDifference(topic.createdAt);
  const dateOfLastReply = topic.replies?.length > 0 ? calculateTimeDifference(topic.replies[topic.replies.length - 1]?.createdAt) : null;
  const uniqueUserCount = [...new Set(topic.replies?.map((reply) => reply.creator._id))];

  return (
    <div className="flex space-x-4 pr-20 w-full">
      <img src={topic.creator?.picture || "https://via.placeholder.com/40"} alt="User" className="mt-3.5 w-10 h-10 rounded-full" />
      <div className="my-5 w-full">
        <p className="text-gray-400 font-semibold">{topic.creator?.email}</p>
        <p className="text-gray-800 mt-4">{topic.message}</p>
        <div className="flex justify-between mt-10">
          <div></div>
          <div className="flex items-center">
            <div className="flex px-4 py-2 space-x-2 transition duration-300 ease-in-out hover:bg-gray-200">
              {likes?.length > 0 && <div title={generateLikeCounterTitle(likes, userId)}>{likes.length}</div>}
              <button onClick={() => handleLike("topic", topic._id, setLikes, userId)} className="">
                {likes?.includes(userId) ? <img src={heartSolid} alt="Heart Solid" className="w-4 h-4" title="undo like" /> : <img src={heartOutline} alt="Heart Outline" className="w-4 h-4" title="like this post" />}
              </button>
            </div>
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
                <div title={topicCreationDate.hoverText} className="hover:text-gray-600 cursor-default">
                  {topicCreationDate.display}
                </div>
              </div>
            </div>
            <div className="p-2">
              <div className="mb-2 text-sm text-gray-500">Last Reply</div>
              <div className="flex">
                <img src={topic.creator?.picture || "https://via.placeholder.com/40"} alt="User" className="w-6 h-6 rounded-full mr-2" />
                {dateOfLastReply && (
                  <div title={dateOfLastReply.hoverText} className="hover:text-gray-600 cursor-default">
                    {dateOfLastReply.display}
                  </div>
                )}
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

const ReplyTile = ({ reply, onReply, userId }) => {
  const [likes, setLikes] = useState(reply.likes);

  return (
    <div className="flex space-x-4 pr-20 w-full">
      <img src={reply.creator.picture || "https://via.placeholder.com/40"} alt="User" className="mt-3.5 w-10 h-10 rounded-full" />
      <div className="my-5 w-full">
        <p className="text-gray-400 font-semibold">{reply.creator.email}</p>
        <p className="text-gray-800 mt-4">{reply.message}</p>
        <div className="flex justify-between mt-10">
          <div></div>
          <div className="flex items-center">
            <div className="flex px-4 py-2 space-x-2 transition duration-300 ease-in-out hover:bg-gray-200">
              {likes?.length > 0 && <div title={generateLikeCounterTitle(likes, userId)}>{likes.length}</div>}
              <button onClick={() => handleLike("reply", reply._id, setLikes, userId)} className="">
                {likes?.includes(userId) ? <img src={heartSolid} alt="Heart Solid" className="w-4 h-4" title="undo like" /> : <img src={heartOutline} alt="Heart Outline" className="w-4 h-4" title="like this post" />}
              </button>
            </div>
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
  const [userId, setUserId] = useState("");

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
      } catch (error) {
        console.error("Error fetching topic:", error);
      }
    };
    fetchTopic();
    return () => abortController.abort();
  }, [category, location.state]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwt_decode(token) : null;
    const userId = decodedToken ? decodedToken.id : "";
    setUserId(userId);
  }, []);

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
          <MessageTile topic={topic} onReply={onReply} userId={userId} />
        </div>
        <div className="replies-box">
          {replies.map((reply) => (
            <ReplyTile key={reply._id} reply={reply} onReply={onReply} userId={userId} />
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
  userId: PropTypes.string,
};

ReplyTile.propTypes = {
  reply: PropTypes.object,
  onReply: PropTypes.func,
  userId: PropTypes.string,
};

const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const calculateTimeDifference = (date) => {
  const currentDate = new Date();
  const creationDate = new Date(date);
  const timeDifference = currentDate - creationDate;

  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  const hoverText = creationDate.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true });

  if (timeDifference < 60 * 1000) {
    return { display: `${minutes}min`, hoverText };
  } else if (timeDifference < 24 * 60 * 60 * 1000) {
    return { display: `${hours}hr`, hoverText };
  } else if (timeDifference < 30 * 24 * 60 * 60 * 1000) {
    return { display: `${days}d`, hoverText };
  } else {
    return { display: monthAbbreviations[creationDate.getMonth()] + " '" + (creationDate.getFullYear() % 100), hoverText };
  }
};

const handleLike = async (type, messageId, setLikes, userId) => {
  try {
    const response = await axios.post(`http://localhost:3000/${messageId}/like`, { type, userId });
    setLikes(response.data.likes);
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};

const generateLikeCounterTitle = (likes, userId) => {
  const likeCount = likes.length;

  if (likeCount === 1 && likes[0] === userId) {
    return "you liked this post";
  } else if (likeCount === 1) {
    return "1 person liked this post";
  } else {
    const youLiked = likes.includes(userId);
    const othersCount = youLiked ? likeCount - 1 : likeCount;

    if (youLiked) {
      return `you and ${othersCount} other ${othersCount === 1 ? "person" : "people"} liked this post`;
    } else {
      return `${likeCount} people liked this post`;
    }
  }
};

export default Topic;
