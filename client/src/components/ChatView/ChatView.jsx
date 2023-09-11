import { Flex } from "@chakra-ui/react";
import ChatInfoAndSettings from "./ChatInfoAndSettings";
import SingleChat from "./SingleChat";

const ChatView = () => {
  return (
    <Flex flexDirection='column' width="100%">
      <ChatInfoAndSettings />
      <SingleChat />
    </Flex>
  );
};

export default ChatView;
