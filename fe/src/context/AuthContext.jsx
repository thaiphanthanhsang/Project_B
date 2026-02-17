import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage first, then sessionStorage
    const savedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");
      }
    }
  }, []);

  const login = (userData, token, remember = true) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("token", token);
    storage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("currentUser");
    setUser(null);
  };

  const updateUser = (newUserData) => {
    localStorage.setItem("currentUser", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
