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
  Flex,
  Input,
  useToast,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { useSearchUsersQuery } from "../../../slices/userApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { clearSelectedChat, setSelectedChat } from "../../../slices/authSlice";
import UserListItem from "../../User/UserListItem";
import UserTagItem from "../../User/UserTagItem";
import {
  useRemoveFromGroupMutation,
  useAddToGroupMutation,
  useFetchChatsQuery,
} from "../../../slices/chatApiSlice";
import socket from "../../../socket";

const ManageGroupUsers = ({ isOpen, onClose }) => {
  /* STATE */
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  /* REDUX STUFF */
  const dispatch = useDispatch();
  const { selectedChat } = useSelector((state) => state.auth);

  /* QUERIES */
  const { data } = useSearchUsersQuery(search);
  const { refetch: refetchChats } = useFetchChatsQuery();

  /* MUTATIONS */
  const [addUser] = useAddToGroupMutation();
  const [removeUser] = useRemoveFromGroupMutation();

  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const addUserToGroup = async (userId) => {
    if (selectedChat.users.find((user) => user._id === userId)) {
      toast({
        title: "User already in group",
        status: "error",
      });
      return;
    }
    try {
      const res = await addUser({
        chatId: selectedChat._id,
        userId: userId,
      }).unwrap();
      socket.emit("add user", { chat: res, addedUserId: userId });
      dispatch(setSelectedChat(res));
      refetchChats();
    } catch (error) {
      toast({
        title: error.data.message,
        status: "error",
      });
    }
  };

  const removeUserFromGroup = async (userId) => {
    try {
      const res = await removeUser({
        chatId: selectedChat._id,
        userId: userId,
      }).unwrap();
      socket.emit("remove user", { chat: res, removedUserId: userId });
      dispatch(setSelectedChat(res));
      refetchChats();
    } catch (error) {
      toast({
        title: error.data.message,
        status: "error",
      });
    }
  };

  useEffect(() => {
    if (search === "") {
      setSearchResults([]);
    } else {
      setSearchResults(data);
    }
  }, [search]);

  useEffect(() => {
    socket.on("user added", (chat) => {
      refetchChats();
    });
    socket.on("user removed", (chat) => {
      refetchChats();
      if (selectedChat?._id == chat._id) {
        dispatch(clearSelectedChat());
      }
    });
    socket.on("left group", (chat) => {
      if (selectedChat?._id == chat._id) {
        dispatch(setSelectedChat(chat));
      }
    });
  }, []);

  return (
    <>
      {selectedChat && selectedChat.isGroupChat && (
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSearch("");
          }}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Manage Users</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Add Users: John, Sara, Ben"
                mb="1em"
                fontSize="sm"
              ></Input>
              <Box>
                {searchResults.map((user) => {
                  return (
                    <UserListItem
                      user={user}
                      key={user._id}
                      handleFunction={() => addUserToGroup(user._id)}
                      setSearch={setSearch}
                    />
                  );
                })}
              </Box>
              <Flex marginY="1rem">
                {selectedChat?.users
                  .filter((user) => user._id !== selectedChat.groupAdmin._id)
                  .map((user) => {
                    return (
                      <UserTagItem
                        key={user._id}
                        user={user}
                        handleFunction={() => removeUserFromGroup(user._id)}
                      />
                    );
                  })}
              </Flex>
              <Box></Box>
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

export default ManageGroupUsers;
