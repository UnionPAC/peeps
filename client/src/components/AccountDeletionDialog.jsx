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
import { useDeleteUserProfileMutation } from "../slices/userApiSlice";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const AccountDeletionDialog = ({ onDeleteDialogClose, isDeleteDialogOpen }) => {
  const [deleteUserProfile, { isLoading }] = useDeleteUserProfileMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleDeleteAccount = async () => {
    console.log("delete");

    try {
      // userApiSlice: deleteUserProfile
      await deleteUserProfile().unwrap();
      // clear credentials from local storage
      dispatch(clearCredentials());
      // navigate to login
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({ title: error.data.message, status: "error" });
    }

    onDeleteDialogClose();
  };

  return (
    <AlertDialog isOpen={isDeleteDialogOpen} onClose={onDeleteDialogClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Account
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onDeleteDialogClose}>Cancel</Button>
            <Button colorScheme="red" ml={3} onClick={handleDeleteAccount}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AccountDeletionDialog;
