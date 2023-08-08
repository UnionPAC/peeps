import { Link as ReactRouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

const initialValues = {
  email: "",
  password: "",
};

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required(),
});

const handleSubmit = () => {
  alert("submitted!");
};

const Login = () => {
  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        <Form>
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
          <Button type="submit">Login</Button>
          <Box>
            <Text>
              Don't have an account?{" "}
              <ChakraLink as={ReactRouterLink} to="/signup">
                Signup
              </ChakraLink>
            </Text>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
};

export default Login;
