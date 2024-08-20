import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import Config from '../../Config';
import axios from 'axios';
import { DetailsContext } from '../../context';

const ProductDetails = ({ leadId }) => {
  const [data, setData] = useState([]);
  const [currentLeadProducts, setCurrentLeadProducts] = useState([]);
  const { statusValues, userValues, productValues } = useContext(DetailsContext);

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}/productDetails`);
      const productData = response.data;
      setData(productData);
      const filteredProducts = productData.filter(product => product.LID === leadId);
      setCurrentLeadProducts(filteredProducts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [leadId]);

  const statusMap = statusValues.reduce((map, status) => {
    map[status.SID] = status.sName;
    return map;
  }, {});

  const userMap = userValues.reduce((map, user) => {
    map[user.UID] = user.uName;
    return map;
  }, {});

  const productMap = productValues.reduce((map, product) => {
    map[product.PID] = product.pName;
    return map;
  }, {});

  return (
    <Box
      sx={{
        height: '343px',
        overflowY: 'auto',
        width:'500px'
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          backgroundColor: '#0245A3',
          color: 'white',
          textAlign: 'center',
          padding: '2px 0',
          
        }}
      >
        Product Details
      </Typography>

      {currentLeadProducts.map((product, index) => (
        <Box key={index} sx={{ marginBottom: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #ddd',
              marginBottom: '12px',
              
            }}
          >
            {`Product ${index + 1}`}
          </Typography>

          <Grid container spacing={2}
          sx={{width:'495px',}}
          >
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>ID : </strong> {product.PID}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Product : </strong> {productMap[product.PID] || 'Unknown'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Status : </strong> {statusMap[product.SID] || 'Unknown'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Source : </strong> {product.source}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Created On : </strong> {new Date(product.createdOn).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Assigned to : </strong> {userMap[product.UID] || 'Unknown'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default ProductDetails;
