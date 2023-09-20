import { useState, useEffect } from "react";
import { Box, FormControl, Input } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
// import { setNotifications } from "../../slices/authSlice";
import {
  useFetchMessagesQuery,
  useSendMessageMutation,
} from "../../slices/messageApiSlice";
import { useFetchChatsQuery } from "../../slices/chatApiSlice";
import {
  useFetchNotificationsQuery,
  useCreateNotificationMutation,
} from "../../slices/notificationApiSlice";
import { io } from "socket.io-client";
import ScrollableChat from "./ScrollableChat";
import Lottie from "lottie-react";
import typingIndicator from "../../assets/typing-indicator.json";

let socket, selectedChatCompare;
const ENDPOINT = "http://localhost:8000";

const SingleChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const [sendMessageMutation] = useSendMessageMutation();
  const [createNotificationMutation] = useCreateNotificationMutation();
  const { refetch: refetchChats } = useFetchChatsQuery();
  const { data: messages, refetch: refetchMessages } = useFetchMessagesQuery(
    selectedChat?._id
  );
  const { data: notifications, refetch: refetchNotifications } =
    useFetchNotificationsQuery();

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      // send message API call
      socket.emit("stop typing", selectedChat._id);
      const res = await sendMessageMutation({
        chatId: selectedChat._id,
        content: newMessage,
      }).unwrap();
      socket.emit("new message", res);
      refetchMessages();
      refetchChats();
      refetchNotifications();
      setNewMessage("");
    }
  };

  const createNotification = async (message, recipients, chat) => {
    try {
      const res = await createNotificationMutation({
        message,
        recipients,
        chat,
      }).unwrap();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("message received", (newMessageReceived) => {
      console.log("new message incoming ...");
      // if there is no chat selected OR selected chat isn't the chat for this message
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        console.log("maybe give notification");
        // check to make sure the notifications does not include the id of the newMessageReceived
        if (!notifications?.includes(newMessageReceived._id)) {
          refetchChats();
          console.log("give notification");
          createNotification(
            newMessageReceived.content,
            userInfo,
            newMessageReceived.chat
          );
          refetchNotifications();
        }
      } else {
        refetchChats();
        refetchMessages();
      }
    });
  }, []);

  useEffect(() => {
    socket.emit("join chat", selectedChat?._id);
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

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
              bg="gray.100"
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
        "Click on a user to start chatting"
      )}
    </>
  );
};

export default SingleChat;
