import { Box } from "@chakra-ui/react";
import ChatInfoAndSettings from "./ChatInfoAndSettings";
import SingleChat from "./SingleChat";

const ChatView = () => {
  return (
    <Box width="100%" height="100%">
      <ChatInfoAndSettings />
      <SingleChat />
    </Box>
  );
};

export default ChatView;
