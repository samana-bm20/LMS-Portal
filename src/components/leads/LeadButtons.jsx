import React, { useState, useCallback } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material'
import { AddCircleRounded, FileUploadRounded, FileDownloadRounded } from '@mui/icons-material'
import AddLead from './AddLead'
import Config from '../../Config';
import axios from 'axios';

const LeadButtons = () => {
    const [openAddLeadDialog, setOpenAddLeadDialog] = useState(false);
    const [addLeadData, setAddLeadData] = useState([]);
    const [addLeadError, setAddLeadError] = useState(false);

    const openAddLead = () => {
        setOpenAddLeadDialog(true);
    }

    const closeAddLead = () => {
        setOpenAddLeadDialog(false);
    }

    const handleLeadDataChange = useCallback((data) => {
        setAddLeadData(data);
    }, []);

    const handleAddLead = async () => {
        if (!addLeadData.name || !addLeadData.organizationName || !addLeadData.product ||
            !addLeadData.status || !addLeadData.source || !addLeadData.assignedTo) {
                setAddLeadError(true);
                return;
            } 
            try {
                const response = await axios.post(`${Config.apiUrl}/addLead`, addLeadData);
                console.log(response.status);
                setOpenAddLeadDialog(false);
            } catch (error) {
                
            }
    };

    const addLeadErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setAddLeadError(false);
      };
    

    return (
        <div className="flex flex-col md:flex-row justify-end space-x-reverse p-2 m-1 ">
            {/* Add Lead */}
            <Button
                sx={{ m: '5px' }}
                variant="contained"
                startIcon={<AddCircleRounded />}
                onClick={openAddLead}
            >
                Add Lead
            </Button>
            <Dialog
                open={openAddLeadDialog}
                onClose={closeAddLead}
            >
                <DialogTitle>Add Lead</DialogTitle>
                <DialogContent>
                    <AddLead handleLeadDataChange={handleLeadDataChange} />
                </DialogContent>
                <DialogActions>
                    <div className='m-4'>
                        <Button onClick={closeAddLead}>Cancel</Button>
                        <Button variant='contained' onClick={handleAddLead}>Submit</Button>
                    </div>
                </DialogActions>
            </Dialog>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={addLeadError}
                autoHideDuration={2000}
                onClose={addLeadErrorClose}>
                <Alert onClose={addLeadErrorClose} severity="error" variant='filled'>
                    Required fields cannot be empty
                </Alert>
            </Snackbar>
            {/* Import Lead */}
            <Button
                sx={{ m: '5px' }}
                variant="contained"
                startIcon={<FileUploadRounded />}
            >
                Import Lead
            </Button>

            {/* Export Lead */}
            <Button
                sx={{ m: '5px' }}
                variant="contained"
                startIcon={<FileDownloadRounded />}
            >
                Export Lead
            </Button>
        </div>
    )
}

export default LeadButtons