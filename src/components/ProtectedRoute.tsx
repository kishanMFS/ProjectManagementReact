import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";

import { useNavigate } from "react-router-dom";

type childrenType = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: childrenType) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoginPage = location.pathname === "/login";
    if (isLoggedIn) {
      if (isLoginPage) navigate("projects", { replace: true });
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? children : null;
}

export default ProtectedRoute;
