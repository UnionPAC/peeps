import { Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const SingleChat = () => {
  const { selectedChat } = useSelector((state) => state.auth);

  return (
    <Flex justify="center" align="center" height="100%">
      {selectedChat ? (
        <Text fontSize="2xl" color="gray.700">
          Show Chat
        </Text>
      ) : (
        <Text fontSize="2xl" color="gray.700">
          No Chat Selected
        </Text>
      )}
    </Flex>
  );
};

export default SingleChat;
