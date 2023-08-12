import { Link as ReactRouterLink } from "react-router-dom";
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
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const initialValues = {
  username: "",
  email: "",
  password: "",
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
  const handleFormSubmit = (values, actions) => {
    setTimeout(() => {
      alert("Signup success!");

      // CALL REGISTER USER FROM API
      actions.setSubmitting(false);
    }, 1000);
  };

  return (
    <Box w="90%" mx="auto" mt="2em">
      <Box maxW="320px" mx="auto">
        <Heading textAlign="center" mb="5">
          Signup
        </Heading>
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={signupValidationSchema}
        >
          {(props) => {
            // console.log(props);
            return (
              <Form>
                <Field name="username">
                  {({ field, form }) => {
                    // console.log({ form, field });
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
                          placeholder="Enter email..."
                        />
                        <FormErrorMessage fontSize={14} color="red.400">
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
                          placeholder="Enter password..."
                        />
                        <FormErrorMessage fontSize={14} color="red.400">
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
                          placeholder="Confirm password..."
                        />
                        <FormErrorMessage fontSize={14} color="red.400">
                          {form.errors.password2}
                        </FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Button mb={5} type="submit" isLoading={props.isSubmitting}>
                  Signup
                </Button>
                <Text>
                  Already have an account?{" "}
                  <ChakraLink color="blue.400" as={ReactRouterLink} to="/login">
                    Login
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

export default Signup;
