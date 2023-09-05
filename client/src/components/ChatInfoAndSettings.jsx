import {
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";

const ChatInfoAndSettings = () => {
  return (
    <Flex margin="1rem" justify="space-between">
      <Avatar
        name="John Doe"
        src={null}
        cursor="pointer"
        size="md"
        onClick={null}
      />
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<HiDotsVertical />}
          bg="transparent"
          fontSize="1.4rem"
        />
        <MenuList>
          <MenuItem>Contact info</MenuItem>
          <MenuItem>Close chat</MenuItem>
          <MenuItem>Delete chat</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default ChatInfoAndSettings;
