import React, { createContext, useState } from "react";

export const AuthContext = createContext();  // Create the Context

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}  {/* Wraps the entire app */}
    </AuthContext.Provider>
  );
};
