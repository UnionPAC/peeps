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
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

const initialValues = {
  username: "",
  email: "",
  password: "",
};

const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(18, "Username cannot be longer than 18 characters")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required(),
});

const handleSubmit = () => {
  alert("submitted!");
};

const Signup = () => {
  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={signupSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Field name="username">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.username && form.touched.username}
              >
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input {...field} id="username" placeholder="Enter username" />
                <FormErrorMessage>{form.errors.username}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="email">
            {({ field, form }) => (
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input {...field} id="email" placeholder="Enter email" />
                {form.errors.email && form.touched.email && (
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                )}
              </FormControl>
            )}
          </Field>
          <Field name="password">
            {({ field, form }) => (
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input {...field} id="password" placeholder="Enter password" />
                {form.errors.password && form.touched.password && (
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                )}
              </FormControl>
            )}
          </Field>
          <Button type="submit">Signup</Button>
          <Box>
            <Text>
              Already have an account?{" "}
              <ChakraLink as={ReactRouterLink} to="/login">
                Login
              </ChakraLink>
            </Text>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
};

export default Signup;
