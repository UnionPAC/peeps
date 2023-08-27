import { Box, Flex, Input, IconButton } from "@chakra-ui/react";
import { HiOutlineSearch } from "react-icons/hi";
import UserSettingsAndChat from "./UserSettingsAndChat";

const ChatList = () => {
  return (
    <Box width="25%" display="flex" flexDirection="column">
      <UserSettingsAndChat />
      {/* Search Chats */}
      <Flex
        justifyContent="center"
        border="1px"
        borderColor="gray.200"
        borderRadius="5px"
        width="95%"
        mx="auto"
      >
        <IconButton
          icon={<HiOutlineSearch />}
          bg="transparent"
          _hover={{ bg: "transparent" }}
        />

        <Input
          placeholder="Search your chats ..."
          border="none"
          _focusVisible={false}
        />
      </Flex>
      {/* List of Chats */}
      {/* fetch all User Chats: if there is an input value, filter based on input value or else just display all chats */}
    </Box>
  );
};

export default ChatList;
