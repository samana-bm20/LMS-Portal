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
        const userResponse = await axios.get(`${Config.apiUrl}/users`);
        const user = (userResponse.data).filter((user) => user.username === decryptedUsername);
        const response = await axios.get(`${Config.apiUrl}/leadData/${user[0]?.UID}/${product}`);
        setData(response.data);
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
