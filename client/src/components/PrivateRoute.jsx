import { Navigate } from "react-router-dom";

const PrivateRoute = () => {
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
