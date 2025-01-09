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
        auth: { token: jwtToken },
        hostname: 'https://mlinfomap.org:5055',
        // hostname: 'http://103.171.96.104/lmsapi',
        path: "/socket.io",
        transports: ['polling'],  // Fallback to polling
        secure: true,
        reconnection: true,       // Enable reconnection
        reconnectionAttempts: 5,  // Limit reconnection attempts
        reconnectionDelay: 1000,  // Time between reconnection attempts
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected with UID:", user.UID, socketInstance.id);
        socketInstance.emit('reconnectNotifications', user.UID);
      });

      socketInstance.on("reconnect", (attemptNumber) => {
        // Resend token after reconnection
        socketInstance.auth.token = jwtToken;
        socketInstance.connect();

        // Resubscribe to notifications
        socketInstance.emit('reconnectNotifications', user.UID);
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
