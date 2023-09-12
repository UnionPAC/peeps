import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  ModalFooter,
  Text,
  Image,
} from "@chakra-ui/react";
import { getFullSender } from "../utils/ChatLogicHelpers";
import { useSelector } from "react-redux";

const ContactInfo = ({ isOpen, onClose }) => {
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Image
              src={
                getFullSender(userInfo, selectedChat.users).profilePic || null
              }
              padding="1em"
            />
            <Text my=".8em">
              Username: {getFullSender(userInfo, selectedChat.users).username}
            </Text>
            <Text my=".8em">
              Name: {getFullSender(userInfo, selectedChat.users).name}
            </Text>
            <Text my=".8em">
              Email: {getFullSender(userInfo, selectedChat.users).email}
            </Text>
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

export default ContactInfo;
