import { Box, Text, Avatar, Flex } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction, setSearch }) => {
  const { name, username, email, profilePic } = user;

  return (
    <Flex
      cursor="pointer"
      bg="gray.100"
      _hover={{
        background: "#5175fe",
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
      onClick={() => {
        if (handleFunction) {
          handleFunction();
          setSearch("");
        } else {
          return;
        }
      }}
    >
      <Avatar size="sm" mr={3} name={username || name} src={profilePic} />
      <Box>
        <Text>{username}</Text>
        <Text fontSize="xs">{email}</Text>
      </Box>
    </Flex>
  );
};

export default UserListItem;
