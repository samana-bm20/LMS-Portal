import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemIcon, ListItemText, TextField, Button, List, ListItem, IconButton } from '@mui/material';
import { CancelRounded } from '@mui/icons-material';
import { useTheme } from '@mui/material';

const SetReminder = ({ reminders, setReminders }) => {
    const theme = useTheme();
    const [notificationTypes, setNotificationTypes] = useState({});
    const [frequencyValue, setFrequencyValue] = useState('0');
    const [frequencyUnit, setFrequencyUnit] = useState('');

    const notificationOptions = [
        { label: 'Email', value: 'Email' },
        { label: 'WhatsApp', value: 'WhatsApp' },
    ];

    const handleNotificationTypeChange = (event) => {
        const { value } = event.target;
        const selectedOptions = typeof value === 'string' ? value.split(',') : value;
        const newNotificationTypes = selectedOptions.reduce((acc, option) => {
            acc[option] = true;
            return acc;
        }, {});
        setNotificationTypes(newNotificationTypes);
    };

    const handleAddReminder = () => {
        if (Object.keys(notificationTypes).length === 0 || !frequencyValue || !frequencyUnit) {
            return;
        }
        const newReminder = {
            notificationTypes: Object.keys(notificationTypes).filter((type) => notificationTypes[type]),
            frequencyValue,
            frequencyUnit,
        };

        setReminders([...reminders, newReminder]);

        // Reset fields
        setNotificationTypes({});
        setFrequencyValue('');
        setFrequencyUnit('');
    };

    const handleRemoveReminder = (index) => {
        const newReminders = [...reminders];
        newReminders.splice(index, 1);
        setReminders(newReminders);
    };

    return (
        <div className="mt-4">
            <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="notification-type-label">Notification Type</InputLabel>
                <Select
                    labelId="notification-type-label"
                    id="notification-type-select"
                    multiple
                    value={Object.keys(notificationTypes).filter((type) => notificationTypes[type])}
                    onChange={handleNotificationTypeChange}
                    renderValue={(selected) => selected.join(', ')}
                    label="Notification Type"

                >

                    {notificationOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value} sx={{ p: 0 }}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={notificationTypes[option.value] || false}
                                    onChange={(event) => {
                                        const newNotificationTypes = { ...notificationTypes };
                                        newNotificationTypes[option.value] = event.target.checked;
                                        setNotificationTypes(newNotificationTypes);
                                    }}
                                    name={option.value}
                                />
                            </ListItemIcon>
                            <ListItemText primary={option.label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <div className="flex items-center gap-2 mt-4">
                <TextField
                    type="text"
                    label="Frequency Value"
                    variant="outlined"
                    size="small"
                    value={frequencyValue}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {  //allow only 0-9 digits
                            setFrequencyValue(value);
                        }
                    }}
                />
                <FormControl variant="outlined" size="small" style={{ flex: 1 }}>
                    <InputLabel id="frequency-unit-label">Frequency Unit</InputLabel>
                    <Select
                        name="frequencyUnit"
                        labelId="frequency-unit-label"
                        id="frequency-unit-select"
                        label="Frequency Unit"
                        value={frequencyUnit}
                        onChange={(e) => setFrequencyUnit(e.target.value)}
                    >
                        <MenuItem value="Minutes">Minute(s)</MenuItem>
                        <MenuItem value="Hours">Hour(s)</MenuItem>
                        <MenuItem value="Days">Day(s)</MenuItem>
                        <MenuItem value="Weeks">Week(s)</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '10px' }}
                onClick={handleAddReminder}
            >
                Add Reminder
            </Button>

            {reminders.length > 0 && (
                <ul className="mt-2">
                    {reminders.map((reminder, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between p-2"
                        >
                            <div className="flex-1">
                                <p className="text-sm font-medium" style={{ color: theme.palette.text.primary }}>
                                    {reminder.notificationTypes.join(', ')} {/* Primary text */}
                                </p>
                                <p className="text-xs italic" style={{ color: theme.palette.text.secondary }}>
                                    Reminder to be sent: {reminder.frequencyValue} {reminder.frequencyUnit} before {/* Secondary text */}
                                </p>
                            </div>
                            <CancelRounded
                                aria-label="cancel"
                                color='error'
                                fontSize='small'
                                onClick={() => handleRemoveReminder(index)}
                                sx={{ cursor: 'pointer' }}
                            />
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default SetReminder;
