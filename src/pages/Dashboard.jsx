import React from 'react'
import { Button, Accordion, AccordionActions, AccordionDetails, AccordionSummary } from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material'
import CardSummary from '../components/dashboard/CardSummary';
import TodayTasks from '../components/dashboard/TodayTasks';
import TodayReminders from '../components/dashboard/TodayReminders';

const Dashboard = () => {
  return (
    <div className='overflow-y-auto scrollbar-thin'>
      <div className="container mx-auto p-2 mb-2">
        <CardSummary />
      </div>
      <div className="container mx-auto p-2 m-2">
        <Accordion defaultExpanded>
          <AccordionSummary
            className='font-semibold text-lg'
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '5px',
            }}
            expandIcon={<ExpandMoreRounded sx={{ color: 'primary.contrastText' }} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Tasks
          </AccordionSummary>
          <AccordionDetails>
            <TodayTasks />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary
            className='font-semibold text-lg'
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '5px',
            }}
            expandIcon={<ExpandMoreRounded sx={{ color: 'primary.contrastText' }} />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            Reminders
          </AccordionSummary>
          <AccordionDetails>
            <TodayReminders />
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  )
}

export default Dashboard;