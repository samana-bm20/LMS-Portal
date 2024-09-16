import React, { useState, useEffect } from 'react'
import {
    PersonRounded, RotateLeftRounded, PendingOutlined, CheckCircleOutlineRounded,
    EditRounded, CalendarMonthRounded, TaskRounded, AlarmRounded, CircleNotificationsRounded
} from '@mui/icons-material'
import { Divider, useTheme, alpha, IconButton } from '@mui/material'
import { useDetails } from '../../providers/DetailsProvider'
import EditTask from './EditTask'

const TaskCards = () => {
    const theme = useTheme();
    const { taskData, userValues, loggedUser } = useDetails();
    const user = userValues.filter((user) => user.username == loggedUser);
    const [taskID, setTaskID] = useState();
    const [openEditTask, setOpenEditTask] = useState(false);

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };

    const handleEditTask = (tid) => {
        setTaskID(tid);
        setOpenEditTask(true);
    }

    const filteredTaskData = user[0]?.userType === 2 ?
        taskData.filter((task) => task.UID == user[0]?.UID) : taskData

    return (
        <>
            <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1">
                {filteredTaskData.map(task => {
                    let statusIcon, statusColor, bgColor;

                    switch (task.taskStatus) {
                        case 'To Do':
                            statusIcon = <PendingOutlined fontSize='small' color='error' />;
                            statusColor = theme.palette.error.main;
                            bgColor = alpha(theme.palette.error.main, 0.1)
                            break;
                        case 'In Progress':
                            statusIcon = <RotateLeftRounded fontSize='small' color='info' />;
                            statusColor = theme.palette.info.main;
                            bgColor = alpha(theme.palette.info.main, 0.1)
                            break;
                        case 'Done':
                            statusIcon = <CheckCircleOutlineRounded fontSize='small' color='success' />;
                            statusColor = theme.palette.success.main;
                            bgColor = alpha(theme.palette.success.main, 0.1)
                            break;
                        default:
                            statusIcon = <TaskRounded fontSize='small' color='primary.contrastText' />;
                            statusColor = theme.palette.text.primary;
                            bgColor = alpha(theme.palette.text.primary, 0.1)
                            break;
                    }

                    return (
                        <div
                            key={task.TID}
                            className={`grid shadow-lg rounded-lg p-4 m-2`}
                            style={{ backgroundColor: alpha(theme.palette.background.card, 0.5) }}
                        >
                            <div className='flex justify-between items-center gap-4 mb-2'>
                                {/* <div
                                    className='p-1 rounded-lg text-xs'
                                    style={{ backgroundColor: alpha(theme.palette.background.header, 0.5) }}
                                >
                                    TID-{task.TID}
                                </div> */}

                                <div
                                    className='flex items-center p-1 rounded-lg'
                                    style={{ backgroundColor: bgColor }}
                                >
                                    {statusIcon}
                                    <div
                                        className=' pl-1 text-xs font-semibold'
                                        style={{ color: statusColor }}
                                    >
                                        {task.taskStatus}
                                    </div>
                                </div>
                                {(new Date(task.taskDate) < new Date() && task.taskStatus !== "Done") && (
                                    <div className='text-xs italic'
                                        style={{ color: theme.palette.error.light }}>missed!
                                    </div>
                                )}
                            </div>

                            <div className='text-xl font-semibold mb-2'>{task.title}</div>

                            <div className="flex-grow">
                                <div
                                    className="text-md mb-2"
                                    style={{ color: theme.palette.text.secondary }}
                                >
                                    <p>{task.description}</p>
                                </div>
                                {task.LID && task.PID && (
                                    <>
                                        <div
                                            className="inline-block p-1 rounded-lg text-sm font-semibold mb-2"
                                            style={{
                                                backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                                                color: theme.palette.secondary.main
                                            }}
                                        >
                                            <p>Lead: {task.lName}-{task.organization}</p>
                                        </div>
                                        <div
                                            className="inline-block p-1 rounded-lg text-sm font-semibold mb-2"
                                            style={{
                                                backgroundColor: alpha(theme.palette.warning.main, 0.2),
                                                color: theme.palette.warning.main
                                            }}
                                        >
                                            <p>Product: {task.pName}</p>
                                        </div>
                                    </>
                                )}

                                <div
                                    className="inline-flex px-1 gap-2 rounded-xl text-lg font-semibold"
                                    style={{ backgroundColor: alpha(theme.palette.background.header, 0.5) }}
                                >
                                    <CalendarMonthRounded />
                                    <p>{new Date(task.taskDate).toLocaleDateString('en-GB', dateOptions).replace(/ /g, '-')} at {new Date(task.taskDate).toLocaleTimeString([], timeOptions)}</p>
                                </div>
                                {/* Display Edit History */}
                                <div className="text-xs italic mb-2 ml-8">
                                    {task.edits && (() => {
                                        const previousDates = task.edits
                                            .filter(edit => edit.previousDate)
                                            .map(edit => new Date(edit.previousDate));

                                        if (previousDates.length > 0) {
                                            const oldestDate = new Date(Math.min(...previousDates));

                                            // Display the oldest previousDate
                                            return <p style={{ color: theme.palette.text.secondary }}
                                            >Original date: {oldestDate.toLocaleDateString('en-GB', dateOptions).replace(/ /g, '-')} at {oldestDate.toLocaleTimeString([], timeOptions)}</p>;
                                        }

                                        return null;
                                    })()}
                                </div>

                                {/* Display Reminders by Ambika*/}
                                {task.reminder && task.reminder.length > 0 && (
                                    <div className="m-2">
                                        <div
                                            className='flex items-center rounded-lg'>
                                            <CircleNotificationsRounded fontSize='small' color='info' />
                                            <div
                                                className='text-xs font-semibold pl-1'
                                                style={{ color: theme.palette.info.main }}
                                            >
                                                Reminder(s)
                                            </div>
                                        </div>
                                        {task.reminder.map((rem, index) => (
                                            <div
                                                key={index}
                                                className=" pl-6 text-xs italic"
                                                style={{ color: theme.palette.info.main }}
                                            >
                                                {rem.notificationTypes.join(', ')} {rem.frequencyValue} {rem.frequencyUnit} before
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className=''>

                                </div>
                            </div>
                            <Divider />

                            <div
                                className='flex justify-between gap-2 items-center p-1 rounded-lg mt-2'
                            >
                                <div
                                    className='flex items-center p-1 rounded-lg'>
                                    <PersonRounded fontSize='small' color='primary' />
                                    <div
                                        className='text-xs font-semibold pl-1'
                                        style={{ color: theme.palette.primary.main }}
                                    >
                                        {task.uName}
                                    </div>
                                </div>
                                <IconButton aria-label="edit" size="small" onClick={() => handleEditTask(task.TID)}>
                                    <EditRounded fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>
                    );
                })}
            </div>
            <EditTask
                openEditTask={openEditTask}
                setOpenEditTask={setOpenEditTask}
                tid={taskID}
            />
        </>
    )
}

export default TaskCards