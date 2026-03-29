import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type UserAuthContextType = {
  isLoggedIn: boolean;
  loginUser: (jwtToken: string) => void;
  logoutUser: () => void;
};
type childrenType = {
  children: React.ReactNode;
};

const UserAuthContext = createContext<UserAuthContextType | null>(null);

export const UserAuthContextProvider = ({ children }: childrenType) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("jwtToken");
  });
  const navigate = useNavigate();

  const loginUser = (jwtToken: string) => {
    localStorage.setItem("jwtToken", jwtToken);
    setIsLoggedIn(true);
    navigate("/projects");
  };
  const logoutUser = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <UserAuthContext.Provider value={{ isLoggedIn, loginUser, logoutUser }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export { UserAuthContext };
