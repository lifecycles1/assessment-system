import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LearningPath = () => {
  const location = useLocation();
  const [data] = useState(location.state?.data);
  // based on whether the challengeId is in pathProgress.completedChallenges or not
  // return true or false to determine whether the challenge is unlocked
  const isChallengeUnlocked = (challengeId, index) => {
    // if no challenges have been completed
    if (data?.pathProgress[0].completedChallenges.length === 0 && index === 0) {
      // return true to unlock the first tile
      return true;
    }
    return data?.pathProgress[0].completedChallenges.includes(challengeId);
  };

  // console.log("data", data);

  useEffect(() => {
    try {
      //
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      {data?.learningPaths[0].challenges.map((challenge, index) => (
        <div key={challenge._id} className="col-span-3">
          {isChallengeUnlocked(challenge._id, index) ? (
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:to-cyan-600 p-8 text-white rounded-md cursor-pointer">
              <Link to={challenge.title} state={{ data }}>
                <img src="https://via.placeholder.com/40" alt={`Challenge: ${challenge.title}`} className="mb-4 rounded-md" />
                <h2 className="text-2xl font-bold">{challenge.title}</h2>
              </Link>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-900 to-gray-500 p-8 text-white rounded-md cursor-pointer">
              <img src="https://via.placeholder.com/40" alt={`Challenge: ${challenge.title}`} className="mb-4 rounded-md" />
              <h2 className="text-2xl font-bold">{challenge.title}</h2>
              <div className="text-center">Locked</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LearningPath;
