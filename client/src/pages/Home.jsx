import { useSelector } from "react-redux";

const Home = () => {
  const {
    userInfo: { username },
  } = useSelector((state) => state.auth);

  return (
    <>
      <p>Homepage</p>
    </>
  );
};

export default Home;
