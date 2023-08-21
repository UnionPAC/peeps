import { Flex } from "@chakra-ui/react";
import ChatList from "../components/ChatList";
import ChatView from "../components/ChatView";

const Home = () => {
  return (
    <Flex margin='2rem' height='90dvh'>
      <ChatList />
      <ChatView />
    </Flex>
  );
};

export default Home;
