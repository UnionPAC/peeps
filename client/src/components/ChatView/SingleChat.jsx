import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, FormControl, Input, Spinner, useToast } from "@chakra-ui/react";
import {
  useSendMessageMutation,
  useFetchMessagesQuery,
} from "../../slices/messageApiSlice";
import ScrollableChat from "./ScrollableChat";
import { useFetchChatsQuery } from "../../slices/chatApiSlice";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
let socket, selectedChatCompare;

const SingleChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const [sendMessageMutation] = useSendMessageMutation();

  const { isLoading, refetch: refetchMessages } = useFetchMessagesQuery(
    selectedChat?._id
  );
  const { refetch: refetchChats } = useFetchChatsQuery();

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const res = await sendMessageMutation({
          chatId: selectedChat?._id,
          content: newMessage,
        }).unwrap();
        socket.emit("new message", res);
        refetchMessages();
        refetchChats();
      } catch (error) {
        toast({
          title: error.data.message,
          description: "Failed to send message",
          status: "error",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    socket.emit("chat join", { user: userInfo, room: selectedChat?._id });
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      // if chat not selected or doesn't match current chat
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // send notification
      } else {
        refetchMessages()
      }
    })
  })

  return (
    <>
      {selectedChat ? (
        <>
          <Box flex="1" overflowY="auto" padding="1em">
            {isLoading ? (
              <Spinner
                size="lg"
                w={10}
                h={10}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <>
                <ScrollableChat />
              </>
            )}
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
              onChange={typingHandler}
              value={newMessage}
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
