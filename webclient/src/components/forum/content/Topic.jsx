import PropTypes from "prop-types";
import SideBar from "../SideBar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NewReplyModal from "../modals/NewReplyModal";
import { updateFeed, calculateTimeDifference } from "../../../utils/forum/common";
import leftArrow from "../../../assets/left-arrow.svg";
import heartOutline from "../../../assets/heart-outline.svg";
import heartSolid from "../../../assets/heart-solid.svg";
import useAuth from "../../../hooks/useAuth";
import { useGetTopicQuery, useHandleLikeMutation } from "../../../features/forum/topicsApiSlice";
import { useSendElapsedReadingTimeMutation } from "../../../features/forum/profileApiSlice";

const MessageTile = ({ topic, onReply }) => {
  const { decoded } = useAuth();
  const [likes, setLikes] = useState(topic.likes);
  const [handleLike, { isLoading, error }] = useHandleLikeMutation();

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
            {error && (
              <div className="text-red-500 mr-1">
                <span>{error.status} : </span>
                {error.data?.message || "An error occurred. Please try again later."}
              </div>
            )}
            <div className="flex px-4 py-2 space-x-2 transition duration-300 ease-in-out hover:bg-gray-200">
              {likes?.length > 0 && <div title={generateLikeCounterTitle(likes, decoded.id)}>{likes.length}</div>}
              <button onClick={() => handleLikes("topic", topic._id, handleLike, setLikes)} className="">
                {likes?.includes(decoded?.id) ? <img src={heartSolid} alt="Heart Solid" className="w-4 h-4" title="undo like" /> : <img src={heartOutline} alt="Heart Outline" className="w-4 h-4" title="like this post" />}
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

const ReplyTile = ({ reply, onReply }) => {
  const { decoded } = useAuth();
  const [likes, setLikes] = useState(reply.likes);
  const [handleLike, { isLoading, error }] = useHandleLikeMutation();

  return (
    <div id={reply._id} className="flex space-x-4 pr-20 w-full">
      <img src={reply.creator.picture || "https://via.placeholder.com/40"} alt="User" className="mt-3.5 w-10 h-10 rounded-full" />
      <div className="my-5 w-full">
        <p className="text-gray-400 font-semibold">{reply.creator.email}</p>
        <p className="text-gray-800 mt-4">{reply.message}</p>
        <div className="flex justify-between mt-10">
          <div></div>
          <div className="flex items-center">
            {error && (
              <div className="text-red-500 mr-1">
                <span>{error.status} : </span>
                {error.data?.message || "An error occurred. Please try again later."}
              </div>
            )}
            <div className="flex px-4 py-2 space-x-2 transition duration-300 ease-in-out hover:bg-gray-200">
              {likes?.length > 0 && <div title={generateLikeCounterTitle(likes, decoded.id)}>{likes.length}</div>}
              <button onClick={() => handleLikes("reply", reply._id, handleLike, setLikes)} className="">
                {likes?.includes(decoded?.id) ? <img src={heartSolid} alt="Heart Solid" className="w-4 h-4" title="undo like" /> : <img src={heartOutline} alt="Heart Outline" className="w-4 h-4" title="like this post" />}
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
  const routeParams = useParams();
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
  const [startTime] = useState(new Date());
  const { data: topicData, error } = useGetTopicQuery({ category, topicId: routeParams.topicId });
  const [sendElapsedReadingTime] = useSendElapsedReadingTimeMutation();

  useEffect(() => {
    if (topicData) {
      setTopic(topicData);
      setReplies(topicData.replies);
    }

    const sendElapsedTime = async () => {
      const endTime = Date.now();
      const elapsedTimeInSeconds = Math.floor((endTime - startTime) / 1000);
      const payload = { time: elapsedTimeInSeconds };
      try {
        await sendElapsedReadingTime(payload).unwrap();
      } catch (error) {
        console.error("Error sending elapsed reading time:", error);
      }
    };

    // send elapsed reading time when user "closes tab/refreshes page/goes to a different domain"
    window.addEventListener("beforeunload", sendElapsedTime);

    return () => {
      window.removeEventListener("beforeunload", sendElapsedTime);
      // send elapsed reading time when user "navigates away from the topic page"
      sendElapsedTime();
    };
  }, [topicData]);

  useEffect(() => {
    if (replies.length === 0) return;
    const scrollTo = new URLSearchParams(location.search).get("scrollTo");
    if (scrollTo) {
      const element = document.getElementById(scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "instant", block: "center" });
        element.children[1].classList.add("flash-background");
        setTimeout(() => element.children[1].classList.remove("flash-background"), 700);
      }
    }
  }, [replies]);

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

  if (error) {
    return (
      <div>
        <div className="fixed left-0 top-12 overflow-y-auto z-10">
          <SideBar category={category} setCategory={handleCategoryChange} />
        </div>
        <div className="ml-[260px] p-12 text-red-500">
          <span>{error.status} : </span>
          {error.data?.message || "An error occurred. Please try again later."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed left-0 top-12 overflow-y-auto z-10">
        <SideBar category={category} setCategory={handleCategoryChange} />
      </div>
      <div className="flex-1 ml-[260px] p-12 h-[calc(100vh-48px)] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-3">{topic.title}</h2>
        <div className="mb-8">{topic.category}</div>
        <div className="message-box">
          <MessageTile key={topic._id} topic={topic} onReply={onReply} />
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

const handleLikes = async (type, messageId, handleLike, setLikes) => {
  try {
    const response = await handleLike({ type, messageId }).unwrap();
    setLikes(response.likes);
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
