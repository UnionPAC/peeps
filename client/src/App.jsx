import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <Box
      height="100dvh"
      bgImage="url('blob-scene-haikei.svg')"
      bgRepeat="no-repeat"
      bgSize="cover"
    >
      <Outlet />
    </Box>
  );
};

export default App;
