import { useState } from "react";
import { Box, FormControl, Input } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  useFetchMessagesQuery,
  useSendMessageMutation,
} from "../../slices/messageApiSlice";
import { useFetchChatsQuery } from "../../slices/chatApiSlice";
import ScrollableChat from "./ScrollableChat";
import Lottie from "lottie-react";
import typingIndicator from "../../assets/typing-indicator.json";

let selectedChatCompare;

const SingleChat = () => {
  /* STATE */
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  /* REDUX STUFF */
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  /* MUTATIONS */
  const [sendMessageMutation] = useSendMessageMutation();

  /* QUERIES */
  const { refetch: refetchChats } = useFetchChatsQuery();
  const { data: messages, refetch: refetchMessages } = useFetchMessagesQuery(
    selectedChat?._id
  );

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      const res = await sendMessageMutation({
        chatId: selectedChat._id,
        content: newMessage,
      }).unwrap();
      refetchMessages();
      refetchChats();
      setNewMessage("");
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
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
