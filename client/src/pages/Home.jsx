import { Flex } from "@chakra-ui/react";
import ChatList from "../components/ChatList/ChatList";
import ChatView from "../components/ChatView/ChatView";

const Home = () => {
  return (
    <Flex height="100dvh">
      <ChatList />
      <ChatView />
    </Flex>
  );
};

export default Home;
