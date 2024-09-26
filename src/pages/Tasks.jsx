import React, { useState, useEffect } from 'react'
// import { io } from 'socket.io-client'
import { Button } from '@mui/material'
import { AddTaskRounded } from '@mui/icons-material'
// import { useDetails } from '../providers/DetailsProvider'

import AddTask from '../components/tasks/AddTask'
import TaskCards from '../components/tasks/TaskCards'

const Tasks = () => {
    // const {userValues, loggedUser} = useDetails();
    // const user = userValues.filter((user) => user.username == loggedUser);
    const [openAddTask, setOpenAddTask] = useState(false)

    // useEffect(() => {
    //     // Connect to Socket.IO server
    //     const socket = io('http://localhost:3000');

    //     // Join the user's room (based on their UID)
    //     socket.emit('joinRoom', user[0]?.UID);

    //     // Listen for new task notifications
    //     socket.on('taskNotification', (task) => {
    //       alert(`New task assigned: ${task.title}`);
    //       // You can also update the task list or UI here as needed
    //     });

    //     // Cleanup on component unmount
    //     return () => {
    //       socket.disconnect();
    //     };
    //   }, [user[0]?.UID]);


    return (
        <>
            <div className="flex flex-col md:flex-row justify-end space-x-reverse p-2 m-1 ">
                <Button
                    sx={{ m: '5px' }}
                    variant="contained"
                    startIcon={<AddTaskRounded />}
                    onClick={() => setOpenAddTask(true)}
                >
                    Add Task
                </Button>
            </div>
            <AddTask
                openAddTask={openAddTask}
                setOpenAddTask={setOpenAddTask}
            />
            <div className="container mx-auto p-2 m-2">
                <TaskCards />
            </div>

        </>
    )
}

export default Tasks