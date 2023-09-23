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
import { useSelector } from "react-redux";
import { clearSelectedChat, setSelectedChat } from "../../../slices/authSlice";
import { useDispatch } from "react-redux";
import {
  useRemoveFromGroupMutation,
  useFetchChatsQuery,
} from "../../../slices/chatApiSlice";
import socket from "../../../socket";
import { useEffect } from "react";

const LeaveGroup = ({ isOpen, onClose }) => {
  /* REDUX STUFF */
  const dispatch = useDispatch();
  const { userInfo, selectedChat } = useSelector((state) => state.auth);

  /* QUERIES */
  const { refetch: refetchChats } = useFetchChatsQuery();

  /* MUTATIONS */
  const [removeUser] = useRemoveFromGroupMutation();

  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const handleLeaveChat = async () => {
    try {
      const res = await removeUser({
        chatId: selectedChat._id,
        userId: userInfo._id,
      }).unwrap();
      socket.emit("leave group", { chat: res, leavingId: userInfo._id });
      dispatch(clearSelectedChat());
      onClose();
      refetchChats();
    } catch (error) {
      toast({
        title: error.data.message,
        status: "error",
      });
    }
  };

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
        <AlertDialog isOpen={isOpen} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Group
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to leave this group? This action cannot be
                undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button colorScheme="red" ml={3} onClick={handleLeaveChat}>
                  Leave
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
};

export default LeaveGroup;
