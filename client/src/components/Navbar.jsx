import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import {
  Flex,
  Heading,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Button,
  Text,
} from "@chakra-ui/react";
import Avatar from "./Avatar";
import { useSelector, useDispatch } from "react-redux";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useLogoutMutation } from "../slices/userApiSlice";
import { clearCredentials } from "../slices/authSlice";

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

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
    <header>
      <Flex
        width="85%"
        marginX="auto"
        paddingY="1.5rem"
        justifyContent="space-between"
        alignItems="center"
      >
        <ChakraLink
          style={{ textDecoration: "none" }}
          as={ReactRouterLink}
          to="/"
        >
          <Heading variant="h2">Peeps</Heading>
        </ChakraLink>
        <Menu>
          {userInfo ? (
            <>
              <MenuButton
                as={IconButton}
                icon={<Avatar />}
                bg="transparent"
                _hover={false}
                _active={false}
              />
              <MenuList>
                <MenuItem onClick={() => navigate("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </>
          ) : (
            <Flex gap="1rem">
              <ChakraLink as={ReactRouterLink} to="/login">
                <Button>
                  <IconButton icon={<FaSignInAlt />} />
                  <Text>Login</Text>
                </Button>
              </ChakraLink>
              <ChakraLink as={ReactRouterLink} to="signup">
                <Button>
                  <IconButton icon={<FaSignOutAlt />} />
                  <Text>Signup</Text>
                </Button>
              </ChakraLink>
            </Flex>
          )}
        </Menu>
      </Flex>
    </header>
  );
};

export default Navbar;
