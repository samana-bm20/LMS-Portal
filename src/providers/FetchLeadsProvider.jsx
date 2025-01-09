import React, { useState, useContext, useEffect } from 'react';
import { FetchLeadsContext } from '../context'
import { Config } from "../Config";
import axios from 'axios';

export const FetchLeadsProvider = ({ children }) => {
  const token = sessionStorage.getItem('token'); 

  const [data, setData] = useState([]);
  const [product, setProduct] = useState('All');

  const fetchLeadsData = async () => {
    try {
      if (token) {
        const response = await axios.post(`${Config.apiUrl}/leadData`, { pid: product }, {
          headers: {
            'authorization': token
          }
        });
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
