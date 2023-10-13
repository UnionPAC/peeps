import { useEffect } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Link as ChakraLink,
  Heading,
  useToast,
  Image,
  Flex,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { setCredentials } from "../slices/authSlice";
import { useLoginMutation } from "../slices/userApiSlice";
import { useFetchChatsQuery } from "../slices/chatApiSlice";
import { useDispatch, useSelector } from "react-redux";

const initialValues = {
  username: "",
  password: "",
};

const loginValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(18, "Password cannot be greater than 18 characters")
    .required("Required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "14px" },
  });

  const { refetch } = useFetchChatsQuery();

  const [login] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleFormSubmit = (values, actions) => {
    setTimeout(async () => {
      try {
        // api mutate login
        const res = await login({
          username: values.username,
          password: values.password,
        }).unwrap();
        // dispatch set credentials
        dispatch(setCredentials({ ...res }));
        navigate("/");
        refetch();
      } catch (error) {
        toast({
          title: error.data.message,
          status: "error",
        });
      }
      actions.setSubmitting(false);
    }, 1000);
  };

  // Keyframes for the bouncing animation
  const bounce = keyframes`
0%, 20%, 50%, 80%, 100% {
  transform: translateY(0);
}
40% {
  transform: translateY(-15px);
}
60% {
  transform: translateY(-5px);
}
`;

  // Styled Flex container with the hover animation
  const BouncingFlex = styled(Flex)`
    &:hover {
      animation: ${bounce} 1s;
    }
  `;

  return (
    <Box w="90%" mx="auto">
      <Box pt={10} maxW="400px" mx="auto">
        <Heading
          pt={5}
          pb={10}
          textAlign="center"
          fontSize="2xl"
          fontWeight="500"
          color="#03094b"
          textTransform="uppercase"
          letterSpacing="6px"
        >
          Login
        </Heading>
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={loginValidationSchema}
        >
          {(props) => {
            return (
              <Form>
                <Field name="username">
                  {({ field, form }) => {
                    return (
                      <FormControl
                        isInvalid={
                          form.errors.username && form.touched.username
                        }
                        mb={5}
                        fontWeight="800"
                      >
                        <FormLabel>Username</FormLabel>
                        <Input
                          type="text"
                          {...field}
                          placeholder="Enter username"
                          border="none"
                          bg="rgba(0, 0, 0, 0.05)"
                          textColor="blackAlpha.800"
                          fontSize="small"
                          fontWeight="300"
                        />
                        <FormErrorMessage
                          fontSize="small"
                          color="red.400"
                          fontWeight="400"
                        >
                          {form.errors.username}
                        </FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Field name="password">
                  {({ field, form }) => {
                    return (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                        mb={8}
                      >
                        <FormLabel>Password</FormLabel>
                        <Input
                          type="password"
                          {...field}
                          placeholder="Enter password"
                          border="none"
                          bg="rgba(0, 0, 0, 0.05)"
                          textColor="blackAlpha.800"
                          fontSize="small"
                          fontWeight="300"
                        />
                        <FormErrorMessage
                          fontSize="small"
                          color="red.400"
                          fontWeight="400"
                        >
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Button
                  type="submit"
                  isLoading={props.isSubmitting}
                  bg="#ffde5c"
                  color="black"
                  border="4px"
                  borderColor="blackAlpha.50"
                  mb={8}
                  size="lg"
                  w="full"
                  fontFamily="heading"
                  fontWeight="500"
                  _hover={{ shadow: "lg" }}
                >
                  login
                </Button>
                <Text fontSize="14px" gap={2}>
                  Don't have an account?{" "}
                  <ChakraLink
                    as={ReactRouterLink}
                    to="/signup"
                    color="#0066ff"
                    ml={1}
                  >
                    Signup
                  </ChakraLink>
                </Text>
              </Form>
            );
          }}
        </Formik>
        <Flex flexDir="column" justify="center" align="center" mt="4em">
          <BouncingFlex flexDir="column" justify="center" align="center">
            <Image src="chick.svg" w="10em" />
            <Heading color="black">Peeps.</Heading>
          </BouncingFlex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Login;
