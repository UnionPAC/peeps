import {
  Flex,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import { HiUserGroup, HiDotsVertical } from "react-icons/hi";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { useLogoutMutation } from "../slices/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../slices/authSlice";
import ProfileDrawer from "./ProfileDrawer";
import CreateGroup from "./CreateGroup";
import CreateChat from "./CreateChat";

const UserSettingsAndChat = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [logout] = useLogoutMutation();

  {/* Profile Drawer */}
  const {
    onOpen: openProfileDrawer,
    isOpen: isProfileDrawerOpen,
    onClose: closeProfileDrawer,
  } = useDisclosure();

  {/* Create Group */}
  const {
    onOpen: openGroupModal,
    isOpen: isGroupModalOpen,
    onClose: closeGroupModal,
  } = useDisclosure();

  {/* Create Chat */}
  const {
    onOpen: openChatModal,
    isOpen: isChatModalOpen,
    onClose: closeChatModal,
  } = useDisclosure();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        title: error.data.message,
        status: "error",
      });
    }
  };

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" margin="1rem">
        {/* opens sidebar replacing ChatList with user profile */}
        <Avatar
          name={userInfo.username}
          src={userInfo.profilePic}
          cursor="pointer"
          size="md"
          onClick={openProfileDrawer}
        />
        <Flex gap="5px">
          {/* opens sidebar replacing ChatList with create group chat */}
          <IconButton
            icon={<HiUserGroup />}
            bg="transparent"
            fontSize="1.4rem"
            onClick={openGroupModal}
          />
          {/* opens sidebar replacing ChatList with create / send message */}
          <IconButton
            icon={<HiChatBubbleLeftEllipsis />}
            bg="transparent"
            fontSize="1.4rem"
            onClick={openChatModal}
          />
          {/* opens dropdown menu with settings */}
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
