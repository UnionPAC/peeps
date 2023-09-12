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
import { useSearchUsersQuery } from "../slices/userApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../slices/authSlice";
import UserListItem from "./UserListItem";
import UserTagItem from "./UserTagItem";
import {
  useRemoveFromGroupMutation,
  useAddToGroupMutation,
} from "../slices/chatApiSlice";

const ManageGroupUsers = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const dispatch = useDispatch();
  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const { selectedChat } = useSelector((state) => state.auth);

  const { data } = useSearchUsersQuery(search);

  const [addUser] = useAddToGroupMutation();
  const [removeUser] = useRemoveFromGroupMutation();

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
      dispatch(setSelectedChat(res));
    } catch (error) {}
  };

  const removeUserFromGroup = async (userId) => {
    try {
      const res = await removeUser({
        chatId: selectedChat._id,
        userId: userId,
      }).unwrap();
      dispatch(setSelectedChat(res));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (search === "") {
      setSearchResults([]);
    } else {
      setSearchResults(data);
    }
  }, [search]);

  return (
    <>
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
    </>
  );
};

export default ManageGroupUsers;
