import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  ModalFooter,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useSearchUsersQuery } from "../../slices/userApiSlice";
import UserListItem from "../User/UserListItem";
import { setSelectedChat } from "../../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  useAccessChatMutation,
  useFetchChatsQuery,
} from "../../slices/chatApiSlice";
import socket from "../../socket";

const CreateChat = ({ isOpen, onClose }) => {
  /* STATE */
  const [searchUser, setSearchUser] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  /* REDUX STUFF */
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /* QUERIES */
  const { data } = useSearchUsersQuery(searchUser);
  const { refetch: refetchChats } = useFetchChatsQuery();

  /* MUTATIONS */
  const [accessChat] = useAccessChatMutation();

  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const handleAccessChat = async (_id) => {
    try {
      const res = await accessChat(_id).unwrap();
      socket.emit("new chat", { chat: res, chatCreatorId: userInfo._id });
      dispatch(setSelectedChat(res));
      onClose();
      setSearchUser("");
      refetchChats();
    } catch (error) {
      toast({
        title: error.data.message,
        status: "error",
      });
    }
  };

  useEffect(() => {
    if (searchUser === "") {
      setSearchResults([]);
    } else {
      setSearchResults(data);
    }
  }, [searchUser]);

  useEffect(() => {
    socket.on("chat created", () => {
      refetchChats();
    });
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSearchUser("");
      }}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Search users by name, username or email"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          {/* Show Users (based on input) */}
          <Box marginY="1rem">
            {searchResults?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAccessChat(user._id)}
                setSearch={setSearchUser}
              />
            ))}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateChat;
