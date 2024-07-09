import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuthContext";

const LearningPaths = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchLearningPaths = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${token.id}/lp`);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLearningPaths();
  }, [token]);

  const isPathUnLocked = (title) => data?.pathProgress.some((progress) => progress.learningPath === title);

  const toggleExpand = () => setIsExpanded((prevState) => !prevState);

  const handleUnlockedLearningPathClick = (clickedLearningPath) => {
    // Find the progress for the clicked learning path
    const clickedPathProgress = data?.pathProgress.find((progress) => progress.learningPath === clickedLearningPath.title);

    navigate(clickedLearningPath.title.toLowerCase(), {
      state: {
        // and narrow down the data object to only the clicked learning path and its progress
        data: {
          learningPath: clickedLearningPath,
          pathProgress: clickedPathProgress,
        },
      },
    });
  };

  // TO-DO: change all these conditional renders to something better
  return (
    <div className="grid grid-cols-3 gap-4 p-8 bg-gray-800 h-[calc(100vh-48px)] overflow-y-auto">
      {data?.learningPaths.map((lp) => (
        <div key={lp._id} className="lp-tile col-span-3">
          {isPathUnLocked(lp.title) ? (
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:to-cyan-600 p-8 text-white rounded-md cursor-pointer">
              <div onClick={() => handleUnlockedLearningPathClick(lp)}>
                <img src="https://via.placeholder.com/40" alt={`Learning Path: ${lp.title}`} className="mb-4 rounded-md" />
                <h2 className="text-2xl font-bold">{lp.title}</h2>
              </div>
              {isExpanded ? (
                // render the list of links from lp.challenges.map
                <ul>
                  {lp.challenges.map((challenge) => (
                    <li key={challenge._id}>
                      <Link to={challenge.title.toLowerCase()}>{challenge.title}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                // render a button to toggle the expanded list of links
                <button onClick={toggleExpand}>Expand</button>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-900 to-gray-500 p-8 text-white rounded-md cursor-pointer">
              <img src="https://via.placeholder.com/40" alt={`Learning Path: ${lp.title}`} className="mb-4 rounded-md" />
              <h2 className="text-2xl font-bold">{lp.title}</h2>
              <div className="text-center">Locked</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LearningPaths;
