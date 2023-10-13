import { useEffect, useState } from "react";
import { Box, FormControl, Input, Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  useFetchMessagesQuery,
  useSendMessageMutation,
} from "../../slices/messageApiSlice";
import { useFetchChatsQuery } from "../../slices/chatApiSlice";
import ScrollableChat from "./ScrollableChat";
import Lottie from "lottie-react";
import typingIndicator from "../../assets/typing-indicator.json";
import socket from "../../socket";
import {
  useCreateNotificationMutation,
  useFetchNotificationsQuery,
} from "../../slices/notificationApiSlice";

let selectedChatCompare;

const SingleChat = () => {
  /* STATE */
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  /* REDUX STUFF */
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  /* MUTATIONS */
  const [sendMessageMutation] = useSendMessageMutation();
  const [createNotification] = useCreateNotificationMutation();

  /* QUERIES */
  const { refetch: refetchChats } = useFetchChatsQuery();
  const { data: messages, refetch: refetchMessages } = useFetchMessagesQuery(
    selectedChat?._id
  );
  const { refetch: refetchNotifications } = useFetchNotificationsQuery();

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      const res = await sendMessageMutation({
        chatId: selectedChat._id,
        content: newMessage,
      }).unwrap();
      socket.emit("new message", res);
      refetchMessages();
      refetchChats();
      setNewMessage("");
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      console.log("socket not connected!");
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const createNewNotification = async (message, recipient, chat) => {
    const res = await createNotification({
      message,
      recipient,
      chat,
    }).unwrap();
  };

  useEffect(() => {
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!newMessageReceived.chat.isGroupChat) {
          createNewNotification(
            newMessageReceived.content,
            userInfo._id,
            newMessageReceived.chat
          );
        }
        refetchChats();
        refetchMessages();
        refetchNotifications();
      } else {
        refetchChats();
        refetchMessages();
      }
    });
  }, []);

  useEffect(() => {
    socket.emit("join chat", {
      username: userInfo.username,
      room: selectedChat?._id,
    });
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Box flex="1" overflowY="auto" padding="1em">
            <ScrollableChat messages={messages} />
          </Box>
          <FormControl onKeyDown={sendMessage} height="auto" padding="10px">
            {isTyping ? (
              <div>
                <Lottie
                  animationData={typingIndicator}
                  loop={true}
                  style={{ marginBottom: 15, marginLeft: 0, width: 60 }}
                />
              </div>
            ) : (
              <></>
            )}
            <Input
              bg="rgba(255, 255, 255, 0.65)"
              border="none"
              padding="1em"
              _focusVisible={false}
              placeholder="Enter a message ..."
              height="60px"
              _hover={{ outline: "none" }}
              autoComplete="off"
              value={newMessage}
              onChange={typingHandler}
            />
          </FormControl>
        </>
      ) : (
        <Flex h="full" justify="center" align="center">
          <Text color="gray.600" fontStyle="italic">
            Click on a user to start chatting
          </Text>
        </Flex>
      )}
    </>
  );
};

export default SingleChat;
