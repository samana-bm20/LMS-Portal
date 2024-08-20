import React, { useState, useEffect } from 'react'
import {
    Box, Button, MenuItem, FormControl, TextField, InputLabel, Select, Dialog,
    DialogTitle, DialogContent, Snackbar, Alert, Tabs, Tab
} from '@mui/material';
import Config from '../../Config';
import axios from 'axios';
import { useDetails } from '../../providers/DetailsProvider';
import PropTypes from 'prop-types';

import LeadDetails from './LeadDetails';
import ProductDetails from './ProductDetails';
import FollowUpHistory from './FollowUpHistory';

function CustomTabPanel(props) {
    
    // const []= useState()
    const { children, value, index, ...other } = props;
    

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ViewProfile = ({ openViewProfile, setOpenViewProfile, lid, statusValues }) => {
    const [data, setData] = useState([]);
    const [leads, setLeads] = useState('All');
    const [value, setValue] = useState(0);
    
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const closeViewProfile = () => {
        setOpenViewProfile(false);
    }
   

    

    return (
        <>
            <Dialog
                open={openViewProfile}
                onClose={closeViewProfile}
            >
                <DialogTitle>Lead Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Lead Details" {...a11yProps(0)} />
                                <Tab label="Product Details" {...a11yProps(1)} />
                                <Tab label="Follow-Up" {...a11yProps(2)} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                            <LeadDetails leadId={lid}/>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <ProductDetails leadId={lid} statusValues = {statusValues}/>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            <FollowUpHistory leadId={lid} />
                        </CustomTabPanel>
                    </Box>
                </DialogContent>
            </Dialog>
            {/* <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={addProductError}
                autoHideDuration={2000}
                onClose={addProductErrorClose}>
                <Alert onClose={addProductErrorClose} severity="error" variant='filled'>
                    {addErrorMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={addProductSuccess}
                autoHideDuration={2000}
                onClose={addProductSuccessClose}>
                <Alert onClose={addProductSuccessClose} severity="success" variant='filled'>
                    New product added successfully!
                </Alert>
            </Snackbar> */}

        </>
    )
}

export default ViewProfile