import { Flex, Box, Text, Avatar, AvatarBadge } from "@chakra-ui/react";
import { setSelectedChat } from "../slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";

const ChatBox = ({ chat }) => {
  const { users, lastMessage } = chat;
  const { selectedChat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const userChattingWith = users[1];
  const { username, profilePic, _id } = userChattingWith;

  // set chat to selected chat
  const handleSelectUser = () => {
    try {
      dispatch(setSelectedChat(_id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Flex
      padding="1rem"
      _hover={{ bgColor: "gray.100" }}
      onClick={handleSelectUser}
      bgColor={selectedChat === _id ? "blue.100" : ""}
      borderRadius="2px"
    >
      <Avatar size="md" mr={3} name={username} src={profilePic}>
        <AvatarBadge boxSize="1em" bg="green.500" />
      </Avatar>
      <Box marginLeft=".5rem">
        <Text fontSize="18px">{username}</Text>
        <Text fontSize="sm">{lastMessage || "Say Hi 👋"}</Text>
      </Box>
    </Flex>
  );
};

export default ChatBox;
