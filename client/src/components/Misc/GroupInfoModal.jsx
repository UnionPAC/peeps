import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  ModalFooter,
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import UserListItem from "./UserListItem";

const GroupInfoModal = ({ isOpen, onClose }) => {
  const { selectedChat } = useSelector((state) => state.auth);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Heading my=".8em">{selectedChat.name}</Heading>
            <Text mb="1em">Admin: {selectedChat?.groupAdmin?.username}</Text>
            {selectedChat?.users?.map((user, index) => {
              return (
                <Box mb="10px" key={user._id}>
                  <UserListItem
                    user={user}
                    handleFunction={null}
                    setSearch={null}
                  />
                </Box>
              );
            })}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupInfoModal;
