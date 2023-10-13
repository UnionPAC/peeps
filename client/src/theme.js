import { extendTheme } from "@chakra-ui/react";
import "@fontsource/gluten/500.css"; // Specify weight
import "@fontsource/gluten/700.css";
import "@fontsource/gluten/800.css"; 
import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";

const theme = extendTheme({
  fonts: {
    heading: `'Gluten', cursive`,
    body: `'Lato', sans-serif`,
  },
});

export default theme;
