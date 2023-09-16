import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Flex, Tooltip, Avatar } from "@chakra-ui/react";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../../utils/ChatLogicHelpers";

const ScrollableChat = ({ messages }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <Box overflowX="hidden" overflowY="auto">
      {messages?.map((message, index) => {
        return (
          <Flex key={message._id}>
            {(isSameSender(messages, message, index, userInfo._id) ||
              isLastMessage(messages, index, userInfo._id)) && (
              <Tooltip
                label={message.sender.username}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  name={message.sender.username}
                  src={message.sender.profilePic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === userInfo._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(
                  messages,
                  message,
                  index,
                  userInfo._id
                ),
                marginTop: isSameUser(messages, message, index, userInfo._id)
                  ? "3px"
                  : "10px",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {message.content}
            </span>
          </Flex>
        );
      })}
      <Box ref={messagesEndRef}></Box>
    </Box>
  );
};

export default ScrollableChat;
