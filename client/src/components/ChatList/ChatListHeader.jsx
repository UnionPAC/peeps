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
} from "@chakra-ui/react";
import { HiUserGroup, HiDotsVertical, HiBell } from "react-icons/hi";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { useLogoutMutation } from "../../slices/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials, clearSelectedChat } from "../../slices/authSlice";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";
import CreateGroup from "./CreateGroup";
import CreateChat from "./CreateChat";

const UserSettingsAndChat = () => {
  const dispatch = useDispatch();
  const { userInfo, notifications } = useSelector((state) => state.auth);

  const [logout] = useLogoutMutation();

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
                aria-label="Options"
                icon={<HiBell />}
                bg="transparent"
                fontSize="1.4rem"
              />
            </Tooltip>

            <MenuList>
              {notifications ? "Show new messages" : "No new messages"}
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

export default UserSettingsAndChat;
