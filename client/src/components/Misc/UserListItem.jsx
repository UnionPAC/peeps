import { Box, Text, Avatar, Flex } from "@chakra-ui/react";
import { useAccessChatMutation } from "../../slices/chatApiSlice";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../slices/authSlice";

const UserListItem = ({ onClose, user, setSearchUser }) => {
  const { _id, name, username, email, profilePic } = user;
  const [accessChat] = useAccessChatMutation();

  const dispatch = useDispatch();

  const handleAccessChat = async () => {
    try {
      const res = await accessChat(_id).unwrap();
      // set to selected chat
      dispatch(setSelectedChat(res));
      onClose();
      setSearchUser("");
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
      mb={1}
      borderRadius="lg"
      onClick={handleAccessChat}
    >
      <Avatar size="sm" mr={3} name={name} src={profilePic} />
      <Box>
        <Text>{username}</Text>
        <Text fontSize="xs">{email}</Text>
      </Box>
    </Flex>
  );
};

export default UserListItem;
