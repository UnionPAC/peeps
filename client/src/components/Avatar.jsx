import { Avatar as ChakraAvatar } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const Avatar = () => {
  const {
    userInfo: { profilePic, username },
  } = useSelector((state) => state.auth);

  return (
    <ChakraAvatar
      name={username}
      src={
        profilePic
          ? profilePic
          : "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80"
      }
    />
  );
};

export default Avatar;
