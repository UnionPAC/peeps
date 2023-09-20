import {
  Flex,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { HiUserGroup, HiDotsVertical, HiBell } from "react-icons/hi";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCredentials,
  clearSelectedChat,
  setSelectedChat,
} from "../../slices/authSlice";
import { useLogoutMutation } from "../../slices/userApiSlice";
import {
  useFetchNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "../../slices/notificationApiSlice";
import { useFetchChatsQuery } from "../../slices/chatApiSlice";
import { useFetchMessagesQuery } from "../../slices/messageApiSlice";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";
import CreateGroup from "./CreateGroup";
import CreateChat from "./CreateChat";
import { useEffect } from "react";
import { css } from "@emotion/react";

const ChatListHeader = () => {
  const dispatch = useDispatch();
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const [logout] = useLogoutMutation();

  const [markAsRead] = useMarkNotificationAsReadMutation();

  const { data: notifications, refetch: refetchNotifications } =
    useFetchNotificationsQuery();

  const { refetch: refetchChats } = useFetchChatsQuery();
  const { refetch: refetchMessages } = useFetchMessagesQuery(selectedChat?._id);

  const handleSeenNotification = async (clickedNotification) => {
    // mark notification as read
    try {
      // mark all notifications with the same notification.chatId as read
      const notificationsToMark = notifications
        ?.filter(
          (notification) =>
            notification.chat._id === clickedNotification.chat._id
        )
        .forEach(async (notif) => {
          await markAsRead(notif._id).unwrap();
        });
      refetchNotifications();

      // redirect to the chat (the chat that the notification came from)
      dispatch(setSelectedChat(clickedNotification.chat));
      refetchChats();
    } catch (error) {
      console.log(error);
    }
  };

  {
    /* Profile Drawer */
  }
  const {
    onOpen: openProfileDrawer,
    isOpen: isProfileDrawerOpen,
    onClose: closeProfileDrawer,
  } = useDisclosure();

  {
    /* Create Group */
  }
  const {
    onOpen: openGroupModal,
    isOpen: isGroupModalOpen,
    onClose: closeGroupModal,
  } = useDisclosure();

  {
    /* Create Chat */
  }
  const {
    onOpen: openChatModal,
    isOpen: isChatModalOpen,
    onClose: closeChatModal,
  } = useDisclosure();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      dispatch(clearSelectedChat());
      navigate("/");
    } catch (error) {
      toast({
        title: error.data.message,
        status: "error",
      });
    }
  };

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        padding="1rem"
        bg="gray.100"
      >
        <Avatar
          name={userInfo.username}
          src={userInfo.profilePic}
          cursor="pointer"
          size="md"
          onClick={openProfileDrawer}
        />
        <Flex gap="5px">
          <Tooltip label="group chat" fontSize="small">
            <IconButton
              icon={<HiUserGroup />}
              bg="transparent"
              fontSize="1.4rem"
              onClick={openGroupModal}
            />
          </Tooltip>

          <Tooltip label="single chat" fontSize="small">
            <IconButton
              icon={<HiChatBubbleLeftEllipsis />}
              bg="transparent"
              fontSize="1.4rem"
              onClick={openChatModal}
            />
          </Tooltip>

          <Menu>
            <Tooltip label="notifications" fontSize="small">
              <MenuButton
                as={IconButton}
                css={css`
                  position: relative !important;
                `}
                aria-label="Notifications"
                icon={
                  notifications?.filter(
                    (notification) => notification.read !== true
                  ).length ? (
                    <>
                      <HiBell />
                      <Box
                        as="span"
                        color="white"
                        position="absolute"
                        top="-2px"
                        right="-3px"
                        fontSize={"0.75rem"}
                        bgColor="red.400"
                        borderRadius={10000}
                        zIndex={9999}
                        px="7px"
                        py="3px"
                      >
                        {
                          notifications.filter(
                            (notification) => notification.read !== true
                          ).length
                        }
                      </Box>
                    </>
                  ) : (
                    <HiBell />
                  )
                }
                bg="transparent"
                fontSize="1.4rem"
              ></MenuButton>
            </Tooltip>

            <MenuList padding=".5em">
              {notifications?.filter((notification) => notification.read === false).length >= 1 ? (
                notifications
                  .filter((notification) => notification.read === false)
                  .map((notification) => {
                    return (
                      <MenuItem
                        key={notification._id}
                        onClick={() => handleSeenNotification(notification)}
                      >
                        <Flex>
                          <Avatar
                            src={notification.sender.profilePic}
                            name={notification.sender.username}
                            mr={4}
                          />
                          <Box>
                            <Text fontWeight="semibold">{`@${notification.sender.username}`}</Text>
                            <Text>{notification.message}</Text>
                          </Box>
                        </Flex>
                      </MenuItem>
                    );
                  })
              ) : (
                <Box fontSize="small" fontStyle="italic">
                  No new notifications
                </Box>
              )}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={IconButton}
              icon={<HiDotsVertical />}
              bg="transparent"
              fontSize="1.4rem"
            />
            <MenuList>
              <MenuItem onClick={openProfileDrawer}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={closeProfileDrawer}
      />
      <CreateGroup onClose={closeGroupModal} isOpen={isGroupModalOpen} />
      <CreateChat onClose={closeChatModal} isOpen={isChatModalOpen} />
    </>
  );
};

export default ChatListHeader;
