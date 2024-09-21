import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Paper, Box, Divider, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import Config from '../../Config';
import axios from 'axios';
import { useDetails } from '../../providers/DetailsProvider';

const LeadDetails = ({ leadId }) => {
  const { leadValues } = useDetails();
  const theme = useTheme();
  const [currentLead, setCurrentLead] = useState({});
  let currentLeadData;

  const fetchLeadsData = async () => {
    try {
      currentLeadData = leadValues.filter(lead => lead.LID === leadId)
      setCurrentLead(currentLeadData[0])
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeadsData();
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
  );
};

LeadDetails.propTypes = {
  details: PropTypes.object,
};

export default LeadDetails;
