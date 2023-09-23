import {
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Text,
  AvatarGroup,
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { clearSelectedChat } from "../../slices/authSlice";
import ManageGroupUsers from "./ChatSettings/ManageGroupUsers";
import RenameGroup from "./ChatSettings/RenameGroup";
import GroupInfo from "./ChatSettings/GroupInfo";
import LeaveChat from "./ChatSettings/LeaveGroup";
import ContactInfo from "./ChatSettings/ContactInfo";
import DeleteGroup from "./ChatSettings/DeleteGroup";
import { getFullSender } from "../../utils/ChatLogicHelpers";

const ChatViewHeader = () => {
  /* REDUX STUFF */
  const dispatch = useDispatch();
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const closeChat = async () => {
    try {
      dispatch(clearSelectedChat());
    } catch (error) {
      console.error(error);
    }
  };

  /* DISCLOSURE TOGGLES */

  {
    /* Manage Users  */
  }
  const {
    onOpen: openManageUsers,
    isOpen: isManageUsersOpen,
    onClose: closeManageUsers,
  } = useDisclosure();

  {
    /* Rename Group  */
  }
  const {
    onOpen: openRenameGroup,
    isOpen: isRenameGroupOpen,
    onClose: closeRenameGroup,
  } = useDisclosure();

  {
    /* Group Info */
  }
  const {
    onOpen: openGroupInfo,
    isOpen: isGroupInfoOpen,
    onClose: closeGroupInfo,
  } = useDisclosure();

  {
    /* Contact Info  */
  }
  const {
    onOpen: openContactInfo,
    isOpen: isContactInfoOpen,
    onClose: closeContactInfo,
  } = useDisclosure();

  {
    /* Leave Chat  */
  }
  const {
    onOpen: openLeaveChat,
    isOpen: isLeaveChatOpen,
    onClose: closeLeaveChat,
  } = useDisclosure();

  {
    /* Delete Group  */
  }
  const {
    onOpen: openDeleteGroup,
    isOpen: isDeleteGroupOpen,
    onClose: closeDeleteGroup,
  } = useDisclosure();

  return (
    <>
      {selectedChat &&
        // GROUP CHAT
        (selectedChat?.isGroupChat ? (
          <>
            <Flex
              padding="1rem"
              justify="space-between"
              align="center"
              bg="gray.100"
              height="auto"
            >
              <Flex align="center">
                <AvatarGroup
                  size="md"
                  max={2}
                  cursor="pointer"
                  onClick={openGroupInfo}
                >
                  {selectedChat.users.map((user) => {
                    return (
                      <Avatar
                        key={user._id}
                        name={user.username}
                        src={user.profilePic}
                      />
                    );
                  })}
                </AvatarGroup>
                <Text marginLeft="10px">
                  {selectedChat.name}
                </Text>
                {/*
                <AvatarGroup size='md' max={2}>
                  <Avatar name='Ryan Florence' src='https://bit.ly/ryan-florence' />
                  <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
                  <Avatar name='Kent Dodds' src='https://bit.ly/kent-c-dodds' />
                  <Avatar name='Prosper Otemuyiwa' src='https://bit.ly/prosper-baba' />
                  <Avatar name='Christian Nwamba' src='https://bit.ly/code-beast' />
                </AvatarGroup>
                 */}
              </Flex>

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<HiDotsVertical />}
                  bg="transparent"
                  fontSize="1.4rem"
                />
                <MenuList>
                  <MenuItem onClick={openGroupInfo}>Group info</MenuItem>
                  <MenuItem onClick={openRenameGroup}>Rename group</MenuItem>
                  {userInfo._id === selectedChat.groupAdmin._id && (
                    <MenuItem onClick={openManageUsers}>Manage users</MenuItem>
                  )}
                  <MenuItem onClick={closeChat}>Close chat</MenuItem>
                  {userInfo._id === selectedChat.groupAdmin._id ? (
                    <MenuItem onClick={openDeleteGroup}>Delete group</MenuItem>
                  ) : (
                    <MenuItem onClick={openLeaveChat}>Leave group</MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Flex>
          </>
        ) : (
          // SINGLE CHAT
          <>
            <Flex
              padding="1rem"
              justify="space-between"
              align="center"
              bg="gray.100"
            >
              <Flex align="center">
                <Avatar
                  name={getFullSender(userInfo, selectedChat?.users).username}
                  cursor="pointer"
                  size="md"
                  onClick={openContactInfo}
                />
                <Text marginLeft="10px">
                  {getFullSender(userInfo, selectedChat?.users).username}
                </Text>
              </Flex>

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<HiDotsVertical />}
                  bg="transparent"
                  fontSize="1.4rem"
                />
                <MenuList>
                  <MenuItem onClick={openContactInfo}>Contact info</MenuItem>
                  <MenuItem onClick={closeChat}>Close chat</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </>
        ))}
      <ContactInfo onClose={closeContactInfo} isOpen={isContactInfoOpen} />
      <GroupInfo onClose={closeGroupInfo} isOpen={isGroupInfoOpen} />
      <RenameGroup onClose={closeRenameGroup} isOpen={isRenameGroupOpen} />
      <ManageGroupUsers onClose={closeManageUsers} isOpen={isManageUsersOpen} />
      <LeaveChat onClose={closeLeaveChat} isOpen={isLeaveChatOpen} />
      <DeleteGroup onClose={closeDeleteGroup} isOpen={isDeleteGroupOpen} />
    </>
  );
};

export default ChatViewHeader;
