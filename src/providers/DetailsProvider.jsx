import React, { useState, useContext, useEffect } from 'react';
import { DetailsContext } from '../context'
import Config from '../Config';
import axios from 'axios';

export const DetailsProvider = ({ children }) => {
  const [statusValues, setStatusValues] = useState([]);
  const [productValues, setProductValues] = useState([]);
  const [userValues, setUserValues] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
        try {
            const statusResponse = await axios.get(`${Config.apiUrl}/status`);
            setStatusValues(statusResponse.data);

            const productResponse = await axios.get(`${Config.apiUrl}/products`);
            setProductValues(productResponse.data);

            const userResponse = await axios.get(`${Config.apiUrl}/users`);
            setUserValues(userResponse.data);
        } catch (error) {
            console.error(error);
        }
    };
    fetchDetails();
  },[])
    

  return (
    <DetailsContext.Provider value={{ statusValues, productValues, userValues }}>
      {children}
    </DetailsContext.Provider>
  );
};

export const useDetails = () => useContext(DetailsContext);