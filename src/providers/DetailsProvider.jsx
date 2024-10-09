import React, { useState, useContext, useEffect } from 'react';
import { DetailsContext } from '../context'
import { Config } from "../Config";
import axios from 'axios';

export const DetailsProvider = ({ children }) => {
  const token = sessionStorage.getItem('token'); 
  const [notifications, setNotifications] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const [productValues, setProductValues] = useState([]);
  const [leadValues, setLeadValues] = useState([]);
  const [userValues, setUserValues] = useState([]);
  const [followUpValues, setFollowUpValues] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [esriProducts, setEsriProducts] = useState([]);

  const fetchDetails = async () => {
    try {
      const statusResponse = await axios.post(`${Config.apiUrl}/status`, {}, {
        headers: {
          'Authorization': token 
        }
      });
      setStatusValues(Config.decryptData(statusResponse.data));

      const leadResponse = await axios.post(`${Config.apiUrl}/leadDetails`, {}, {
        headers: {
          'Authorization': token 
        }
      });
      setLeadValues(Config.decryptData(leadResponse.data));

    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const userResponse = await axios.post(`${Config.apiUrl}/users`, {}, {
        headers: {
          'Authorization': token 
        }
      });
      setUserValues(Config.decryptData(userResponse.data));
    } catch (error) {
      console.error(error)
    }
  }

  const fetchProducts = async () => {
    try {
      const productResponse = await axios.post(`${Config.apiUrl}/products`, {}, {
        headers: {
          'Authorization': token 
        }
      });
      setProductValues(Config.decryptData(productResponse.data));
    } catch (error) {
      console.error(error)
    }
  }

  const fetchFollowUps = async () => {
    try {
      const followUpResponse = await axios.post(`${Config.apiUrl}/followUpDetails`, {}, {
        headers: {
          'Authorization': token 
        }
      });
      setFollowUpValues(Config.decryptData(followUpResponse.data));
    } catch (error) {
      console.error(error)
    }
  }

  const fetchTasks = async () => {
    try {
      setTaskData([]);
      const response = await axios.post(`${Config.apiUrl}/tasks`, {}, {
        headers: {
          'Authorization': token 
        }
      });
      setTaskData(Config.decryptData(response.data));
    } catch (error) {
      console.error(error)
    }
  }

  const fetchESRIProducts = async () => {
    try {
      setEsriProducts([]);
      const response = await axios.post(`${Config.apiUrl}/getESRIProduct`, {}, {
        headers: {
          'Authorization': token 
        }
      });
      setEsriProducts(Config.decryptData(response.data));
    } catch (error) {
      console.error(error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const notifResponse = await axios.post(`${Config.apiUrl}/notifications`, {}, {
        headers: {
          'Authorization': token 
        }
      });
      setNotifications(Config.decryptData(notifResponse.data));
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
    fetchDetails();
    fetchProducts();
    fetchFollowUps();
    fetchTasks();
    fetchESRIProducts();
  }, []);


  return (
    <DetailsContext.Provider value={{
      statusValues, productValues, userValues, fetchUsers, fetchProducts, 
      fetchFollowUps, leadValues, followUpValues, fetchTasks, taskData,
      setEsriProducts,esriProducts,fetchESRIProducts, fetchNotifications, notifications
    }}>
      {children}
    </DetailsContext.Provider>
  );
};

export const useDetails = () => useContext(DetailsContext);