import PropTypes from "prop-types";
import TopicList from "./content/TopicList";

const Main = ({ category }) => {
  return (
    <main>
      <TopicList category={category} />
    </main>
  );
};

Main.propTypes = {
  category: PropTypes.string,
};

export default Main;
