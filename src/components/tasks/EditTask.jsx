import React, { useState, useEffect } from 'react';
import {
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
    TextField, InputLabel, Select, MenuItem, FormControl, Checkbox, ListItemText, IconButton, useTheme
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import SetReminder from './SetRemainder';
import { useDetails } from '../../providers/DetailsProvider';
import Config from '../../Config';


const EditTask = ({ openEditTask, setOpenEditTask, tid }) => {
    const theme = useTheme();
    const { loggedUser, userValues, taskData, fetchTasks } = useDetails();
    const user = userValues.filter((user) => user.username === loggedUser);
    const uid = user[0]?.UID;
    const [assignedTo, setAssignedTo] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const [reminders, setReminders] = useState([]);
    const [showAddReminder, setShowAddReminder] = useState(false);
    let selectedTask;

    const [editTaskData, setEditTaskData] = useState({
        editedBy: '',
        taskDate: '',
        UID: '',
        taskStatus: '',
        reminders: []
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const notificationOptions = [
        { label: 'Email', value: 'Email' },
        { label: 'WhatsApp', value: 'WhatsApp' },
    ];

    // Fetch Task Data on Task ID Change
    const getSelectedTask = () => {
        if (tid) {
            selectedTask = taskData.filter(task => task.TID === tid);
            setAssignedTo(selectedTask[0].UID);
            setTaskStatus(selectedTask[0].taskStatus);
            const formattedDate = new Date(selectedTask[0].taskDate).toISOString().slice(0, 16);
            setTaskDate(formattedDate);
            setReminders(selectedTask[0].reminder || []);
            setEditTaskData((prev) => ({
                ...prev,
                taskDate: formattedDate,
                UID: selectedTask[0].UID,
                taskStatus: selectedTask[0].taskStatus,
                editedBy: uid,
                reminders: selectedTask.reminder || []
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
        if (name === 'reminders') {
            setReminders(value);
        }

        setEditTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //#region Reminder Changes
    const handleNotificationTypeChange = (e, index) => {
        const updatedReminders = [...reminders];
        updatedReminders[index].notificationTypes = e.target.value;
        setReminders(updatedReminders);
    };

    const handleFrequencyValueChange = (e, index) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { 
            const updatedReminders = [...reminders];
            updatedReminders[index].frequencyValue = value;
            setReminders(updatedReminders);
        }
    };

    const handleFrequencyUnitChange = (e, index) => {
        const updatedReminders = [...reminders];
        updatedReminders[index].frequencyUnit = e.target.value;
        setReminders(updatedReminders);
    };

    const handleDeleteReminder = (index) => {
        const updatedReminders = reminders.filter((_, i) => i !== index);
        setReminders(updatedReminders);
    };

    //#region Edit Task
    const handleEditTask = async () => {
        if (!editTaskData.taskDate || !editTaskData.UID || !editTaskData.taskStatus) {
            setErrorMessage('Required fields cannot be empty.')
            setError(true);
            return;
        }
        const taskWithUpdatedReminders = {
            ...editTaskData,
            reminders
        };
        try {
            await axios.put(`${Config.apiUrl}/editTask/${tid}`, taskWithUpdatedReminders);
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
        setReminders([]);
        setShowAddReminder(false);
        getSelectedTask();
        fetchTasks();
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
                    <Paper elevation={3} className="p-4 rounded-lg shadow-md md:w-[34rem]" component="form" >
                        <div className="grid grid-cols-1 gap-2">
                            <div className="mb-6">
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
                        </div>

                        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2">
                            <div className="mb-6">
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
                            <div className="mb-6">
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
                                        <MenuItem key="To Do" value="To Do">To Do</MenuItem>
                                        <MenuItem key="In Progress" value="In Progress">In Progress</MenuItem>
                                        <MenuItem key="Done" value="Done">Done</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        {reminders.length > 0 && (
                        <div key='remind' className="mb-4 pl-1">Reminder(s)</div>
                        )}

                        {reminders.length > 0 ? (
                            reminders.map((reminder, index) => (
                                <div key={index} className="grid md:grid-cols-3 sm:grid-cols-1 gap-2">
                                    <div className="mb-6">
                                        <FormControl variant="outlined" size="small" fullWidth>
                                            <InputLabel>Notification Type</InputLabel>
                                            <Select
                                                label="Notification Type"
                                                multiple
                                                value={reminder.notificationTypes || []}
                                                onChange={(e) => handleNotificationTypeChange(e, index)}
                                                renderValue={(selected) => selected.join(', ')}
                                            >
                                                {notificationOptions.map((option, index) => (
                                                    <MenuItem key={index} value={option.value}>
                                                        <Checkbox checked={reminder.notificationTypes?.includes(option.value)} />
                                                        <ListItemText primary={option.label} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className="mb-6">
                                        <FormControl variant="outlined" size="small" fullWidth>
                                            <TextField
                                                label="Frequency Value"
                                                variant="outlined"
                                                size="small"
                                                value={reminder.frequencyValue}
                                                onChange={(e) => handleFrequencyValueChange(e, index)}
                                                fullWidth
                                            />
                                        </FormControl>
                                    </div>

                                    <div className="flex mb-6">
                                        <FormControl variant="outlined" size="small" fullWidth>
                                            <InputLabel>Frequency Unit</InputLabel>
                                            <Select
                                                label="Frequency Unit"
                                                value={reminder.frequencyUnit}
                                                onChange={(e) => handleFrequencyUnitChange(e, index)}
                                            >
                                                <MenuItem key='min' value="Minutes">Minutes</MenuItem>
                                                <MenuItem key='hrs' value="Hours">Hours</MenuItem>
                                                <MenuItem key='days' value="Days">Days</MenuItem>
                                                <MenuItem key='weeks' value="Weeks">Weeks</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <IconButton color="error" onClick={() => handleDeleteReminder(index)}>
                                            <CancelIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <div className="px-2 mb-4 text-center italic text-sm" style={{color: theme.palette.text.secondary}}>
                                No reminder for this task
                            </div>
                        )}

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setShowAddReminder(prev => !prev)}
                        >
                            {showAddReminder ? 'Hide Reminder' : 'Set Reminder'}
                        </Button>

                        {showAddReminder && (
                            <SetReminder
                                reminders={reminders}
                                setReminders={setReminders}
                                add={false}
                            />
                        )}
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