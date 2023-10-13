import {
  Flex,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Tooltip,
  Box,
  Text,
  useMediaQuery,
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
import { useFetchChatsQuery } from "../../slices/chatApiSlice";
import { useFetchMessagesQuery } from "../../slices/messageApiSlice";
import { useDeleteNotificationMutation } from "../../slices/notificationApiSlice";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";
import CreateGroup from "./CreateGroup";
import CreateChat from "./CreateChat";
import { useFetchNotificationsQuery } from "../../slices/notificationApiSlice";
import { getFullSender } from "../../utils/ChatLogicHelpers";

const ChatListHeader = () => {
  const [isLargerThan450] = useMediaQuery("(min-width: 450px)");

  /* REDUX STUFF */
  const dispatch = useDispatch();
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  /* MUTATIONS */
  const [logout] = useLogoutMutation();

  /* QUERIES */
  const { refetch: refetchChats } = useFetchChatsQuery();
  const { refetch: refetchMessages } = useFetchMessagesQuery(selectedChat?._id);
  const { data: notifications, refetch: refetchNotifications } =
    useFetchNotificationsQuery();

  /* MUTATIONS */
  const [deleteNotification] = useDeleteNotificationMutation();

  /* DISCLOSURE TOGGLES */
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

  const handleClickNotification = async (notification) => {
    const chat = notification.chat;
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
      await refetchMessages();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        padding="1rem"
        bg="#eeeeee"
        borderBottom="1px"
        borderColor="lightgrey"
      >
        <Avatar
          name={userInfo.username}
          src={userInfo.profilePic || `chick.svg`}
          cursor="pointer"
          size="md"
          onClick={openProfileDrawer}
        />
        <Flex>
          {isLargerThan450 ? (
            <>
              <Tooltip label="group chat" fontSize="small">
                <IconButton
                  icon={<HiUserGroup />}
                  bg="transparent"
                  fontSize="1.4rem"
                  ml="1em"
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
                    icon={
                      notifications?.length > 0 ? (
                        <>
                          <HiBell />
                          <Box
                            as="span"
                            color="white"
                            position="absolute"
                            top="-2px"
                            right={notifications?.length > 9 ? "-3px" : "0px"}
                            fontSize="0.8rem"
                            fontWeight="normal"
                            bgColor="red.500"
                            borderRadius="100px"
                            px="6px"
                            py="2px"
                          >
                            {notifications?.length}
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
                <MenuList padding=".4em">
                  {notifications?.length > 0
                    ? notifications.map((notif) => {
                        return (
                          <MenuItem
                            onClick={() => handleClickNotification(notif)}
                            key={notif._id}
                            paddingY=".7em"
                            gap=".6em"
                          >
                            <Avatar
                              name={
                                getFullSender(userInfo, notif.chat.users)
                                  .username
                              }
                              src={
                                getFullSender(userInfo, notif.chat.users)
                                  .profilePic
                              }
                            />
                            <Box>
                              <Text fontWeight="medium">{`@${
                                getFullSender(userInfo, notif.chat.users)
                                  .username
                              }`}</Text>
                              <Text fontSize="sm">{notif.message}</Text>
                            </Box>
                          </MenuItem>
                        );
                      })
                    : "no new messages"}
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
            </>
          ) : (
            // start here
            <>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<HiDotsVertical />}
                  bg="transparent"
                  fontSize="1.4rem"
                />
                <MenuList>
                  <MenuItem onClick={openProfileDrawer}>Profile</MenuItem>
                  <MenuItem onClick={openChatModal}>
                    Single chat
                  </MenuItem>
                  <MenuItem onClick={openGroupModal}>
                    Group chat
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
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
