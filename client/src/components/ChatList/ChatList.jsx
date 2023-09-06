import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Input,
  IconButton,
  Avatar,
  AvatarBadge,
  Text,
} from "@chakra-ui/react";
import { HiOutlineSearch } from "react-icons/hi";
import UserSettingsAndChat from "./UserSettingsAndChat";
import { useFetchChatsMutation } from "../../slices/chatApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../slices/authSlice";
import { getSender } from "../../utils/ChatHelpers";

const ChatList = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [chats, setChats] = useState([]);

  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [fetchChats, { isLoading }] = useFetchChatsMutation();

  const fetchAllUserChats = async () => {
    try {
      const res = await fetchChats().unwrap();
      setChats(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllUserChats();
  }, [chats]);

  return (
    <Box width="25%" display="flex" flexDirection="column">
      <UserSettingsAndChat />
      {/* Search Chats */}
      <Flex
        justifyContent="center"
        border="1px"
        borderColor="gray.200"
        borderRadius="5px"
        width="95%"
        mx="auto"
      >
        <IconButton
          icon={<HiOutlineSearch />}
          bg="transparent"
          _hover={{ bg: "transparent" }}
        />

        <Input
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search your chats ..."
          border="none"
          _focusVisible={false}
        />
      </Flex>
      {/* List of Chats */}
      {/* fetch all User Chats: if there is an input value, filter based on input value or else just display all chats */}
      {chats.length > 0 ? (
        <Box overflowY="scroll">
          {chats.map((chat) => {
            // console.log(chat);
            const sender = getSender(userInfo, chat.users);
            return (
              <Flex
                padding="1rem"
                cursor="pointer"
                bg={selectedChat === chat ? "blue.100" : ""}
                _hover={
                  selectedChat === chat
                    ? { bg: "blue.100" }
                    : { bg: "gray.100" }
                }
                onClick={() => dispatch(setSelectedChat(chat))}
                key={chat._id}
              >
                {chat.isGroupChat ? (
                  {
                    /* GROUP CHAT */
                  }
                ) : (
                  <>
                    <Avatar
                      size="md"
                      mr={3}
                      name={sender.name}
                      src={sender.profilePic}
                    >
                      <AvatarBadge boxSize="1em" bg="green.500" />
                    </Avatar>
                    <Box marginLeft=".5rem">
                      {/* Sender Name */}
                      <Text fontSize="18px">{sender.username}</Text>
                      {/* Last Message */}
                      <Text fontSize="sm">
                        {chat.lastMessage
                          ? chat.lastMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.latestMessage.content
                          : "Send first message 👋"}
                      </Text>
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
