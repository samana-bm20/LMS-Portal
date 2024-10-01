import React, { useState, useContext, useEffect } from 'react';
import { DetailsContext } from '../context'
import Config from '../Config';
import axios from 'axios';
import CryptoJS from "crypto-js";

export const DetailsProvider = ({ children }) => {
  const [statusValues, setStatusValues] = useState([]);
  const [productValues, setProductValues] = useState([]);
  const [leadValues, setLeadValues] = useState([]);
  const [userValues, setUserValues] = useState([]);
  const [followUpValues, setFollowUpValues] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [loggedUser, setLoggedUser] = useState([]);
  const [esriProducts, setEsriProducts] = useState([]);
  let storedUsername;

  const fetchUser = () => {
    const encryptionKey = "my-secure-key-123456";

    storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      const decryptedUsername = CryptoJS.AES.decrypt(
        storedUsername,
        encryptionKey
      ).toString(CryptoJS.enc.Utf8);
      setLoggedUser(decryptedUsername)
    }
  }

  const fetchDetails = async () => {
    try {
      const statusResponse = await axios.post(`${Config.apiUrl}/status`);
      setStatusValues(Config.decryptData(statusResponse.data));

      const leadResponse = await axios.post(`${Config.apiUrl}/leadDetails`);
      setLeadValues(Config.decryptData(leadResponse.data));

    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const userResponse = await axios.post(`${Config.apiUrl}/users`);
      setUserValues(Config.decryptData(userResponse.data));
    } catch (error) {
      console.error(error)
    }
  }

  const fetchProducts = async () => {
    try {
      const productResponse = await axios.post(`${Config.apiUrl}/products`);
      setProductValues(Config.decryptData(productResponse.data));
    } catch (error) {
      console.error(error)
    }
  }

  const fetchFollowUps = async () => {
    try {
      const followUpResponse = await axios.post(`${Config.apiUrl}/followUpDetails`);
      setFollowUpValues(Config.decryptData(followUpResponse.data));
    } catch (error) {
      console.error(error)
    }
  }

  const fetchTasks = async () => {
    try {
      setTaskData([]);
      const response = await axios.post(`${Config.apiUrl}/tasks`);
      setTaskData(Config.decryptData(response.data));
    } catch (error) {
      console.error(error)
    }
  }

  const fetchESRIProducts = async () => {
    try {
      setEsriProducts([]);
      const response = await axios.post(`${Config.apiUrl}/getESRIProduct`);
      setEsriProducts(Config.decryptData(response.data));
    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    fetchUser();
    fetchUsers();
    fetchDetails();
    fetchProducts();
    fetchFollowUps();
    fetchTasks();
    fetchESRIProducts();
  }, []);


  return (
    <DetailsContext.Provider value={{
      statusValues, productValues, userValues, fetchUsers, fetchProducts, 
      fetchFollowUps, loggedUser, leadValues, followUpValues, fetchTasks, taskData,
      setEsriProducts,esriProducts,fetchESRIProducts
    }}>
      {children}
    </DetailsContext.Provider>
  );
};

export const useDetails = () => useContext(DetailsContext);