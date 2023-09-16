import { Box, Flex, Avatar, Text, Spinner } from "@chakra-ui/react";
import ChatListHeader from "./ChatListHeader";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../slices/authSlice";
import { useFetchChatsQuery } from "../../slices/chatApiSlice";
import { getSenderUsername, getFullSender } from "../../utils/ChatLogicHelpers";
import { useEffect } from "react";

const ChatList = () => {
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { data: chats, isLoading, isFetching, refetch } = useFetchChatsQuery();

  return (
    <Box width="25%" borderRight="1px solid lightgrey">
      <ChatListHeader />

      {/* List of Chats */}
      {isLoading || isFetching ? (
        <Spinner size="lg" w={10} h={10} alignSelf="center" margin="auto" />
      ) : chats?.length > 0 ? (
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
                    <Avatar name={chat.name} size="md" mr={3} />
                    <Box marginLeft="0.5rem">
                      <Text fontSize="18px">{chat.name}</Text>
                      {chat.lastMessage ? (
                        <Text fontSize="sm">
                          {chat.lastMessage.sender.username}:{" "}
                          {chat.lastMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.lastMessage.content}
                        </Text>
                      ) : (
                        <Text fontSize="sm">Send first message 👋</Text>
                      )}
                    </Box>
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
                      {chat.lastMessage ? (
                        <Text fontSize="sm">
                          {chat.lastMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.lastMessage.content}
                        </Text>
                      ) : (
                        <Text fontSize="sm">Send first message 👋</Text>
                      )}
                    </Box>
                  </>
                )}
              </Flex>
            );
          })}
        </Box>
      ) : (
        <Flex justify="center" mt="4rem">
          <Text color="gray.600" fontStyle="italic">
            You don't have any chats yet
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default ChatList;
