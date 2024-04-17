'use client'

import { getCookie } from "cookies-next";

const { createContext, useContext, useState, useEffect } = require("react");

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState({});


  const value = {
    authUser,
    setAuthUser,
  };

  useEffect(() => {
    if(!authUser?.token) {
      setAuthUser({
        token: getCookie('auth_token'),
        name: getCookie('name')
      })
    }
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
