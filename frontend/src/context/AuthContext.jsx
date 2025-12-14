import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Tạo Context và EXPORT NAMED (để sửa lỗi import { AuthContext })
export const AuthContext = createContext(null);

// 2. Tạo Provider
export const AuthProvider = ({ children }) => {
  // Khởi tạo state user từ localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Hàm login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  // Hàm logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Export hook useAuth (Cách dùng hiện đại)
export const useAuth = () => {
  return useContext(AuthContext);
};

// 4. Default export (Để hỗ trợ import AuthContext from ...)
export default AuthContext;
