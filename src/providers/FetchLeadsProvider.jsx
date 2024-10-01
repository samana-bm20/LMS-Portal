import React, { useState, useContext, useEffect } from 'react';
import { FetchLeadsContext } from '../context'
import Config from '../Config';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export const FetchLeadsProvider = ({ children }) => {
 
  const encryptionKey = "my-secure-key-123456";
  const storedUsername = sessionStorage.getItem("username");
  let decryptedUsername
  if (storedUsername) {
    decryptedUsername = CryptoJS.AES.decrypt(
      storedUsername,
      encryptionKey
    ).toString(CryptoJS.enc.Utf8);
  }

  const [data, setData] = useState([]);
  const [product, setProduct] = useState('All');

  const fetchLeadsData = async () => {
    try {
      if (storedUsername) {
        const userResponse = await axios.post(`${Config.apiUrl}/users`);
        const user = (Config.decryptData(userResponse.data)).filter((user) => user.username === decryptedUsername);
        const params = {
          uid: user[0]?.UID,
          pid: product
        }
        const response = await axios.post(`${Config.apiUrl}/leadData`, params);
        setData(Config.decryptData(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, []);

  return (
    <FetchLeadsContext.Provider value={{ fetchLeadsData, data, product, setProduct }}>
      {children}
    </FetchLeadsContext.Provider>
  );
};

export const useFetchLeads = () => useContext(FetchLeadsContext);
