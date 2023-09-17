import { Box, FormControl, Input } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const SingleChat = () => {
  const { selectedChat } = useSelector((state) => state.auth);

  const sendMessage = () => {};

  return (
    <>
      {selectedChat ? (
        <>
          <Box flex="1" overflowY="auto" padding="1em">
            {/* SCROLLABLE CHAT HERE */}
          </Box>
          <FormControl onKeyDown={sendMessage} padding="1em" height="auto">
            {/* @TODO - Add typing indicator here if user is typing */}
            <Input
              bg="gray.100"
              border="none"
              padding="1em"
              _focusVisible={false}
              placeholder="Enter a message ..."
              height="60px"
              _hover={{ outline: "none" }}
              autoComplete="off"
            />
          </FormControl>
        </>
      ) : (
        "Click on a user to start chatting"
      )}
    </>
  );
};

export default SingleChat;
