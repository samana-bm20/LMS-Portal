import React from 'react'
import { Button } from '@mui/material';
import CardSummary from '../components/dashboard/CardSummary';

const Dashboard = () => {
  return (
    <div> 
     <div className="container mx-auto p-2 mb-2">
      <CardSummary />
     </div>
      {/* <Button variant='contained'>this is a button</Button> */}
    </div>
  )
}

export default Dashboard;