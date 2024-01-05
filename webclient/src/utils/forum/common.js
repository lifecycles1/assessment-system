// updates the newly added topic or reply to their respective feeds
export const updateFeed = (newItem, setList) => {
  setList((prevItems) => [...prevItems, newItem]);
};
