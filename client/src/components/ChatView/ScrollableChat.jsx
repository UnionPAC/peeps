import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";

const ScrollableChat = ({ messages }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return <ScrollableFeed></ScrollableFeed>;
};

export default ScrollableChat;
