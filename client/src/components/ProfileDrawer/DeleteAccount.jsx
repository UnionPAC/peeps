import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useDeleteUserProfileMutation } from "../../slices/userApiSlice";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";

const AccountDeletionDialog = ({ closeDeleteDialog, isDeleteDialogOpen }) => {
  const [deleteUserProfile] = useDeleteUserProfileMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleDeleteAccount = async () => {
    try {
      await deleteUserProfile().unwrap();
      dispatch(clearCredentials());
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({ title: error.data.message, status: "error" });
    }
  };

  return (
    <AlertDialog isOpen={isDeleteDialogOpen} onClose={closeDeleteDialog}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text fontSize="md" fontFamily="body" fontWeight="700">
              Delete Account
            </Text>
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text fontSize="md" fontFamily="body" fontWeight="400">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              onClick={closeDeleteDialog}
              fontSize="md"
              fontFamily="body"
              fontWeight="400"
            >
              Cancel
            </Button>
            <Button
              fontSize="md"
              fontFamily="body"
              fontWeight="400"
              ml={3}
              color="white"
              bg="red.400"
              onClick={handleDeleteAccount}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AccountDeletionDialog;
