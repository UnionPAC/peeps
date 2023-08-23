import { Box, Flex, Input, IconButton } from "@chakra-ui/react";
import { HiOutlineSearch } from "react-icons/hi";
import UserSettingsAndChat from "./UserSettingsAndChat";

const ChatList = () => {
  

  return (
    <Box width="25%" display="flex" flexDirection="column">
      <UserSettingsAndChat />
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
          placeholder="Search or start new chat"
          border="none"
          _focusVisible={false}
        />
      </Flex>
  
    </Box>
  );
};

export default ChatList;
