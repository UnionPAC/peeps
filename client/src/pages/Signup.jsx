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
  Flex,
  Image,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useSignupMutation } from "../slices/userApiSlice";

const initialValues = {
  username: "",
  email: "",
  password: "",
  password2: "",
};

const signupValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(18, "Password cannot be greater than 18 characters")
    .required("Required"),
  password2: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast({
    isClosable: true,
    variant: "left-accent",
    position: "top-right",
    containerStyle: { fontSize: "13px" },
  });

  const [signup] = useSignupMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleFormSubmit = (values, actions) => {
    setTimeout(async () => {
      try {
        // api mutate signup
        const res = await signup({
          username: values.username,
          email: values.email,
          password: values.password,
        }).unwrap();
        // dispatch set credentials
        dispatch(setCredentials({ ...res }));
        navigate("/");
        toast({
          title: "Signup successful!",
          status: "success",
        });
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
          pb={4}
          textAlign="center"
          fontSize="2xl"
          fontWeight="500"
          color="#03094b"
          textTransform="uppercase"
          letterSpacing="6px"
        >
          Signup
        </Heading>
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={signupValidationSchema}
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
                <Field name="email">
                  {({ field, form }) => {
                    return (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                        mb={5}
                      >
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          {...field}
                          placeholder="Enter email"
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
                          {form.errors.email}
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
                        mb={5}
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
                <Field name="password2">
                  {({ field, form }) => {
                    return (
                      <FormControl
                        isInvalid={
                          form.errors.password2 && form.touched.password2
                        }
                        mb={5}
                      >
                        <FormLabel>Confirm Password</FormLabel>
                        <Input
                          type="password"
                          {...field}
                          placeholder="Confirm password"
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
                          {form.errors.password2}
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
                  Signup
                </Button>
                <Text fontSize="14px" gap={2}>
                  Already have an account?{" "}
                  <ChakraLink
                    as={ReactRouterLink}
                    to="/login"
                    color="#0066ff"
                    ml={1}
                  >
                    Login
                  </ChakraLink>
                </Text>
              </Form>
            );
          }}
        </Formik>
        <Flex flexDir="column" justify="center" align="center" mt="2.5em">
          <BouncingFlex flexDir="column" justify="center" align="center">
            <Image src="chick.svg" w="10em" />
            <Heading color="black">Peeps.</Heading>
          </BouncingFlex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Signup;
