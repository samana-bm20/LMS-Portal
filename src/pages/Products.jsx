import React, { useState } from 'react'
import { Button } from '@mui/material'
import { AddLocationRounded } from '@mui/icons-material'

import { useDetails } from '../providers/DetailsProvider'
import AddNewProduct from '../components/products/AddNewProduct'
import ProductCards from '../components/products/ProductCards'

const Products = () => {
  const { userValues, loggedUser } = useDetails();
  const user = userValues.filter((user) => user.username == loggedUser);
  const [openAddProduct, setOpenAddProduct] = useState(false)

  return (
    <>
      {user[0]?.userType == 1 && (
        <div className="flex flex-col md:flex-row justify-end space-x-reverse p-2 ">
          <Button
            sx={{ m: '5px' }}
            variant="contained"
            startIcon={<AddLocationRounded />}
            onClick={() => setOpenAddProduct(true)}
          >
            Add Product
          </Button>
        </div>
      )}
      <AddNewProduct
        openAddProduct={openAddProduct}
        setOpenAddProduct={setOpenAddProduct}
      />
      <div className="container mx-auto p-2 m-2">
        <ProductCards />
      </div>

    </>
  )
}

export default Products