import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../context";
import { io } from 'socket.io-client';
import { Config } from '../Config';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      connectSocket(storedToken);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false); 
  }, []);

  const connectSocket = (jwtToken) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      const socketInstance = io(Config.apiUrl, {
        auth: {
          token: jwtToken,
        },
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected with UID:", user.UID, socketInstance.id);
      });

      setSocket(socketInstance);
    }
  };


  const login = (jwtToken, user) => {
    sessionStorage.setItem('token', jwtToken);
    sessionStorage.setItem('user', JSON.stringify(user));
    setToken(jwtToken);
    setIsAuthenticated(true);
    connectSocket(jwtToken);
  };

  const logout = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setIsAuthenticated(false);
    if (socket) {
      socket.disconnect();
      console.log("Socket disconnected with UID:", user.UID);
      setSocket(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, socket, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
