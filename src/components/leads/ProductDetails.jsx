import React, { useEffect, useState } from 'react';
import { Paper, Box, FormControl, MenuItem, Select, useTheme } from '@mui/material';
import axios from 'axios';
import { Config } from '../../Config';
import { useDetails } from '../../providers/DetailsProvider';

const ProductDetails = ({ leadId, productId }) => {
  const theme = useTheme();
  const token = sessionStorage.getItem('token');
  const [leadProducts, setLeadProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { statusValues, userValues, productValues } = useDetails();

  const sidToColor = {
    S1: theme.palette.text.disabled,
    S2: theme.palette.secondary.main,
    S3: theme.palette.warning.main,
    S4: theme.palette.success.main,
    S5: theme.palette.error.main,
    S6: theme.palette.info.main,
  };

  const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };

  //#region Fetch Product Data
  const fetchProductData = async () => {
    try {
      const response = await axios.post(`${Config.apiUrl}/productDetails`, {}, {
        headers: {
          'Authorization': token
        }
      });
      const productData = Config.decryptData(response.data);
      const filteredProducts = productData.filter(product => product.LID === leadId);
      setLeadProducts(filteredProducts);

      const defaultProduct = filteredProducts.find(product => product.PID === productId) || filteredProducts[0];
      setSelectedProduct(defaultProduct);
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

  //#region Dropdown Change
  const handleProductChange = (event) => {
    const selectedProductId = event.target.value;
    const newSelectedProduct = leadProducts.find(product => product.PID === selectedProductId);
    setSelectedProduct(newSelectedProduct);
  };

  return (
    <Paper elevation={3} className="p-2">
      <div
        className="text-center rounded-md py-2 w-full"
        style={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText
        }}
      >
        <p className="text-lg">Product Details</p>
      </div>

      <Box className="flex items-center gap-2">
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <Select
            value={selectedProduct?.PID || ''}
            onChange={handleProductChange}
            fullWidth
            variant="outlined"
          >
            {leadProducts.map((product, index) => (
              <MenuItem key={index} value={product.PID}>
                {productMap[product.PID] || `Product ${index + 1}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {leadProducts.length > 1 && (
          <span className="text-xs rounded-xl p-1"
            style={{ backgroundColor: theme.palette.text.disabled, color: theme.palette.primary.contrastText }}>+more</span>
        )}
      </Box>

      {/* Display selected product details */}
      {selectedProduct && (
        <Box className="overflow-y-auto px-2">
          <div className="flex">
            <span className="font-semibold text-sm mr-2">PID: </span>
            <span className='text-sm'>{selectedProduct.PID}</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-sm mr-2">Product: </span>
            <span className='text-sm'>{productMap[selectedProduct.PID] || 'Unknown'}</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-sm mr-2">Status: </span>
            <span className='text-sm px-1 rounded-xl'
              style={{
                backgroundColor: sidToColor[selectedProduct.SID],
                color: theme.palette.primary.contrastText
              }}
            >
              {statusMap[selectedProduct.SID] || 'Unknown'}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold text-sm mr-2">Source: </span>
            <span className='text-sm'>{selectedProduct.source}</span>
          </div>

          <div className="flex">
            <span className="font-semibold text-sm mr-2">Created On: </span>
            <span className='text-sm'>{new Date(selectedProduct.createdOn).toLocaleDateString('en-GB', dateOptions).replace(/ /g, '-')}</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-sm mr-2 mb-2">Assigned To: </span>
            <span className='text-sm'>{userMap[selectedProduct.UID] || 'Unknown'}</span>
          </div>
        </Box>
      )}
    </Paper>
  );
};

export default ProductDetails;
