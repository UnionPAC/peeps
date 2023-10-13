import { Box, Flex, Avatar, AvatarBadge, Text, Badge } from "@chakra-ui/react";
import ChatListHeader from "./ChatListHeader";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../slices/authSlice";
import { useFetchChatsQuery } from "../../slices/chatApiSlice";
import { getSenderUsername, getFullSender } from "../../utils/ChatLogicHelpers";
import {
  useDeleteNotificationMutation,
  useFetchNotificationsQuery,
} from "../../slices/notificationApiSlice";
import { useFetchMessagesQuery } from "../../slices/messageApiSlice";

const ChatList = () => {
  /* REDUX STUFF */
  const { userInfo, selectedChat } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /* QUERIES */
  const { data: chats, refetch: refetchChats } = useFetchChatsQuery();
  const { refetch: refetchMessages } = useFetchMessagesQuery();
  const { data: notifications, refetch: refetchNotifications } =
    useFetchNotificationsQuery();

  /* MUTATIONS */
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleChatClick = async (chat) => {
    try {
      dispatch(setSelectedChat(chat));
      // delete all notifications that were from this chat
      const notificationsToDelete = notifications.filter(
        (notif) => notif.chat._id === chat._id
      );
      // Use Promise.all to await all delete operations
      await Promise.all(
        notificationsToDelete.map(async (n) => {
          await deleteNotification(n._id).unwrap();
        })
      );
      // After deleting notifications, refetch them
      await refetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      borderRight="1px solid lightgrey"
      minW="25%"
    >
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
                onClick={() => handleChatClick(chat)}
                key={chat._id}
              >
                {chat.isGroupChat ? (
                  <>
                    <Avatar name={chat.name} size="md" mr={3} />
                    <Box marginLeft="0.5rem">
                      <Text fontSize="16px" fontWeight="medium">
                        {chat.name}
                      </Text>
                      {chat.lastMessage ? (
                        <Text fontSize="small">
                          <span style={{ fontWeight: "500" }}>
                            {chat.lastMessage.sender.username}:{" "}
                          </span>{" "}
                          {chat.lastMessage.content.length > 40
                            ? chat.lastMessage.content.substring(0, 41) + "..."
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
                      name={
                        getFullSender(userInfo, chat.users).username ||
                        getFullSender(userInfo, chat.users).username
                      }
                      src={getFullSender(userInfo, chat.users).profilePic || `chick.svg`}
                    ></Avatar>
                    <Flex
                      width="100%"
                      marginLeft=".5rem"
                      align="center"
                      justify="space-between"
                    >
                      <Box>
                        <Text fontSize="16px" fontWeight="medium">
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
                      <Box>
                        {/* Display notification count (from this specific user) here */}
                        {notifications?.filter(
                          (notif) => notif.chat._id == chat._id
                        ).length > 0 &&
                          notifications?.filter(
                            (notif) => notif.chat._id == chat._id
                          ).length}
                      </Box>
                    </Flex>
                  </>
                )}
              </Flex>
            );
          })}
        </Box>
      ) : (
        <Flex justify="center" mt="4rem">
          <Text color="gray.600">
            You don't have any chats yet{" "}
            <span style={{ marginLeft: "3px" }}>😔</span>
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default ChatList;
