/* eslint-disable react/prop-types */
const Question = ({ question }) => {
  if (!question) return null;
  return (
    <div className="p-4">
      <div className="text-lg font-semibold mb-4 text-center">Question</div>
      <pre>{question.question}</pre>
      <div className="text-lg font-semibold mt-4 text-center">Examples</div>
      <pre>{question.example}</pre>
    </div>
  );
};

export default Question;
