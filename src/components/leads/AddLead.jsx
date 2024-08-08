import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Box, Tabs, Tab, TextField, alpha, useTheme } from '@mui/material'

function CustomTabPanel(props) {
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

const AddLead = ({ handleLeadDataChange }) => {
    const theme = useTheme();
    const primaryColorWithOpacity = alpha(theme.palette.primary.main, 0.1); // Adjust opacity as needed
    const [value, setValue] = useState(0);
    const [leadID, setLeadID] = useState('');
    const [newLeadData, setNewLeadData] = useState({
        LID: '',
        name: '',
        designationDept: '',
        organizationName: '',
        contact: {
            mobileNo: '',
            emailID: ''
        },
        address: '',
        product: '',
        status: '',
        source: '',
        assignedTo: ''
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        handleLeadDataChange(newLeadData);
    }, [newLeadData, handleLeadDataChange]);

    const handleNewLeadChange = (e) => {
        const { name, value } = e.target;
        setNewLeadData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNestedChange = (e) => {
        const { name, value } = e.target;
        setNewLeadData(prev => ({
            ...prev,
            contact: {
                ...prev.contact,
                [name]: value
            }
        }));
    };

    return (
        <Box sx={{ width: '100%' }}>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="New Lead" {...a11yProps(0)} />
                    <Tab label="Existing Lead" {...a11yProps(1)} />
                </Tabs>
            </Box>

            <CustomTabPanel value={value} index={0}>
                <Box className="p-4 rounded-lg shadow-md" component="form"
                    sx={{backgroundColor: primaryColorWithOpacity} }>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="mb-2">
                            <TextField
                                required
                                name='LID'
                                id="outlined-required"
                                label="LID"
                                size='small'
                                onChange={handleNewLeadChange}
                            />
                        </div>
                        <div className="mb-2">
                            <TextField
                                required
                                name='name'
                                id="outlined-required"
                                label="Lead Name"
                                size='small'
                                onChange={handleNewLeadChange}
                            />
                        </div>
                        <div className="mb-2">
                            <TextField
                                name='mobileNo'
                                id="outlined"
                                label="Contact"
                                size='small'
                                onChange={handleNestedChange}
                            />
                        </div>
                        <div className="mb-2">
                            <TextField
                                name='emailID'
                                id="outlined"
                                label="Email ID"
                                size='small'
                                onChange={handleNestedChange}
                            />
                        </div>
                        <div className="mb-2">
                            <TextField
                                name='designationDept'
                                id="outlined"
                                label="Designation/Dept."
                                size='small'
                                onChange={handleNewLeadChange}
                            />
                        </div>
                        <div className="mb-2">
                            <TextField
                                required
                                name='organizationName'
                                id="outlined-required"
                                label="Organization"
                                size='small'
                                onChange={handleNewLeadChange}
                            />
                        </div>
                    </div>
                    <div className='mt-2 mb-4'>
                        <TextField
                            name='address'
                            id="outlined"
                            label="Address"
                            fullWidth
                            onChange={handleNewLeadChange}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="mb-2">
                            <TextField
                                required
                                name='product'
                                id="outlined-required"
                                label="Product"
                                size='small'
                                onChange={handleNewLeadChange}
                            />
                        </div>
                        <div className="mb-2">
                            <TextField
                                required
                                name='status'
                                id="outlined-required"
                                label="Status"
                                size='small'
                                onChange={handleNewLeadChange}
                            />
                        </div>
                        <div className="mb-2">
                            <TextField
                                required
                                name='source'
                                id="outlined-required"
                                label="Source"
                                size='small'
                                onChange={handleNewLeadChange}
                            />
                        </div>
                        <div className="mb-2">
                            <TextField
                                required
                                name='assignedTo'
                                id="outlined-required"
                                label="Assigned To"
                                size='small'
                                onChange={handleNewLeadChange}
                            />
                        </div>
                    </div>
                </Box>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
                Existing Lead
            </CustomTabPanel>
        </Box>
    );
}

export default AddLead;