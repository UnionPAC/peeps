import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  ModalFooter,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  useRenameGroupChatMutation,
  useFetchChatsQuery,
} from "../../../slices/chatApiSlice";
import { setSelectedChat } from "../../../slices/authSlice";
import { useDispatch } from "react-redux";
import socket from "../../../socket";

const RenameGroup = ({ isOpen, onClose }) => {
  /* STATE */
  const [groupName, setGroupName] = useState("");

  /* REDUX STUFF */
  const dispatch = useDispatch();
  const { selectedChat, userInfo } = useSelector((state) => state.auth);

  /* QUERIES */
  const { refetch: refetchChats } = useFetchChatsQuery();

  /* MUTATIONS */
  const [renameGroupChat] = useRenameGroupChatMutation();

  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const handleClick = async () => {
    if (groupName === selectedChat.name) {
      return;
    }

    try {
      const res = await renameGroupChat({
        chatId: selectedChat._id,
        chatName: groupName,
      }).unwrap();
      socket.emit("rename group", { chat: res, renamerId: userInfo._id });
      dispatch(setSelectedChat(res));
      onClose();
      refetchChats();
    } catch (error) {
      toast({
        title: error.data.message,
        status: "error",
      });
    }
  };

  useEffect(() => {
    socket.on("group renamed", (chat) => {
      refetchChats();
      if (selectedChat?._id == chat._id) {
        dispatch(setSelectedChat(chat));
      }
    });
  }, []);

  return (
    <>
      {selectedChat && selectedChat.isGroupChat && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Rename Group</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                type="text"
                name="groupName"
                defaultValue={selectedChat?.name}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={handleClick}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default RenameGroup;
