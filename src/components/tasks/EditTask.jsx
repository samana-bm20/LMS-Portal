import React, { useState, useEffect } from 'react'
import {
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
    TextField, InputLabel, Select, MenuItem, FormControl, Autocomplete, useTheme, alpha
} from '@mui/material'
import { useDetails } from '../../providers/DetailsProvider'
import Config from '../../Config'
import axios from 'axios'

const EditTask = ({ openEditTask, setOpenEditTask, tid }) => {
    const { loggedUser, userValues, taskData, fetchTasks } = useDetails();
    const user = userValues.filter((user) => user.username === loggedUser)
    const uid = user[0]?.UID;
    const [assignedTo, setAssignedTo] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [taskDate, setTaskDate] = useState('');
    let selectedTask;
    const [editTaskData, setEditTaskData] = useState({
        editedBy: '',
        taskDate: '',
        UID: '',
        taskStatus: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    //#region Fetch Data
    const getSelectedTask = () => {
        if (tid) {
            selectedTask = taskData.filter(task => task.TID === tid);
            setAssignedTo(selectedTask[0].UID);
            setTaskStatus(selectedTask[0].taskStatus);
            const formattedDate = new Date(selectedTask[0].taskDate).toISOString().slice(0, 16);
            setTaskDate(formattedDate);
            setEditTaskData((prev) => ({
                ...prev,
                taskDate: formattedDate,
                UID: selectedTask[0].UID,
                taskStatus: selectedTask[0].taskStatus,
                editedBy: uid,
            }));
        }
    }

    useEffect(() => {
        getSelectedTask();
    }, [tid, uid]);

    //#region Field Change
    const handleEditTaskChange = (e) => {
        const { name, value } = e.target;
        if (name === 'UID') {
            setAssignedTo(value);
        }
        if (name === 'taskStatus') {
            setTaskStatus(value);
        }
        if (name === 'taskDate') {
            setTaskDate(value);
        }
        setEditTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditTask = async () => {
        if (!editTaskData.taskDate || !editTaskData.UID || !editTaskData.taskStatus) {
            setErrorMessage('Required fields cannot be empty.')
            setError(true);
            return;
        }
        try {
            const _ = await axios.put(`${Config.apiUrl}/editTask/${tid}`, editTaskData);
            setOpenEditTask(false);
            fetchTasks();
            getSelectedTask();
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

    const closeEditTask = () => {
        setOpenEditTask(false);
        getSelectedTask();
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
                open={openEditTask}
                onClose={closeEditTask}
            >
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <Paper elevation={3} className="p-4 rounded-lg shadow-md" component="form" >
                        <div className="grid grid-cols-1 gap-2">
                            <div className="mb-2">
                                <TextField
                                    required
                                    name='taskDate'
                                    id="outlined-required"
                                    label="Task Date"
                                    size='small'
                                    type="datetime-local"
                                    value={taskDate}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleEditTaskChange}
                                    fullWidth
                                />
                            </div>

                            <div className="mb-2">
                                <FormControl required fullWidth>
                                    <InputLabel id="demo-simple-select-label">Assigned To</InputLabel>
                                    <Select
                                        name='UID'
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Assigned To"
                                        value={assignedTo}
                                        onChange={handleEditTaskChange}
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
                                        onChange={handleEditTaskChange}
                                        size='small'
                                    >
                                        <MenuItem value="To Do">To Do</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Done">Done</MenuItem>

                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <div className='m-4'>
                        <Button onClick={closeEditTask}>Cancel</Button>
                        <Button variant='contained' onClick={handleEditTask}>Update</Button>
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
                    Task updated successfully!
                </Alert>
            </Snackbar>
        </>
    )
}

export default EditTask