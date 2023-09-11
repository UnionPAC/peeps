import {
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { clearSelectedChat } from "../../slices/authSlice";
import { getSender } from "../../utils/ChatHelpers";
import ManageUsersModal from "../Misc/ManageUsersModal";
import RenameGroupModal from "../Misc/RenameGroupModal";
import GroupInfoModal from "../Misc/GroupInfoModal";
import DeleteGroupDialog from "../Misc/DeleteGroupDialog";
import LeaveGroupDialog from "../Misc/LeaveGroupDialog";

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
        <>
          <Flex
            padding="1rem"
            justify="space-between"
            align="center"
            bg="gray.100"
          >
            <Avatar
              name={
                selectedChat.isGroupChat
                  ? selectedChat.name
                  : getSender(userInfo, selectedChat.users).name
              }
              cursor="pointer"
              size="md"
              onClick={null}
            />
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<HiDotsVertical />}
                bg="transparent"
                fontSize="1.4rem"
              />
              <MenuList>
                {!selectedChat.isGroupChat && <MenuItem>Contact info</MenuItem>}
                {selectedChat.isGroupChat && (
                  <>
                    <MenuItem onClick={openGroupInfoModal}>Group info</MenuItem>
                    <MenuItem onClick={openRenameGroupModal}>
                      Rename group
                    </MenuItem>
                  </>
                )}
                {selectedChat.isGroupChat &&
                  userInfo._id === selectedChat.groupAdmin._id && (
                    <MenuItem onClick={openManageUsersModal}>
                      Manage users
                    </MenuItem>
                  )}

                <MenuItem onClick={closeChat}>Close chat</MenuItem>
                {selectedChat.isGroupChat ? (
                  userInfo._id === selectedChat.groupAdmin._id ? (
                    <MenuItem onClick={openDeleteGroupDialog}>
                      Delete group
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={openLeaveGroupDialog}>
                      Leave group
                    </MenuItem>
                  )
                ) : (
                  <MenuItem onClick={openDeleteGroupDialog}>
                    Delete chat
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Flex>
          <RenameGroupModal
            onClose={closeRenameGroupModal}
            isOpen={isRenameGroupModalOpen}
          />
          <ManageUsersModal
            onClose={closeManageUsersModal}
            isOpen={isManageUsersModalOpen}
          />
          <GroupInfoModal
            onClose={closeGroupInfoModal}
            isOpen={isGroupInfoModalOpen}
          />
          <DeleteGroupDialog
            onClose={closeDeleteGroupDialog}
            isOpen={isDeleteGroupDialogOpen}
          />
          <LeaveGroupDialog
            onClose={closeLeaveGroupDialog}
            isOpen={isLeaveGroupDialogOpen}
          />
        </>
      ) : null}
    </>
  );
};

export default ChatInfoAndSettings;
