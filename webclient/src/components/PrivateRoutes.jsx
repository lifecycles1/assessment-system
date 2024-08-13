import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import usePersist from "../hooks/usePersist";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "../features/auth/authApiSlice";

const PrivateRoutes = () => {
  const { token } = useAuth();
  const [persist] = usePersist();
  const effectRan = useRef(false);
  const [trueSuccess, setTrueSuccess] = useState(false);
  const [refresh, { isLoading, isError }] = useRefreshMutation();

  // return token ? <Outlet /> : <Navigate to="/" />;

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const response = await refresh().unwrap();
        setTrueSuccess(true);
      } catch (err) {
        console.err(err);
      }
    };

    if (effectRan.current === false && persist) {
      if (!token) {
        verifyRefreshToken();
      }
      effectRan.current = true;
    }
  }, []);

  if (token) {
    return <Outlet />;
  } else if (isLoading) {
    return <div>Loading...</div>;
  } else if (trueSuccess) {
    return <Outlet />;
  } else if (!persist || isError) {
    return <Navigate to="/" />;
  }

  return null;
};

export default PrivateRoutes;
