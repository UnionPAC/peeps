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
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { clearSelectedChat } from "../slices/authSlice";
import ManageGroupUsers from "./ManageGroupUsers";
import RenameGroup from "./RenameGroup";
import GroupInfo from "./GroupInfo";
import DeleteChat from "./DeleteChat";
import LeaveChat from "./LeaveChat";
import ContactInfoModal from "./ContactInfoModal";
import { getFullSender } from "../utils/ChatLogicHelpers";

const ChatInfoAndSettings = () => {
  const dispatch = useDispatch();
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const closeChat = async () => {
    try {
      dispatch(clearSelectedChat());
    } catch (error) {
      console.error(error);
    }
  };

  {
    /* Manage Users Modal */
  }
  const {
    onOpen: openManageUsersModal,
    isOpen: isManageUsersModalOpen,
    onClose: closeManageUsersModal,
  } = useDisclosure();

  {
    /* Rename Group Modal */
  }
  const {
    onOpen: openRenameGroupModal,
    isOpen: isRenameGroupModalOpen,
    onClose: closeRenameGroupModal,
  } = useDisclosure();

  {
    /* Group Info Modal */
  }
  const {
    onOpen: openGroupInfoModal,
    isOpen: isGroupInfoModalOpen,
    onClose: closeGroupInfoModal,
  } = useDisclosure();

  {
    /* Contact Info Modal */
  }
  const {
    onOpen: openContactInfoModal,
    isOpen: isContactInfoModalOpen,
    onClose: closeContactInfoModal,
  } = useDisclosure();

  {
    /* Delete Single Chat Dialog */
  }
  const {
    onOpen: openDeleteSingleChatDialog,
    isOpen: isDeleteSingleChatDialogOpen,
    onClose: closeDeleteSingleChatDialog,
  } = useDisclosure();

  {
    /* Delete Group Dialog */
  }
  const {
    onOpen: openDeleteGroupDialog,
    isOpen: isDeleteGroupDialogOpen,
    onClose: closeDeleteGroupDialog,
  } = useDisclosure();

  {
    /* Leave Group Dialog */
  }
  const {
    onOpen: openLeaveGroupDialog,
    isOpen: isLeaveGroupDialogOpen,
    onClose: closeLeaveGroupDialog,
  } = useDisclosure();

  return (
    <>
      {selectedChat ? (
        // GROUP CHAT
        selectedChat.isGroupChat ? (
          <>
            <Flex
              padding="1rem"
              justify="space-between"
              align="center"
              bg="gray.100"
            >
              <Flex align="center">
                <Avatar
                  name={selectedChat.name}
                  cursor="pointer"
                  size="md"
                  onClick={openGroupInfoModal}
                />
                <Text marginLeft="10px">{selectedChat.name}</Text>
              </Flex>

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<HiDotsVertical />}
                  bg="transparent"
                  fontSize="1.4rem"
                />
                <MenuList>
                  <MenuItem onClick={openGroupInfoModal}>Group info</MenuItem>
                  <MenuItem onClick={openRenameGroupModal}>
                    Rename group
                  </MenuItem>
                  {userInfo._id === selectedChat.groupAdmin._id && (
                    <MenuItem onClick={openManageUsersModal}>
                      Manage users
                    </MenuItem>
                  )}
                  <MenuItem onClick={closeChat}>Close chat</MenuItem>
                  {userInfo._id === selectedChat.groupAdmin._id ? (
                    <MenuItem onClick={openDeleteGroupDialog}>
                      Delete group
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={openLeaveGroupDialog}>
                      Leave group
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Flex>
            <GroupInfo
              onClose={closeGroupInfoModal}
              isOpen={isGroupInfoModalOpen}
            />
            <RenameGroup
              onClose={closeRenameGroupModal}
              isOpen={isRenameGroupModalOpen}
            />
            <ManageGroupUsers
              onClose={closeManageUsersModal}
              isOpen={isManageUsersModalOpen}
            />
            <LeaveChat
              onClose={closeLeaveGroupDialog}
              isOpen={isLeaveGroupDialogOpen}
            />
            <DeleteChat
              onClose={closeDeleteGroupDialog}
              isOpen={isDeleteGroupDialogOpen}
            />
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
                  name={getFullSender(userInfo, selectedChat.users).name}
                  cursor="pointer"
                  size="md"
                  onClick={openContactInfoModal}
                />
                <Text marginLeft="10px">
                  {getFullSender(userInfo, selectedChat.users).username}
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
                  <MenuItem onClick={openContactInfoModal}>
                    Contact info
                  </MenuItem>
                  <MenuItem onClick={closeChat}>Close chat</MenuItem>
                  <MenuItem onClick={openDeleteSingleChatDialog}>
                    Delete chat
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <ContactInfoModal
              onClose={closeContactInfoModal}
              isOpen={isContactInfoModalOpen}
            />
          </>
        )
      ) : (
        ""
      )}
    </>
  );
};

export default ChatInfoAndSettings;
