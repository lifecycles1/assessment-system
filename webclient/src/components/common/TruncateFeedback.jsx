import PropTypes from "prop-types";
import { useState } from "react";

const TruncateFeedback = ({ text, maxWords }) => {
  const words = text.split(" ");
  const truncatedText = words.slice(0, maxWords).join(" ");
  const isTruncated = words.length > maxWords;
  const [expanded, setExpanded] = useState(false);

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
  text: PropTypes.string.isRequired,
  maxWords: PropTypes.number.isRequired,
};

export default TruncateFeedback;
