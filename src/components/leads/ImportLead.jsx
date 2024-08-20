import React, { useState } from 'react'
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
    TextField, InputLabel, Select, MenuItem, FormControl, Autocomplete, useTheme, alpha
} from '@mui/material'
import Config from '../../Config';
import axios from 'axios';

const ImportLead = ({ openImportLead, setOpenImportLead }) => {
    const theme = useTheme();
    const primaryColorWithOpacity = alpha(theme.palette.background.footer, 0.5);
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleImportLead = () => {
        try {
            console.log("Importing Leads");
            setOpenImportLead(false);
        } catch (error) {
            console.error(error)
        }
    }

    const closeImportLead = () => {
        setOpenImportLead(false);
    }

    // #region Snackbar
    const errorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(false);
    };

    const successClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccess(false);
    };

    return (
        <>
            <Dialog
                open={openImportLead}
                onClose={closeImportLead}
            >
                <DialogTitle>Import Lead</DialogTitle>
                <DialogContent>
                    Download Format from here
                </DialogContent>
                <DialogActions>
                    <div className='m-4'>
                        <Button onClick={closeImportLead}>Cancel</Button>
                        <Button variant='contained' onClick={handleImportLead}>Import</Button>
                    </div>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={error}
                autoHideDuration={2000}
                onClose={errorClose}>
                <Alert onClose={errorClose} severity="error" variant='filled'>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={success}
                autoHideDuration={2000}
                onClose={successClose}>
                <Alert onClose={successClose} severity="success" variant='filled'>
                    Leads imported successfully!
                </Alert>
            </Snackbar>
        </>)
}

export default ImportLead