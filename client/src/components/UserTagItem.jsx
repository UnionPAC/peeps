import { Flex, Text, Icon } from "@chakra-ui/react";
import { HiOutlineX } from "react-icons/hi";

const UserTagItem = ({ user, handleFunction }) => {
  const { username } = user;
  return (
    <Flex
      border="1px solid black"
      paddingX=".4em"
      paddingY=".2em"
      margin=".2em"
      borderRadius="4px"
      align="center"
      gap="5px"
    >
      <Text>{username}</Text>
      <Icon
        as={HiOutlineX}
        fontSize="1.1rem"
        cursor="pointer"
        onClick={handleFunction}
      />
    </Flex>
  );
};

export default UserTagItem;
