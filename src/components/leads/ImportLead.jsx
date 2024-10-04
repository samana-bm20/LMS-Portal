import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box,
    Snackbar, Alert, useTheme, alpha
} from '@mui/material';
import { CloseRounded, CloudUploadRounded, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Config } from '../../Config';
import axios from 'axios';
import ExcelTemplate from './ExcelTemplate';
import { useFetchLeads } from '../../providers/FetchLeadsProvider';

const ImportLead = ({ openImportLead, setOpenImportLead }) => {
    const theme = useTheme();
    const token = sessionStorage.getItem('token');
    const { fetchLeadsData } = useFetchLeads();
    const [selectedFile, setSelectedFile] = useState(null);
    const [iconOpacity, setIconOpacity] = useState(0.5);  // Initial opacity set to 50%
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [info, setInfo] = useState(false);
    const [warning, setWarning] = useState(false);
    const [error, setError] = useState(false);
    const [reportFilePath, setReportFilePath] = useState(null);

    useEffect(() => {
        if (openImportLead) {
            setSelectedFile(null);
            setIconOpacity(0.5);
        }
    }, [openImportLead]);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setIconOpacity(1);
        }
    };

    const handleImportLead = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await axios.post(`${Config.apiUrl}/importLead`, formData, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log(response); // Debug log to check the response structure

                const { successfulInserts, duplicateCount, reportFilePath, message } = response.data;

                switch (response.status) {
                    case 201: // All leads imported successfully
                        setSuccess(true);
                        setSnackbarMessage(message);
                        fetchLeadsData();
                        setOpenImportLead(false);
                        break;

                    case 208: // All leads are duplicates
                        setWarning(true);
                        setSnackbarMessage(message);
                        if (reportFilePath) {
                            setReportFilePath(`${Config.apiUrl}${reportFilePath}`);
                        }
                        setOpenImportLead(false);
                        break;

                    case 207: // Some leads imported, some are duplicates
                        setInfo(true);
                        setSnackbarMessage(message);
                        if (reportFilePath) {
                            setReportFilePath(`${Config.apiUrl}${reportFilePath}`);
                        }
                        fetchLeadsData();
                        setOpenImportLead(false);
                        break;

                    case 400: // No leads to import or invalid file
                        setError(true);
                        setSnackbarMessage(message);
                        setOpenImportLead(false);
                        break;

                    default:
                        setError(true);
                        setSnackbarMessage('Unexpected status code received.');
                        setOpenImportLead(false);
                        break;
                }
            } catch (error) {
                // Handle network or other unexpected errors
                console.error('Error during import:', error);
                setError(true);
                setSnackbarMessage(error.response?.data?.message || 'An unexpected error occurred.');
                setOpenImportLead(false);
            }
        }
    };

    const closeImportLead = () => {
        setOpenImportLead(false);
    };

    const successClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccess(false);
    };

    const infoClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setInfo(false);
    };

    const warningClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setWarning(false);
    };

    const errorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(false);
    };

    return (
        <div>
            <Dialog
                open={openImportLead}
                onClose={closeImportLead}
            >
                <div className='flex justify-between items-center gap-4 mr-2'>
                    <DialogTitle>Import Lead</DialogTitle>
                    <IconButton aria-label="close" color="primary" onClick={closeImportLead}>
                        <CloseRounded fontSize="inherit" />
                    </IconButton>
                </div>
                <DialogContent>
                    <Box>
                        <Box className='flex flex-col items-center mb-4'>
                            <div className='mb-2'>
                                <ExcelTemplate />
                            </div>
                            <p className='text-xs italic mb-1 w-[200px] text-center' style={{ color: theme.palette.error.light }}>
                                * add the appropriate value in columns having dropdown options
                            </p>
                        </Box>
                        <Box
                            className="flex flex-col items-center justify-center px-14 py-8 border-2 border-dashed rounded-lg cursor-pointer"
                            sx={{ borderColor: theme.palette.primary.main, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            <input
                                id="file-input"
                                type="file"
                                accept=".csv, .xlsx, .xls"
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                            />
                            <CloudUploadRounded color='primary' sx={{ fontSize: 50, opacity: iconOpacity }} />
                            <div className='text-lg text-center'
                                style={{ color: theme.palette.primary.main }}>
                                click here to upload your file
                            </div>
                            <div className='text-xs italic text-center'
                                style={{ color: theme.palette.error.light }}>
                                (.csv/.xlsx/.xls) files only
                            </div>
                            {selectedFile && (
                                <div className='text-md font-semibold mt-2 text-center' style={{ color: theme.palette.primary.main }}>
                                    {selectedFile.name}
                                </div>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <div className='m-4'>
                        <Button onClick={closeImportLead}>Cancel</Button>
                        <Button variant="contained" color="primary"
                            onClick={handleImportLead} disabled={!selectedFile}
                        >
                            Import
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={success}
                autoHideDuration={3000}
                onClose={successClose}>
                <Alert onClose={successClose} severity="success" variant='filled'>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={info}
                autoHideDuration={6000}
                onClose={infoClose}
            >
                <Alert
                    onClose={infoClose}
                    severity="info"
                    variant='filled'
                    sx={{ width: '100%' }}
                    action={
                        reportFilePath && (
                            <Button
                                color="inherit"
                                size="small"
                                onClick={() => window.open(reportFilePath, '_blank')}
                                style={{ textTransform: 'none', textDecorationLine: 'underline' }}
                            >
                                Download Report
                            </Button>
                        )
                    }
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={warning}
                autoHideDuration={6000}
                onClose={warningClose}
            >
                <Alert
                    onClose={warningClose}
                    severity="warning"
                    variant='filled'
                    sx={{ width: '100%' }}
                    action={
                        reportFilePath && (
                            <Button
                                color="inherit"
                                size="small"
                                onClick={() => window.open(reportFilePath, '_blank')}
                                style={{ textTransform: 'none', textDecorationLine: 'underline' }}
                            >
                                Download Report
                            </Button>
                        )
                    }
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={error}
                autoHideDuration={3000}
                onClose={errorClose}>
                <Alert onClose={errorClose} severity="error" variant='filled'>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ImportLead;