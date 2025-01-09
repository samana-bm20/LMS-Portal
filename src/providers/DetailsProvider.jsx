import React, { useState, useContext, useEffect } from 'react';
import { DetailsContext } from '../context'
import { Config } from "../Config";
import { Config } from "../Config";
import axios from 'axios';

export const DetailsProvider = ({ children }) => {
  const token = sessionStorage.getItem('token'); 
  const [notifications, setNotifications] = useState([]);
  const token = sessionStorage.getItem('token'); 
  const [notifications, setNotifications] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const [productValues, setProductValues] = useState([]);
  const [leadValues, setLeadValues] = useState([]);
  const [userValues, setUserValues] = useState([]);
  const [followUpValues, setFollowUpValues] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [esriProducts, setEsriProducts] = useState([]);
  const [mLSoftwareProducts, setMLSoftwareProducts] = useState([]);
  const [mlPaymentdetails, setMLPaymentDetails] = useState([]);

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
      debugger
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

  const fetchMLSoftwareProducts = async () => {
    try {
      setMLSoftwareProducts([]);
      const response = await axios.post(`${Config.apiUrl}/getSoftwareProduct`, {}, {
        headers: {
          'Authorization': token 
        }
      });
      setMLSoftwareProducts(Config.decryptData(response.data));
    } catch (error) {
      console.error(error)
    }
  }

  const fetchMLPaymentsDetails=async()=>{
 try{
     setMLPaymentDetails([]);
     const response=await axios.post(`${Config.apiUrl}/getPaymentDetails`,{},{
      headers: {
        'Authorization': token 
      }
     });
     setMLPaymentDetails(Config.decryptData(response.data));     
    }catch(error){
  console.error(error);
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
    fetchUsers();
    fetchNotifications();
    fetchDetails();
    fetchProducts();
    fetchProducts();
    fetchFollowUps();
    fetchTasks();
    fetchESRIProducts();
    fetchMLSoftwareProducts();
    fetchMLPaymentsDetails();
  }, []);


  return (
    <DetailsContext.Provider value={{fetchDetails,
      statusValues, productValues, userValues, fetchUsers, fetchProducts, 
      fetchFollowUps, leadValues, followUpValues, fetchTasks, taskData,
      setEsriProducts,esriProducts,fetchESRIProducts, fetchNotifications, notifications,
      mLSoftwareProducts,setMLSoftwareProducts,fetchMLSoftwareProducts,mlPaymentdetails,setMLPaymentDetails,
      fetchMLPaymentsDetails
    }}>
      {children}
    </DetailsContext.Provider>
  );
};

export const useDetails = () => useContext(DetailsContext);