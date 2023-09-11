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
import { useState } from "react";
import { useRenameGroupChatMutation } from "../slices/chatApiSlice";
import { setSelectedChat } from "../slices/authSlice";
import { useDispatch } from "react-redux";

const RenameGroup = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");

  const dispatch = useDispatch();
  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const { selectedChat } = useSelector((state) => state.auth);

  const [renameGroupChat] = useRenameGroupChatMutation();

  const handleClick = async () => {
    if (groupName === selectedChat.name) {
      return;
    }

    try {
      const res = await renameGroupChat({
        chatId: selectedChat._id,
        chatName: groupName,
      }).unwrap();
      dispatch(setSelectedChat(res));
      onClose();
    } catch (error) {
      toast({
        title: error.data.message,
        status: "error",
      });
    }
  };

  return (
    <>
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
    </>
  );
};

export default RenameGroup;
