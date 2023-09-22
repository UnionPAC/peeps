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
  Text,
} from "@chakra-ui/react";
import { HiUserGroup, HiDotsVertical, HiBell } from "react-icons/hi";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials, clearSelectedChat } from "../../slices/authSlice";
import { useLogoutMutation } from "../../slices/userApiSlice";
import { useFetchChatsQuery } from "../../slices/chatApiSlice";
import { useFetchMessagesQuery } from "../../slices/messageApiSlice";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";
import CreateGroup from "./CreateGroup";
import CreateChat from "./CreateChat";


const ChatListHeader = () => {
  /* REDUX STUFF */
  const dispatch = useDispatch();
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  /* MUTATIONS */
  const [logout] = useLogoutMutation();

  /* QUERIES */
  const { refetch: refetchChats } = useFetchChatsQuery();
  const { refetch: refetchMessages } = useFetchMessagesQuery(selectedChat?._id);

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
                icon={<HiBell />}
                bg="transparent"
                fontSize="1.4rem"
              ></MenuButton>
            </Tooltip>

            <MenuList padding=".5em">{"no new notifications"}</MenuList>
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
