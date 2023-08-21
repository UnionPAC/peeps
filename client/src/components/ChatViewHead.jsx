import { Flex, Avatar, Text, IconButton } from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";

const ChatViewHead = () => {
  return (
    <Flex alignItems="center" margin="1rem" justifyContent="space-between">
      <Flex>
        <Avatar name="Andy Lansens" mr="1rem" />
        <Text>Andy Lansens</Text>
      </Flex>
      <IconButton icon={<HiDotsVertical />} bg="transparent" />
    </Flex>
  );
};

export default ChatViewHead;
