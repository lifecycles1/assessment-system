// updates the newly added topic or reply to their respective feeds
export const updateFeed = (newItem, setList) => {
  setList((prevItems) => [...prevItems, newItem]);
};

/**
 * Calculates the time difference between the current date and a given date
 * that a topic or reply was created.
 * @param {string} date - The date to calculate the time difference from.
 * @returns {object} - An object containing the display value and hover text.
 */
export const calculateTimeDifference = (date) => {
  const currentDate = new Date();
  const creationDate = new Date(date);
  const timeDifference = currentDate - creationDate;

  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  const hoverText = creationDate.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true });

  if (timeDifference < 60 * 1000) {
    return { display: "0m", hoverText };
  } else if (timeDifference < 60 * 60 * 1000) {
    return { display: `${minutes}m`, hoverText };
  } else if (timeDifference < 24 * 60 * 60 * 1000) {
    return { display: `${hours}h`, hoverText };
  } else if (timeDifference < 30 * 24 * 60 * 60 * 1000) {
    return { display: `${days}d`, hoverText };
  } else {
    const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return { display: monthAbbreviations[creationDate.getMonth()] + " '" + (creationDate.getFullYear() % 100), hoverText };
  }
};
