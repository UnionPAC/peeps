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
import {
  useCreateGroupChatMutation,
  useFetchChatsQuery,
} from "../../slices/chatApiSlice";
import UserListItem from "../User/UserListItem";
import UserTagItem from "../User/UserTagItem";
import { useSelector } from "react-redux";

const CreateGroup = ({ isOpen, onClose }) => {
  /* STATE */
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  /* REDUX STUFF */
  const { userInfo } = useSelector((state) => state.auth);

  /* QUERIES */
  const { data } = useSearchUsersQuery(search);
  const { refetch: refetchChats } = useFetchChatsQuery();

  /* MUTATIONS */
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

  const handleCreateGroup = async () => {
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

    try {
      const res = await createGroup({
        name: groupName,
        users: JSON.stringify(selectedUsers),
      }).unwrap();
    } catch (error) {
      console.error(error);
    }

    setSearch("");
    setGroupName("");
    setSelectedUsers([]);
    onClose();
    refetchChats();
  };

  const addUserToSelectedUsers = (userToAdd) => {
    if (selectedUsers.some((user) => user._id == userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const removeSelectedUser = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };


  return (
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
            {selectedUsers?.map((user, index) => {
              return (
                <UserTagItem
                  key={`${user._id}-${index}`}
                  user={user}
                  handleFunction={() => removeSelectedUser(user)}
                />
              );
            })}
          </Flex>
          <Box>
            {searchResults
              ?.filter((user) => user._id !== userInfo._id)
              .map((user, index) => {
                return (
                  <UserListItem
                    key={`${user._id}-${index}`}
                    user={user}
                    handleFunction={() => addUserToSelectedUsers(user)}
                    setSearch={setSearch}
                  />
                );
              })}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateGroup;
