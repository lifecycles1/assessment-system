import { Link, useOutletContext } from "react-router-dom";
import heartSolid from "../../../assets/heart-solid.svg";
import { calculateTimeDifference } from "../../../utils/forum/common";

const Summary = () => {
  const userData = useOutletContext();
  const lastTwoReplies = userData.replies.slice(-2).reverse();
  return (
    <div>
      <div className="text-xl font-semibold py-6">STATS</div>
      <div className="grid grid-cols-5 gap-4">
        <div className="flex items-center space-x-1">
          <div className="text-xl font-semibold">{userData.daysVisited.length}</div>
          <div className="text-gray-500">days visited</div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="text-xl font-semibold">{formatReadTime(userData.readTime)}</div>
          <div className="text-gray-500">read time</div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="text-xl font-semibold">{userData.topicsViewed.length}</div>
          <div className="text-gray-500">topics viewed</div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="text-xl font-semibold">{userData.likesGiven}</div>
          <img src={heartSolid} alt="Likes" className="w-5 h-5 mt-0.5" />
          <div className="text-gray-500">given</div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="text-xl font-semibold">{userData.likesReceived}</div>
          <img src={heartSolid} alt="Likes" className="w-5 h-5 mt-0.5" />
          <div className="text-gray-500">received</div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="text-xl font-semibold">{userData.topics.length}</div>
          <div className="text-gray-500">topics created</div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="text-xl font-semibold">{userData.replies.length}</div>
          <div className="text-gray-500">posts created</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-16">
        <div>
          <div className="text-xl font-semibold">TOP REPLIES</div>
          <ul>
            {lastTwoReplies.map((reply) => (
              <li key={reply._id} className="mt-3 pl-2 py-2 border-l-2 border-gray-200">
                <div className="text-gray-500">{calculateTimeDifference(reply.createdAt).display}</div>
                <Link className="text-[17px]" to={`/forum/${reply.parentTopicId.category}/t/${reply.parentTopicId._id}?scrollTo=${reply._id}`}>
                  {reply.parentTopicId.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl font-semibold">TOP TOPICS</div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

const formatReadTime = (seconds) => {
  if (seconds < 60) {
    return "0m";
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  }
};

export default Summary;
