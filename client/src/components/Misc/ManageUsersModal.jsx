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
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import UserTagItem from "../Misc/UserTagItem";
import { useState, useEffect } from "react";
import { useSearchUsersQuery } from "../../slices/userApiSlice";
import { useRemoveFromGroupMutation } from "../../slices/chatApiSlice";
import UserListItem from "./UserListItem";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../slices/authSlice";

const ManageUsersModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const dispatch = useDispatch();

  const { selectedChat } = useSelector((state) => state.auth);

  const [removeUser] = useRemoveFromGroupMutation();

  const { data } = useSearchUsersQuery(search);

  useEffect(() => {
    if (search === "") {
      setSearchResults([]);
    } else {
      setSearchResults(data);
    }
  }, [search]);

  const removeUserFromGroup = async (userId) => {
    try {
      const res = await removeUser({
        chatId: selectedChat._id,
        userId: userId,
      });
      dispatch(setSelectedChat(res));
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

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
              {searchResults?.map((user) => {
                return (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={null}
                    setSearch={setSearch}
                  />
                );
              })}
            </Box>
            <Flex marginY="1rem">
              {selectedChat?.users
                .filter((user) => user._id !== selectedChat?.groupAdmin?._id)
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

export default ManageUsersModal;
