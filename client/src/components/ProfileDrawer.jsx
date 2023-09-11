import { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Avatar,
  Heading,
  Flex,
  Box,
  Input,
  IconButton,
  DrawerFooter,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { HiPencil, HiCheck } from "react-icons/hi";
import AccountDeletionDialog from "./DeleteAccount";
import { useUpdateUserProfileMutation } from "../slices/userApiSlice";
import * as Yup from "yup";
import { setCredentials } from "../slices/authSlice";

const ProfileDrawer = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEdittingName, setIsEdittingName] = useState(false);
  const [isEdittingEmail, setIsEdittingEmail] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const toast = useToast();

  const [updateUser] = useUpdateUserProfileMutation();

  {
    /* Account Deletion Dialog */
  }
  const {
    isOpen: isDeleteDialogOpen,
    onClose: closeDeleteDialog,
    onOpen: openDeleteDialog,
  } = useDisclosure();

  const emailValidationSchema = Yup.string()
    .email("Invalid Email Address")
    .required("Email is required");

  const nameValidationSchema = Yup.string().max(
    24,
    "Please enter a shorter name"
  );

  const handleUpdateEmail = async () => {
    if (email === userInfo.email) return;

    try {
      await emailValidationSchema.validate(email);

      const res = await updateUser({
        email: email,
      }).unwrap();
      dispatch(setCredentials({ ...res, email: email }));
    } catch (error) {
      toast({ title: error.message, status: "error", position: "top-right" });
    }
  };

  const handleNameUpdate = async () => {
    if (name === "") {
      toast({
        title: "Please enter a valid name",
        status: "error",
        position: "top-right",
      });
    }

    if (name === userInfo.name) return;
    try {
      await nameValidationSchema.validate(name);
      const res = await updateUser({
        name: name,
      }).unwrap();
      dispatch(setCredentials({ ...res, name: name }));
    } catch (error) {
      toast({ title: error.message, status: "error", position: "top-right" });
    }
  };

  const handleProfilePicUpdate = async (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      // Create Profile Pic Preview
      const imageUrl = URL.createObjectURL(selectedImage);
      setImagePreview(imageUrl);

      try {
        // update user profilePic
        const res = await updateUser({
          profilePic: selectedImage,
        }).unwrap();
        // console.log(res);
        dispatch(setCredentials({ ...res, profilePic: res.profilePic }));
        //
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Drawer placement="left" size="md" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton _focusVisible={false} />
          <DrawerHeader>
            <Text fontSize="1.4rem" fontWeight="semibold">
              Profile
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <Flex justifyContent="center" alignItems="center">
              <Avatar
                name={null}
                src={userInfo.profilePic || imagePreview}
                size="2xl"
                margin="2em"
                width="180px"
                height="180px"
                loading=""
              />
              <Input
                type="file"
                id="avatar-input"
                position="absolute"
                width="180px"
                height="180px"
                borderRadius="100px"
                opacity="0"
                cursor="pointer"
                onChange={handleProfilePicUpdate}
              />
            </Flex>

            <Box width="90%" mx="auto">
              <Heading size="sm" fontWeight="semibold" mb=".5em">
                Name
              </Heading>
              <Flex
                mb="2em"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
              >
                {userInfo.name ? (
                  <Flex
                    alignItems="center"
                    width="100%"
                    justifyContent="space-between"
                  >
                    {isEdittingName ? (
                      <>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <IconButton
                          onClick={() => {
                            handleNameUpdate();
                            setTimeout(() => {
                              setIsEdittingName(false);
                            }, 200);
                          }}
                          icon={<HiCheck />}
                        />
                      </>
                    ) : (
                      <>
                        <Text>{userInfo.name}</Text>
                        <IconButton
                          onClick={() => {
                            setName(userInfo.name);
                            setIsEdittingName(true);
                          }}
                          icon={<HiPencil />}
                        />
                      </>
                    )}
                  </Flex>
                ) : (
                  <Flex
                    alignItems="center"
                    width="100%"
                    justifyContent="space-between"
                  >
                    <Input
                      _focusVisible={false}
                      placeholder="Please add your name"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                    <IconButton
                      onClick={() => {
                        handleNameUpdate();
                        setTimeout(() => {
                          setIsEdittingName(false);
                        }, 400);
                      }}
                      icon={<HiCheck />}
                    />
                  </Flex>
                )}
              </Flex>

              <Heading size="sm" fontWeight="semibold" mb=".5em">
                Username
              </Heading>
              <Flex
                mb="2em"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
              >
                <Text>{userInfo.username}</Text>
              </Flex>

              <Heading size="sm" fontWeight="semibold" mb=".5em">
                Email
              </Heading>
              <Flex
                mb="2em"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
              >
                {isEdittingEmail ? (
                  <>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <IconButton
                      onClick={() => {
                        handleUpdateEmail();
                        setTimeout(() => {
                          setIsEdittingEmail(false);
                        }, 200);
                      }}
                      icon={<HiCheck />}
                    />
                  </>
                ) : (
                  <>
                    <Text>{userInfo.email}</Text>
                    <IconButton
                      onClick={() => {
                        setEmail(userInfo.email);
                        setIsEdittingEmail(true);
                      }}
                      icon={<HiPencil />}
                    />
                  </>
                )}
              </Flex>
              <DrawerFooter
                display="flex"
                justifyContent="flex-start"
                padding="0"
              >
                <Button onClick={openDeleteDialog}>Delete Account</Button>
              </DrawerFooter>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <AccountDeletionDialog
        closeDeleteDialog={closeDeleteDialog}
        isDeleteDialogOpen={isDeleteDialogOpen}
      />
    </>
  );
};

export default ProfileDrawer;
