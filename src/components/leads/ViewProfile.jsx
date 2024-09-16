import React, { useState, useEffect } from 'react'
import {
    Box, Button, MenuItem, FormControl, TextField, InputLabel, Select, Dialog,
    DialogTitle, DialogContent, Snackbar, Alert, Tabs, Tab,
    DialogActions, IconButton
} from '@mui/material';
import Config from '../../Config';
import axios from 'axios';
import { useDetails } from '../../providers/DetailsProvider';
import PropTypes from 'prop-types';
import { CloseRounded } from '@mui/icons-material';
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

const ViewProfile = ({ openViewProfile, setOpenViewProfile, lid, pid }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const closeViewProfile = () => {
        setOpenViewProfile(false);
        setValue(0);
    }

    return (
        <>
            <Dialog
                open={openViewProfile}
                onClose={closeViewProfile}
            >
                <div className='flex justify-between items-center gap-4 mr-2'>
                    <DialogTitle>Lead Profile</DialogTitle>
                    <IconButton aria-label="close" color="primary" onClick={closeViewProfile}>
                        <CloseRounded fontSize="inherit" />
                    </IconButton>
                </div>
                <DialogContent>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Lead Details" {...a11yProps(0)} />
                                <Tab label="Product Details" {...a11yProps(1)} />
                                <Tab label="Follow-Up" {...a11yProps(2)} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel className='w-[450px] h-[300px]' value={value} index={0}>
                            <LeadDetails leadId={lid} />
                        </CustomTabPanel>
                        <CustomTabPanel className='w-[450px] h-[300px]' value={value} index={1}>
                            <ProductDetails leadId={lid} productId={pid} />
                        </CustomTabPanel>
                        <CustomTabPanel className='w-[450px] h-[300px]' value={value} index={2}>
                            <FollowUpHistory leadId={lid} productId={pid} />
                        </CustomTabPanel>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewProfile