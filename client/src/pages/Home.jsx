import { Flex } from "@chakra-ui/react";
import ChatList from "../components/ChatList";

const Home = () => {
  return (
    <Flex margin="2rem" height="90dvh">
      <ChatList />
    </Flex>
  );
};

export default Home;
