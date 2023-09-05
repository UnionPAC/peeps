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
} from "@chakra-ui/react";
import { useSearchUsersQuery } from "../slices/userApiSlice";
import UserListItem from "./UserListItem";

const CreateChat = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const { data, isFetching, isLoading } = useSearchUsersQuery(search);

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
          <ModalHeader>New Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Search users by name, username or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* Show Users (based on input) */}
            <Box marginY="1rem">
              {searchResults?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  onClose={onClose}
                  setSearch={setSearch}
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
    </>
  );
};

export default CreateChat;
