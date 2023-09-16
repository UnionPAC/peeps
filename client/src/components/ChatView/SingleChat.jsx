import { Box, FormControl, Input, Spinner, useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  useSendMessageMutation,
  useFetchMessagesQuery,
} from "../../slices/messageApiSlice";
import { useState, useEffect } from "react";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "lottie-react";
import typingIndicator from "../../assets/typing-indicator.json";
import { useDispatch } from "react-redux";
import { setNotifications } from "../../slices/authSlice";
import { useFetchChatsQuery } from "../../slices/chatApiSlice";

const ENDPOINT = "http://localhost:8000";
let socket, selectedChatCompare;

const SingleChat = () => {
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const { userInfo, selectedChat, notifications } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const [sendMessageMutation] = useSendMessageMutation();

  const { refetch: refetchChats } = useFetchChatsQuery();
  const {
    data,
    refetch: refetchMessages,
    isLoading,
  } = useFetchMessagesQuery(selectedChat?._id);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat?._id);
      try {
        setNewMessage("");
        const res = await sendMessageMutation({
          chatId: selectedChat._id,
          content: newMessage,
        }).unwrap();
        socket.emit("new message", res);
        refetchMessages();
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

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.emit("chat join", selectedChat?._id);
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      // chat not selected or message doesn't match current chat
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          // send notification
          dispatch(setNotifications([...notifications, newMessageReceived]));
          refetchChats();
        }
      } else {
        refetchMessages();
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat?._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const differenceInTime = timeNow - lastTypingTime;

      if (differenceInTime >= timerLength && typing) {
        socket.emit("stop typing", selectedChat?._id);
        setTyping(false);
      }
    }, timerLength);
  };

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
                <ScrollableChat messages={data} />
              </>
            )}
          </Box>
          <Box bgColor="transparent" paddingTop="15px">
            {isTyping && (
              <Lottie
                animationData={typingIndicator}
                loop={true}
                style={{ marginBottom: 15, width: 60 }}
              />
            )}
          </Box>
          <FormControl
            onKeyDown={sendMessage}
            padding="1em"
            bg="gray.100"
            height="auto"
          >
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
