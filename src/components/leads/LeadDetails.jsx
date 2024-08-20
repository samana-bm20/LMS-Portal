import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Grid, } from '@mui/material';
import PropTypes from 'prop-types';
import Config from '../../Config';
import axios from 'axios';

const LeadDetails = ({ leadId }) => {
  // if (!details) return <Typography>Loading...</Typography>;
  const [leads, setLeads] = useState('All');
  const [data, setData] = useState([]);
  const [currentLead, setCurrentLead] = useState({});
  let currentLeadData;
  const fetchLeadsData = async () => {
    try {
      debugger
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

    <Box >
      <Typography variant="h6" gutterBottom
        sx={{
          backgroundColor: '#0245A3',
          color: 'white',
          textAlign: 'center',
          padding: '2px 0',
          width:'500px'
        }}>
        Lead Details
      </Typography>

      <Box
        sx={{
          height: '300px', 
          overflowY: 'auto',
          paddingTop:'35px',
          width:'480px'
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>ID : </strong> {currentLead.LID}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Name : </strong>{currentLead.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Contact : </strong>{currentLead?.contact?.mobileNo || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Email : </strong>{currentLead?.contact?.emailID || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Status : </strong>Active
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Department/Designation : </strong> {currentLead?.designationDept || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Organization : </strong>{currentLead.organizationName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Address : </strong>{currentLead.address}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

LeadDetails.propTypes = {
  details: PropTypes.object,
};

export default LeadDetails;
