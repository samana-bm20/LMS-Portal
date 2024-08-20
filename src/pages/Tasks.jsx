import React, { useState } from 'react'
import { Button } from '@mui/material'
import { AddTaskRounded } from '@mui/icons-material'

import AddTask from '../components/tasks/AddTask'
import TaskCards from '../components/tasks/TaskCards'

const Tasks = () => {
    const [openAddTask, setOpenAddTask] = useState(false)

    return (
        <>
            <div className="flex flex-col md:flex-row justify-end space-x-reverse p-2 m-1 ">
                {/* Add Lead */}
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