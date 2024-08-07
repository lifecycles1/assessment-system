import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LearningPath = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data] = useState(location.state?.data);

  // based on whether the challengeId is in pathProgress.unlockedChallenges or not
  // return true or false to determine whether the challenge is unlocked
  const isChallengeUnlocked = (challengeId) => {
    return data?.pathProgress?.unlockedChallenges.includes(challengeId);
  };

  useEffect(() => {
    try {
      //
    } catch (error) {
      console.log(error);
    }
  });

  const handleUnlockedChallengeClick = (clickedChallenge) => {
    navigate(clickedChallenge.title.toLowerCase(), {
      state: {
        // narrow down the data object to only the clicked challenge and the pathProgressId
        data: {
          challenge: clickedChallenge,
          pathProgressId: data?.pathProgress._id,
        },
      },
    });
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-8 bg-gray-800 h-[calc(100vh-48px)] overflow-y-auto">
      {data?.learningPath?.challenges.map((challenge, index) => (
        <div key={challenge._id} className="challenge-tile col-span-3">
          {isChallengeUnlocked(challenge._id) ? (
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:to-cyan-600 p-8 text-white rounded-md cursor-pointer">
              <div onClick={() => handleUnlockedChallengeClick(challenge)}>
                <img src="https://via.placeholder.com/40" alt={`Challenge: ${challenge.title}`} className="mb-4 rounded-md" />
                <h2 className="text-2xl font-bold">{challenge.title}</h2>
              </div>
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
