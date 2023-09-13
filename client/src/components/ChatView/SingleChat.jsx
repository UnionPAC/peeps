import {
  Flex,
  Box,
  FormControl,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useSendMessageMutation } from "../../slices/messageApiSlice";
import { useState } from "react";
import ScrollableChat from "./ScrollableChat";

const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const [sendMessageMutation] = useSendMessageMutation();

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic Here:
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        console.log("sending message");
        setNewMessage("");
        const res = await sendMessageMutation({
          chatId: selectedChat._id,
          content: newMessage,
        }).unwrap();
        console.log(res);
        setMessages([...messages, res]);
      } catch (error) {
        console.log(error);
        toast({
          title: error.data.message,
          description: "Failed to send message",
          status: "error",
        });
      }
    }
  };

  return (
    <Flex height="100%" direction="column">
      {selectedChat ? (
        <>
          {loading ? (
            <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
          ) : (
            <>
              <Box padding="1em" marginBottom="3em" maxH="735px">
                <ScrollableChat messages={messages} />
              </Box>
            </>
          )}
          <FormControl onKeyDown={sendMessage} padding="1em" bg="gray.100">
            <Input
              bg="white"
              border="none"
              padding="1em"
              _focusVisible={false}
              placeholder="Enter a message ..."
              height="60px"
              _hover={{ outline: "none" }}
              onChange={typingHandler}
              value={newMessage}
            />
          </FormControl>
        </>
      ) : (
        "Click on a user to start chatting"
      )}
    </Flex>
  );
};

export default SingleChat;
