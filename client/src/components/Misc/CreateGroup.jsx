import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSearchUsersQuery } from "../../slices/userApiSlice";
import { useCreateGroupChatMutation } from "../../slices/chatApiSlice";
import UserListItem from "./UserListItem";
import UserTagItem from "./UserTagItem";

const CreateGroup = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { data } = useSearchUsersQuery(search);
  const [createGroup] = useCreateGroupChatMutation();

  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  useEffect(() => {
    if (search === "") {
      setSearchResults([]);
    } else {
      setSearchResults(data);
    }
  }, [search]);

  const handleGroup = (user) => {
    // add user to selected user's
    if (selectedUsers.includes(user)) {
      toast({ title: "User already added to group", status: "error" });
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleSubmit = async () => {
    if (!groupName) {
      toast({
        title: "Please enter a group name",
        status: "error",
      });
      return;
    }

    if (selectedUsers.length < 2) {
      toast({
        title: "Group must have at least 3 members",
        status: "error",
      });
      return;
    }

    // create group
    console.log(`Creating group with these users: ${selectedUsers}`);

    // start here ...
    try {
      const res = await createGroup({
        name: groupName,
        users: JSON.stringify(selectedUsers),
      }).unwrap();
      console.log(res);
    } catch (error) {
      console.error(error);
    }

    setSearch("");
    setGroupName("");
    setSelectedUsers([]);
    onClose();
  };

  const handleDeleteUser = async (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSearch("");
        }}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group Name"
              mb="1em"
              fontSize="sm"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Add Users: John, Sara, Ben"
              mb="1em"
              fontSize="sm"
            />
            <Flex margin=".5em" mb="1em" flexWrap="wrap">
              {selectedUsers?.map((user) => {
                return (
                  <UserTagItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDeleteUser(user)}
                  />
                );
              })}
            </Flex>
            <Box>
              {searchResults?.map((user) => {
                return (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleFunction={() => handleGroup(user)}
                    setSearch={setSearch}
                  />
                );
              })}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit}>Create Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroup;
