import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import { Box, filter } from "@chakra-ui/react";
import { useFetchChatsMutation } from "../slices/chatApiSlice";
import { useSelector } from "react-redux";

const Chats = ({ searchKeyword }) => {
  const [chats, setChats] = useState([]);

  const [fetchChats, { isError, isLoading }] = useFetchChatsMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const fetchUserChats = async () => {
    try {
      const res = await fetchChats().unwrap();
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getChats = fetchUserChats().then((result) => setChats(result));
  }, [chats]);

  return (
    <Box margin="1rem" cursor="pointer">
      {chats.map((chat) => {
        return <ChatBox key={chat._id} chat={chat} />;
      })}
    </Box>
  );
};

export default Chats;
