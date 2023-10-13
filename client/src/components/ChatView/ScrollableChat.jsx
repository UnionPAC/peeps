import { Flex, Box, Tooltip, Avatar } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSenderMargin,
  isSameSender,
  isSameUser,
} from "../../utils/ChatLogicHelpers";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";

const ScrollableChat = ({ messages }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const lastMessageRef = useRef();

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box>
      {messages?.map((message, index) => {
        return (
          <Flex key={message._id}>
            {(isSameSender(messages, message, index, userInfo._id) ||
              isLastMessage(messages, index, userInfo._id)) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
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
                  ? 6
                  : 10,
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
      <Box ref={lastMessageRef}></Box>
    </Box>
  );
};

export default ScrollableChat;
