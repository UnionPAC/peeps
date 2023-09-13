import { Flex } from "@chakra-ui/react";
import ChatViewHeader from "./ChatViewHeader";
import SingleChat from "./SingleChat";

const ChatView = () => {
  return (
    <Flex flexDirection="column" width="100%">
      <ChatViewHeader />
      <SingleChat />
    </Flex>
  );
};

export default ChatView;
