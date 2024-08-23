import React, { useEffect, useState } from 'react'
import {
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
    TextField, InputLabel, Select, MenuItem, FormControl, Autocomplete
} from '@mui/material'
import { useDetails } from '../../providers/DetailsProvider';
import { useFetchLeads } from '../../providers/FetchLeadsProvider';
import Config from '../../Config';
import axios from 'axios';

const AddTask = ({ openAddTask, setOpenAddTask }) => {
    const { loggedUser, userValues, fetchTasks } = useDetails();
    const user = userValues.filter((user) => user.username === loggedUser)
    let uid = user[0]?.UID
    const { data } = useFetchLeads();
    const [assignedTo, setAssignedTo] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [addTaskData, setAddTaskData] = useState({
        taskDate: '',
        title: '',
        description: '',
        createdBy: '',
        UID: '',
        taskStatus: '',
        LID: null,
        PID: null,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    
    useEffect(() => {
        const getCreatedBy = () => {
            setAddTaskData((prev) => ({...prev, createdBy: uid}))
        }
        getCreatedBy();
    }, [uid]);

    //#region Field Change
    const handleAddTaskChange = (e) => {
        const { name, value } = e.target;
        if (name === 'UID') {
            setAssignedTo(value);
        }
        if (name === 'taskStatus') {
            setTaskStatus(value);
        }
        setAddTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLeadChange = (event, value) => {
        if (value) {
            setAddTaskData((prev) => ({
                ...prev,
                LID: value.LID,
                PID: value.productDetails.PID
            }));
        } else {
            setAddTaskData((prev) => ({
                ...prev,
                LID: null,
                PID: null
            }));
        }
    }

    //#region Add Task
    const handleAddTask = async () => {
        if (!addTaskData.taskDate || !addTaskData.title || !addTaskData.description ||
            !addTaskData.UID || !addTaskData.taskStatus) {
            setErrorMessage('Required fields cannot be empty.')
            setError(true);
            return;
        }
        try {
            const _ = await axios.post(`${Config.apiUrl}/addTask`, addTaskData);
            setOpenAddTask(false);
            fetchTasks();
            setAssignedTo('');
            setTaskStatus('');
            setAddTaskData((prev) => ({
                ...prev,
                LID: null,
                PID: null
            }));
            setSuccess(true);
            setErrorMessage('');
        } catch (error) {
            if (error.response && error.response.data) {
                setError(true);
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        }
    };

    const closeAddTask = () => {
        setOpenAddTask(false);
        setAssignedTo('');
        setTaskStatus('');
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
                open={openAddTask}
                onClose={closeAddTask}
            >
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>
                    <Paper elevation={3} className="p-4 rounded-lg shadow-md" component="form" >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="mb-2">
                                <TextField
                                    required
                                    name='taskDate'
                                    id="outlined-required"
                                    label="Task Date"
                                    size='small'
                                    type="datetime-local"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleAddTaskChange}
                                    fullWidth
                                />
                            </div>
                            <div className="mb-2">
                                <TextField
                                    required
                                    name='title'
                                    id="outlined-required"
                                    label="Title"
                                    size='small'
                                    onChange={handleAddTaskChange}
                                />
                            </div>
                        </div>
                        <div className='mt-2 mb-4'>
                            <TextField
                                required
                                name='description'
                                id="outlined"
                                label="Description"
                                fullWidth
                                multiline
                                onChange={handleAddTaskChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="mb-2">
                                <FormControl required fullWidth>
                                    <InputLabel id="demo-simple-select-label">Assigned To</InputLabel>
                                    <Select
                                        name='UID'
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Assigned To"
                                        value={assignedTo}
                                        onChange={handleAddTaskChange}
                                        size='small'
                                    >
                                        {userValues.map((user) => (
                                            <MenuItem key={user.UID} value={user.UID}>{user.uName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="mb-2">
                                <FormControl required fullWidth>
                                    <InputLabel id="demo-simple-select-label">Task Status</InputLabel>
                                    <Select
                                        name='taskStatus'
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Task Status"
                                        value={taskStatus}
                                        onChange={handleAddTaskChange}
                                        size='small'
                                    >
                                        <MenuItem value="To Do">To Do</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Done">Done</MenuItem>

                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <div className="mb-2 mt-2">
                            <Autocomplete
                                fullWidth
                                size="small"
                                options={data}
                                getOptionLabel={(option) => `${option.name}-${option.organizationName} (${option.productDetails.pName})`}
                                onChange={handleLeadChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Lead"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </div>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <div className='m-4'>
                        <Button onClick={closeAddTask}>Cancel</Button>
                        <Button variant='contained' onClick={handleAddTask}>Add</Button>
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
                    New task added successfully!
                </Alert>
            </Snackbar>
        </>
    )
}

export default AddTask