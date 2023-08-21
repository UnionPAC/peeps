import {
  Flex,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HiUserGroup, HiDotsVertical } from "react-icons/hi";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { useLogoutMutation } from "../slices/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../slices/authSlice";

const ChatListHead = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth);

  console.log(userInfo);

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        title: error.data.message,
        status: "error",
      });
    }
  };

  return (
    <Flex alignItems="center" justifyContent="space-between" margin="1rem">
      {/* opens sidebar replacing ChatList with user profile */}
      <Avatar name={userInfo.username} cursor="pointer" size="md"  />
      <Flex gap='5px'>
        {/* opens sidebar replacing ChatList with create group chat */}
        <IconButton icon={<HiUserGroup />} bg="transparent" fontSize='1.4rem'/>
        {/* opens sidebar replacing ChatList with create / send message */}
        <IconButton icon={<HiChatBubbleLeftEllipsis />} bg="transparent" fontSize='1.4rem' />
        {/* opens dropdown menu with settings */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<HiDotsVertical />}
            bg="transparent"
            fontSize='1.4rem'
          />
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default ChatListHead;
