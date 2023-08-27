import { Box, Text, Avatar, Flex } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useAccessChatMutation } from "../slices/chatApiSlice";
import { setSelectedChat } from "../slices/chatSlice";

const UserListItem = ({ user, onClose }) => {
  const { email, name, username, _id: userToChatId, profilePic } = user;

  const dispatch = useDispatch();

  const [accessChat, { isLoading, isError }] = useAccessChatMutation();

  const handleAccessChat = async () => {
    try {
      const res = await accessChat(userToChatId).unwrap();
      // console.log(res);
      // set ID of person you want to chat with
      // that way in the chatList we can identify the selected chat if the chat ID which is clicked
      // is equal to the selected chat ID
      dispatch(setSelectedChat({ id: userToChatId }));
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
      <Avatar size="sm" mr={3} name={username} src={profilePic} />
      <Box>
        <Text>{username}</Text>
        <Text fontSize="xs">Email: {email}</Text>
      </Box>
    </Flex>
  );
};

export default UserListItem;
