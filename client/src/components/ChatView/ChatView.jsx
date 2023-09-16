import { Flex } from "@chakra-ui/react";
import ChatViewHeader from "./ChatViewHeader";
import SingleChat from "./SingleChat";

const ChatView = () => {
  return (
    <Flex direction="column" height="100%" flex={1}>
      <ChatViewHeader />
      <SingleChat />
    </Flex>
  );
};

export default ChatView;
