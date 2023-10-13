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
  Flex,
  Box,
  Heading,
} from "@chakra-ui/react";
import { getFullSender } from "../../../utils/ChatLogicHelpers";
import { useSelector } from "react-redux";

const ContactInfo = ({ isOpen, onClose }) => {
  /* REDUX STUFF */
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  return (
    <>
      {selectedChat && !selectedChat.isGroupChat && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <Flex gap={10}>
                <Image
                  src={
                    getFullSender(userInfo, selectedChat.users).profilePic ||
                    `chick.svg`
                  }
                  paddingY="1em"
                  w={200}
                />
                <Box mt={8}>
                  <Heading my=".1em" fontSize="medium">
                    Username
                  </Heading>
                  <Text mb={4}>
                    {getFullSender(userInfo, selectedChat.users).username}
                  </Text>

                  <Heading my=".1em" fontSize="medium">
                    Name
                  </Heading>
                  <Text mb={4}>
                    {getFullSender(userInfo, selectedChat.users).name || "n/a"}
                  </Text>

                  <Heading my=".1em" fontSize="medium">
                    Email
                  </Heading>
                  <Text>
                    {getFullSender(userInfo, selectedChat.users).email}
                  </Text>
                </Box>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ContactInfo;
