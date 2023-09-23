import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  ModalFooter,
  Box,
  Heading,
  Text,
  Avatar,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import socket from "../../../socket";
import { useFetchChatsQuery } from "../../../slices/chatApiSlice";
import { setSelectedChat } from "../../../slices/authSlice";

const GroupInfo = ({ isOpen, onClose }) => {
  /* REDUX STUFF */
  const { selectedChat } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /* QUERIES */
  const { refetch: refetchChats } = useFetchChatsQuery();

  useEffect(() => {
    socket.on("left group", (chat) => {
      refetchChats();
      if (selectedChat?.id == chat._id) {
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
            <ModalCloseButton />
            <ModalBody>
              <Heading my=".8em" fontWeight="semibold">
                {selectedChat?.name}
              </Heading>
              {selectedChat?.users?.map((user, index) => {
                return (
                  <Box mb="20px" key={user._id}>
                    <Flex>
                      <Avatar
                        size="md"
                        name={user.username}
                        src={user.profilePic}
                      />
                      <Box ml={3}>
                        <Flex align="center">
                          <Text fontWeight="medium">{user.username}</Text>
                          {user._id == selectedChat.groupAdmin._id ? (
                            <Badge ml={2} colorScheme="green">
                              Admin
                            </Badge>
                          ) : (
                            ""
                          )}
                        </Flex>
                        <Text fontSize="sm">{user.email}</Text>
                      </Box>
                    </Flex>
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
      )}
    </>
  );
};

export default GroupInfo;
