import React from 'react'
import { Button, Accordion, AccordionActions, AccordionDetails, AccordionSummary } from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material'
import CardSummary from '../components/dashboard/CardSummary';
import TodayTasks from '../components/dashboard/TodayTasks';

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
            Today's Tasks
          </AccordionSummary>
          <AccordionDetails>
            <TodayTasks />
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas deserunt ipsum animi nobis tempore libero autem, atque repellat quasi porro architecto. Molestiae esse deserunt soluta consectetur aliquid maxime unde veniam. Ea inventore minus minima corrupti ut, odio, optio sunt quos dignissimos exercitationem quidem vel obcaecati assumenda eveniet est et magnam?
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  )
}

export default Dashboard;