import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const encoded = localStorage.getItem("token");
    if (encoded) {
      const decoded = jwt_decode(encoded);
      setToken(decoded);

      // TO-DO: find a better way to handle token expiration

      // const currentTime = Date.now() / 1000;
      // if (decoded.exp < currentTime) {
      //   localStorage.removeItem("token");
      //   window.location.href = "/";
      // } else {
      //   setToken(decoded);
      // }
    }
  }, []);

  const login = (newToken) => {
    const decoded = jwt_decode(newToken);
    setToken(decoded);
    localStorage.setItem("token", newToken);
    navigate("dashboard");
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
