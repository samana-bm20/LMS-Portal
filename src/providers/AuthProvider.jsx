import { useState, useContext } from "react";
import { AuthContext } from "../context";
import CryptoJS from "crypto-js";
import axios from "axios";
import Config from "../Config";

export const AuthProvider = ({ children }) => {

  const [users, setUsersDetails] = useState();
  const [errorOpen, setErrorOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = sessionStorage.getItem("isAuthenticated");
    return storedAuth === "true";
  });

  let user;
  let username;
  let password;
  let decryptedUsername;

  const fetchUserData = async () => {
    try {
      const response = await axios.post(`${Config.apiUrl}/users`);
      const userData = Config.decryptData(response.data);
      user = userData.filter((user) => user.username === decryptedUsername);
      setUsersDetails(user)

      username = user[0].username;
      password = user[0].password;
    } catch (error) {
      console.error(error);
    }
  };

  const login = () => {
    const encryptionKey = "my-secure-key-123456";
    const storedUsername = sessionStorage.getItem("username");
    const storedPassword = sessionStorage.getItem("password");
    decryptedUsername = CryptoJS.AES.decrypt(
      storedUsername,
      encryptionKey
    ).toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(
      storedPassword,
      encryptionKey
    ).toString(CryptoJS.enc.Utf8);


    fetchUserData();

    setTimeout(() => {
      if (decryptedUsername == username && decryptedPassword == password) {
        setIsAuthenticated(true);
        sessionStorage.setItem("isAuthenticated", "true");
        // window.location.href = "/dashboard";
      } else {
        setErrorOpen(true);
      }
    }, 100);
  };

  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, users, errorOpen, setErrorOpen }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
