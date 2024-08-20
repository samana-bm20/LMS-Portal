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
  let storedUsername;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const statusResponse = await axios.get(`${Config.apiUrl}/status`);
        setStatusValues(statusResponse.data);

        const productResponse = await axios.get(`${Config.apiUrl}/products`);
        setProductValues(productResponse.data);

        const userResponse = await axios.get(`${Config.apiUrl}/users`);
        setUserValues(userResponse.data);

        const followUpResponse = await axios.get(`${Config.apiUrl}/followUpDetails`);
        setFollowUpValues(followUpResponse.data);

        const leadResponse = await axios.get(`${Config.apiUrl}/leadDetails`);
        setLeadValues(leadResponse.data);


      } catch (error) {
        console.error(error);
      }
    };
    fetchDetails();
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}/tasks`);
      setTaskData(response.data);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
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
    fetchUser();

  }, [storedUsername])

  return (
    <DetailsContext.Provider value={{
      statusValues, productValues, userValues,
      loggedUser, leadValues, followUpValues, fetchTasks, taskData
    }}>
      {children}
    </DetailsContext.Provider>
  );
};

export const useDetails = () => useContext(DetailsContext);