import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Paper, Box, Divider, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import Config from '../../Config';
import axios from 'axios';

const LeadDetails = ({ leadId }) => {
  // if (!details) return <Typography>Loading...</Typography>;
  const theme = useTheme();
  const [leads, setLeads] = useState('All');
  const [data, setData] = useState([]);
  const [currentLead, setCurrentLead] = useState({});
  let currentLeadData;
  const fetchLeadsData = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}/leadDetails`);
      // const response = await axios.get(`http://127.0.0.1:3000/leadDetails`);
      const leadData = response.data
      setData(leadData)

      setLeads(leadId)
      currentLeadData = leadData.filter(lead => lead.LID === leadId)

      // console.log('current lead data is ', currentLeadData[0]);
      let cData = currentLeadData[0];
      setCurrentLead(cData)
      // console.log('lead data ', response.data)

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchLeadsData();
    // console.log('USe state currentLead',currentLead)
  }, [leadId]);

  return (
    <Paper elevation={3} className="p-2">
      <div
        className="text-center rounded-md py-2 w-full"
        style={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText
        }}
      >
        <p className="text-lg">Lead Details</p>
      </div>

      <Box className="overflow-y-auto p-4">
        <div className="flex">
          <span className="font-semibold text-sm mr-2">LID: </span>
          <span className='text-sm'>{currentLead.LID}</span>
        </div>
        <div className="flex">
          <span className="font-semibold text-sm mr-2">Name:</span>
          <span className='text-sm bg-pink-400 rounded-lg uppercase px-2'>{currentLead.name}</span>
        </div>

        <div className="flex">
          <span className="font-semibold text-sm mr-2">Contact:</span>
          <span className='text-sm'>{currentLead?.contact?.mobileNo || 'N/A'}</span>
        </div>
        <div className="flex">
          <span className="font-semibold text-sm mr-2">Email:</span>
          <span className='text-sm'>{currentLead?.contact?.emailID || 'N/A'}</span>
        </div>
        <div className="flex">
          <span className="font-semibold text-sm mr-2">Organization:</span>
          <span className='text-sm'>{currentLead.organizationName}</span>
          {/* bg-orange-500 rounded-lg px-2 */}
        </div>
        <div className="flex">
          <span className="font-semibold text-sm mr-2">Designation/Dept.:</span>
          <span className='text-sm'>{currentLead?.designationDept || 'N/A'}</span>
        </div>
        <div className="col-span-2 flex">
          <span className="font-semibold text-sm mr-2">Address:</span>
          <span className='text-sm'>{currentLead.address}</span>
        </div>

      </Box>
    </Paper>

    // <Paper elevation={3} className='p-2'>
    //   <Typography variant="h6" gutterBottom
    //     sx={{
    //       backgroundColor: '#0245A3',
    //       color: 'white',
    //       textAlign: 'center',
    //       padding: '2px 0',
    //       width:'500px'
    //     }}>
    //     Lead Details
    //   </Typography>

    //   <Box
    //     sx={{
    //       height: '300px', 
    //       overflowY: 'auto',
    //       paddingTop:'35px',
    //       width:'480px'
    //     }}
    //   >
    //     <Grid container spacing={2}>
    //       <Grid item xs={12} sm={6}>
    //         <Typography variant="body1">
    //           <strong>ID : </strong> {currentLead.LID}
    //         </Typography>
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <Typography variant="body1">
    //           <strong>Name : </strong>{currentLead.name}
    //         </Typography>
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <Typography variant="body1">
    //           <strong>Contact : </strong>{currentLead?.contact?.mobileNo || 'N/A'}
    //         </Typography>
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <Typography variant="body1">
    //           <strong>Email : </strong>{currentLead?.contact?.emailID || 'N/A'}
    //         </Typography>
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <Typography variant="body1">
    //           <strong>Status : </strong>Active
    //         </Typography>
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <Typography variant="body1">
    //           <strong>Department/Designation : </strong> {currentLead?.designationDept || 'N/A'}
    //         </Typography>
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <Typography variant="body1">
    //           <strong>Organization : </strong>{currentLead.organizationName}
    //         </Typography>
    //       </Grid>
    //       <Grid item xs={12} sm={6}>
    //         <Typography variant="body1">
    //           <strong>Address : </strong>{currentLead.address}
    //         </Typography>
    //       </Grid>
    //     </Grid>
    //   </Box>
    // </Paper>
  );
};

LeadDetails.propTypes = {
  details: PropTypes.object,
};

export default LeadDetails;
