import { Flex, Box, Text, Avatar, AvatarBadge } from "@chakra-ui/react";

const ChatBox = () => {
  return (
    <Flex padding="1rem">
      <Avatar size="md" mr={3} name={null} src={null}>
        <AvatarBadge boxSize="1em" bg="green.500" />
      </Avatar>
      <Box marginLeft=".5rem">
        <Text fontSize="18px">
          {/* Username of the person your're chatting with */}
        </Text>
        <Text fontSize="sm">{/* Last Message */}</Text>
      </Box>
    </Flex>
  );
};

export default ChatBox;
