import React, { useState, useContext, useEffect } from 'react';
import { FetchLeadsContext } from '../context'
import Config from '../Config';
import axios from 'axios';

export const FetchLeadsProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [product, setProduct] = useState('All');

  const fetchLeadsData = async () => {
    try {
        const response = await axios.get(`${Config.apiUrl}/leadData/${product}`);
        setData(response.data);
    } catch (error) {
        console.error(error);
    }
};

 useEffect(() => {
  fetchLeadsData();
 },[]);

  return (
    <FetchLeadsContext.Provider value={{ fetchLeadsData, data, product, setProduct }}>
      {children}
    </FetchLeadsContext.Provider>
  );
};

export const useFetchLeads = () => useContext(FetchLeadsContext);
