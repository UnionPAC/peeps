import { forwardRef, useRef } from "react";
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
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { HiPencil, HiCheck } from "react-icons/hi";

const ProfileDrawer = forwardRef(({ isOpen, onClose }, ref) => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <Drawer
        placement="left"
        size="md"
        openProfileRef={ref}
        isOpen={isOpen}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text fontSize="1.4rem" fontWeight="semibold">
              Profile
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <Flex justifyContent="center">
              <Avatar
                name={null}
                src={userInfo.profilePic}
                size="2xl"
                margin="2em"
                width="40%"
                height="40%"
              />
            </Flex>

            <Box width="90%" mx="auto">
              <Heading size="sm" fontWeight="semibold" mb=".5em">
                Name
              </Heading>
              <Flex mb="2em">
                {userInfo.name ? (
                  <Flex>
                    <Text>{userInfo.name}</Text>
                    <IconButton icon={<HiPencil />} />
                  </Flex>
                ) : (
                  <Flex width="100%">
                    <Input
                      width="90%"
                      padding="0"
                      border="none"
                      _focusVisible={false}
                      placeholder="Please add your name"
                    />
                    <IconButton icon={<HiCheck />} />
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
                <IconButton icon={<HiPencil />} />
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
                <Text>{userInfo.email}</Text>
                <IconButton icon={<HiPencil />} />
              </Flex>
              <DrawerFooter
                display="flex"
                justifyContent="flex-start"
                padding="0"
              >
                <Button>Delete Account</Button>
              </DrawerFooter>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
});

export default ProfileDrawer;
