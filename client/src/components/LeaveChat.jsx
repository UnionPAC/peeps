import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRemoveFromGroupMutation } from "../slices/chatApiSlice";
import { useSelector } from "react-redux";

const LeaveChat = ({ isOpen, onClose }) => {
  const [removeUser] = useRemoveFromGroupMutation();

  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  const removeUserFromGroup = async (userId) => {
    try {
      const res = await removeUser({
        chatId: selectedChat._id,
        userId: userId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Leave Group
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to leave this chat?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => removeUserFromGroup(userInfo._id)}
            >
              Leave Group
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default LeaveChat;
