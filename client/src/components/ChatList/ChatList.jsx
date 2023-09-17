import { Box, Flex, Avatar, Text, Spinner } from "@chakra-ui/react";
import ChatListHeader from "./ChatListHeader";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../slices/authSlice";
import { useFetchChatsQuery } from "../../slices/chatApiSlice";
import { getSenderUsername, getFullSender } from "../../utils/ChatLogicHelpers";

const ChatList = () => {
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { data: chats } = useFetchChatsQuery();

  return (
    <Box width="25%" borderRight="1px solid lightgrey">
      <ChatListHeader />

      {/* List of Chats */}
      {chats?.length > 0 ? (
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
                        <Text fontSize="small">
                          <span style={{fontWeight: "500"}}>{chat.lastMessage.sender.username}: </span>{" "}
                          {chat.lastMessage.content.length > 40
                            ? chat.lastMessage.content.substring(0, 41) +
                              "..."
                            : chat.lastMessage.content}
                        </Text>
                      ) : (
                        <Text fontSize="small">Send first message 👋</Text>
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
                    ></Avatar>
                    <Box marginLeft=".5rem">
                      <Text fontSize="18px">
                        {getSenderUsername(userInfo, chat.users)}
                      </Text>

                      {chat.lastMessage ? (
                        <Text fontSize="small">
                          {chat.lastMessage.content.length > 40
                            ? chat.lastMessage.content.substring(0, 41) +
                              "..."
                            : chat.lastMessage.content}
                        </Text>
                      ) : (
                        <Text fontSize="small">Send first message 👋</Text>
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
