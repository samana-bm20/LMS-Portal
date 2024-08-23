import React from 'react'
import { Paper, useTheme } from '@mui/material'
import UpcomingFollowUps from '../components/reminder/UpcomingFollowUps'
import MissedFollowUps from '../components/reminder/MissedFollowUps'

const Reminder = () => {
    const theme = useTheme();

    return (
        <>
            <Paper elevation={3} className='m-6 pb-2 max-h-[345px] overflow-y-auto scrollbar-thin'>
                <div
                    className="rounded-sm p-2 w-full"
                    style={{
                        backgroundColor: theme.palette.info.main,
                        color: theme.palette.primary.contrastText
                    }}
                >
                    <p className="text-lg">Upcoming Follow-Ups</p>
                </div>
                <UpcomingFollowUps />
            </Paper>
            <Paper elevation={3} className='m-6 pb-2 max-h-[345px] overflow-y-auto scrollbar-thin'>
                <div
                    className="rounded-sm p-2 w-full"
                    style={{
                        backgroundColor: theme.palette.error.main,
                        color: theme.palette.primary.contrastText
                    }}
                >
                    <p className="text-lg">Missed Follow-Ups</p>
                </div>
                <MissedFollowUps />
            </Paper>
        </>
    )
}

export default Reminder;