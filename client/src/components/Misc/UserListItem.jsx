import { Box, Text, Avatar, Flex } from "@chakra-ui/react";
import { useAccessChatMutation } from "../../slices/chatApiSlice";

const UserListItem = ({ onClose }) => {
  const [accessChat] = useAccessChatMutation();

  const handleAccessChat = async () => {
    try {
      const res = await accessChat().unwrap();
      onClose();
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex
      cursor="pointer"
      bg="gray.100"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      // Chat API Slice
      onClick={handleAccessChat}
    >
      <Avatar size="sm" mr={3} name={null} src={null} />
      <Box>
        <Text>{/* username */}</Text>
        <Text fontSize="xs">{/* email */}</Text>
      </Box>
    </Flex>
  );
};

export default UserListItem;
