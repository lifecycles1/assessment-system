import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetLearningPathsQuery } from "../../features/learningPaths/learningPathsApiSlice";
import LoadingSpinner from "../common/LoadingSpinner";

const LearningPaths = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: learningPathsData, isLoading, error } = useGetLearningPathsQuery();

  const isPathUnLocked = (title) => learningPathsData?.pathProgress.some((progress) => progress.learningPath === title);

  const toggleExpand = () => setIsExpanded((prevState) => !prevState);

  const handleUnlockedLearningPathClick = (clickedLearningPath) => {
    // Find the progress for the clicked learning path
    const clickedPathProgress = learningPathsData?.pathProgress.find((progress) => progress.learningPath === clickedLearningPath.title);

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

  return (
    // TO-DO: change all these conditional renders to something better
    <div className="grid grid-cols-3 gap-4 p-8 bg-gray-800 h-[calc(100vh-48px)] overflow-y-auto">
      {error && <div className="table h-2 text-center col-span-2 text-red-500 bg-gray-200 p-4 rounded-md">{error?.data?.message}</div>}
      {isLoading && (
        <div className="text-white">
          <LoadingSpinner />
        </div>
      )}
      {learningPathsData?.learningPaths.map((lp) => (
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
