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
} from "@chakra-ui/react";
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

  return (
    <Box w="90%" mx="auto" mt="2em">
      <Box maxW="320px" mx="auto">
        <Heading textAlign="center" mb="5">
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
                      >
                        <FormLabel>Username</FormLabel>
                        <Input
                          type="text"
                          {...field}
                          placeholder="Enter username..."
                        />
                        <FormErrorMessage fontSize={14} color="red.400">
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
                        mb={5}
                      >
                        <FormLabel>Password</FormLabel>
                        <Input
                          type="password"
                          {...field}
                          placeholder="Enter password..."
                        />
                        <FormErrorMessage fontSize={14} color="red.400">
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Button mb={5} type="submit" isLoading={props.isSubmitting}>
                  Login
                </Button>
                <Text>
                  Don't have an account?{" "}
                  <ChakraLink
                    color="blue.400"
                    as={ReactRouterLink}
                    to="/signup"
                  >
                    Signup
                  </ChakraLink>
                </Text>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Box>
  );
};

export default Login;
