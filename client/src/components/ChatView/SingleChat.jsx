import {
  Flex,
  Box,
  FormControl,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  useSendMessageMutation,
  useFetchMessagesQuery,
} from "../../slices/messageApiSlice";
import { useState } from "react";
import ScrollableChat from "./ScrollableChat";

const SingleChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const { selectedChat } = useSelector((state) => state.auth);

  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const [sendMessageMutation] = useSendMessageMutation();

  const { data, refetch, isLoading } = useFetchMessagesQuery(selectedChat?._id);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic Here:
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const res = await sendMessageMutation({
          chatId: selectedChat._id,
          content: newMessage,
        }).unwrap();
        refetch();
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
    <>
      {selectedChat ? (
        <Flex direction="column" height='100%'>
          <>
            {isLoading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <ScrollableChat messages={data} />
            )}
          </>
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
        </Flex>
      ) : (
        "Click on a user to start chatting"
      )}
    </>
  );
};

export default SingleChat;
