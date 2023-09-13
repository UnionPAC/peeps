import { useState } from "react";
import { Box, Flex, Avatar, Text } from "@chakra-ui/react";
import ChatListHeader from "./ChatListHeader";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../slices/authSlice";
import { getSenderUsername, getFullSender } from "../../utils/ChatLogicHelpers";

const ChatList = () => {
  const [chats, setChats] = useState([]);

  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  return (
    <Box
      width="25%"
      display="flex"
      flexDirection="column"
      borderRight="1px solid lightgrey"
    >
      <ChatListHeader />

      {/* List of Chats */}
      {chats.length > 0 ? (
        <Box overflowY="scroll">
          {chats.map((chat) => {
            return (
              <Flex
                padding="1rem"
                cursor="pointer"
                bg={selectedChat?._id === chat?._id ? "blue.100" : ""}
                _hover={
                  selectedChat?._id === chat?._id
                    ? { bg: "blue.100" }
                    : { bg: "gray.200" }
                }
                onClick={() => dispatch(setSelectedChat(chat))}
                key={chat._id}
              >
                {chat.isGroupChat ? (
                  <>
                    <Flex>
                      <Avatar name={chat.name} size="md" mr={3} />
                      <Box marginLeft="0.5rem">
                        <Text fontSize="18px">{chat.name}</Text>
                        <Text fontSize="sm">Send first message 👋</Text>
                      </Box>
                    </Flex>
                  </>
                ) : (
                  <>
                    <Avatar
                      size="md"
                      mr={3}
                      name={getFullSender(userInfo, chat.users).name}
                      src={getFullSender(userInfo, chat.users).profilePic}
                    >
                      {/* <AvatarBadge boxSize="1em" bg="green.500" /> */}
                    </Avatar>
                    <Box marginLeft=".5rem">
                      <Text fontSize="18px">
                        {getSenderUsername(userInfo, chat.users)}
                      </Text>
                      {/* Last Message */}
                      <Text fontSize="sm">Send first message 👋</Text>
                    </Box>
                  </>
                )}
              </Flex>
            );
          })}
        </Box>
      ) : (
        <Flex width="100%" height="100%" justify="center" mt="4rem">
          <Text color="gray.600" fontStyle="italic">
            You don't have any chats yet!
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default ChatList;
