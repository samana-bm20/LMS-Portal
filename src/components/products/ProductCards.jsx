import React, { useState } from 'react';
import { Card, Avatar, CardContent, IconButton, useTheme } from '@mui/material';
import { EditRounded } from '@mui/icons-material';
import { useDetails } from '../../providers/DetailsProvider';
import EditProduct from './EditProduct';

const ProductCards = () => {
    const { productValues, userValues, loggedUser } = useDetails();
    const user = userValues.filter((user) => user.username == loggedUser);
    const theme = useTheme();
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [productID, setProductID] = useState();
    const [openEditProduct, setOpenEditProduct] = useState(false);

    const toggleExpand = (productId) => {
        setExpandedProductId(expandedProductId === productId ? null : productId);
    };

    const handleEditProduct = (pid) => {
        setProductID(pid);
        setOpenEditProduct(true);
    }

    return (
        <>
            <div className="grid gap-6 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1">
                {productValues.map(product => (
                    <Card key={product.PID} className='flex flex-col border' sx={{
                        borderColor: theme.palette.primary.main
                    }}>
                        <div className='flex items-center' style={{ backgroundColor: theme.palette.primary.main }}>
                            <Avatar variant='rounded'
                                sx={{
                                    bgcolor: theme.palette.background.card,
                                    color: theme.palette.primary.main, m: 2, p: 3,
                                    fontWeight: 'bold'
                                }}>
                                {product.PID}
                            </Avatar>
                            <div className='py-2 px-4' >
                                <div className="text-lg font-semibold"
                                    style={{ color: theme.palette.primary.contrastText }}>{product.pName}</div>
                                <div className="text-md italic" style={{ color: theme.palette.primary.contrastSecondary }}>
                                    {product.tagline}</div>
                            </div>
                        </div>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <div className="text-sm font-semibold mb-4">Owned By: {product.owner}</div>
                            <div className='text-sm'>
                                {/* Show full description if the product is expanded */}
                                {expandedProductId === product.PID
                                    ? product.pDescription
                                    : `${(product.pDescription).substring(0, 300)}...`}
                                <span
                                    className="cursor-pointer text-xs italic font-semibold ml-1"
                                    style={{ color: theme.palette.primary.main }}
                                    onClick={() => toggleExpand(product.PID)} // Pass product PID to toggleExpand
                                >
                                    {expandedProductId === product.PID ? '(Show Less)' : '(View More)'}
                                </span>
                            </div>
                        </CardContent>
                        {user[0]?.userType == 1 && (
                            <div className="flex justify-end mb-2">
                                <IconButton aria-label="edit" sx={{ mx: 1 }}  onClick={() => handleEditProduct(product.PID)} >
                                    <EditRounded color='primary'/>
                                </IconButton>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
            <EditProduct
                openEditProduct={openEditProduct}
                setOpenEditProduct={setOpenEditProduct}
                pid={productID}
            />
        </>

    );
}

export default ProductCards