import PropTypes from "prop-types";

const Question = ({ question }) => {
  if (!question) return null;
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div className="font-bold italic ml-4">{question.title}</div>
        <div className="flex mr-4 space-x-3 text-sm">
          <div className="flex space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#34a194" className="w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-gray-500 font-bold">{question.suggestedTime}</div>
          </div>
          <div className="text-gray-500 font-semibold">|</div>
          <div className="text-gray-500 font-bold">{question.difficulty}</div>
        </div>
      </div>
      <div className="font-semibold mb-4 text-center mt-10">Question</div>
      <pre className="text-sm">{question.question}</pre>
      <div className="font-semibold mt-4 mb-4 text-center">Examples</div>
      <pre className="text-sm">{question.example}</pre>
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.object,
};

export default Question;
