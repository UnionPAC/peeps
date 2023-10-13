import {
  Button,
  Flex,
  Heading,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

const NotFound = () => {
  return (
    <Flex height="100%" direction="column" justify="center" align="center">
      <Heading mb={5}>404 - Page Not Found</Heading>
      <Text mb={10}>Oops! The page you're looking for does not exist.</Text>
      <ChakraLink as={ReactRouterLink} to="/">
        <Button
          bg="#ffde5c"
          color="black"
          border="4px"
          borderColor="blackAlpha.100"
          mb={8}
          size="lg"
          fontFamily="heading"
          fontWeight="500"
          _hover={{ shadow: "lg" }}
        >
          Back Home
        </Button>
      </ChakraLink>
    </Flex>
  );
};

export default NotFound;
