import { Flex } from "@chakra-ui/react";
import ChatList from "../components/ChatList/ChatList";
import ChatView from "../components/ChatView/ChatView";
import socket from "../socket";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    socket.emit("setup", userInfo);
  });

  return (
    <Flex height="100%">
      <ChatList />
      <ChatView />
    </Flex>
  );
};

export default Home;
