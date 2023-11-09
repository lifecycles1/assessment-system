import PropTypes from "prop-types";
import { useState } from "react";

const TruncateFeedback = ({ text, maxWords = 80 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const words = text.split(" ");
  const truncatedText = words.slice(0, maxWords).join(" ");
  const isTruncated = words.length > maxWords;

  return (
    <div className="text-sm">
      {isTruncated && (
        <div>
          {expanded ? text : <>{truncatedText}...</>}
          <button className="text-sm italic font-semibold" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show less" : "Show more"}
          </button>
        </div>
      )}
      {!isTruncated && text}
    </div>
  );
};

TruncateFeedback.propTypes = {
  text: PropTypes.string,
  maxWords: PropTypes.number,
};

export default TruncateFeedback;
