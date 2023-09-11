import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useDeleteChatMutation } from "../slices/chatApiSlice";
import { useSelector } from "react-redux";
import { clearSelectedChat } from "../slices/authSlice";
import { useDispatch } from "react-redux";

const DeleteChat = ({ isOpen, onClose }) => {
  const { selectedChat } = useSelector((state) => state.auth);

  const [deleteChat] = useDeleteChatMutation();

  const dispatch = useDispatch();
  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const handleDelete = async () => {
    try {
      const res = await deleteChat({ chatId: selectedChat._id });
      dispatch(clearSelectedChat());
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: error.data.message,
        status: "error",
      });
    }
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Group
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this chat? This action cannot be
            undone.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="red" ml={3} onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteChat;
