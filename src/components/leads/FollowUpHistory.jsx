import React, { useEffect, useState, useContext } from 'react';
import { Box, Paper, Tabs, Tab, useTheme } from '@mui/material';
import { useDetails } from '../../providers/DetailsProvider';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent
} from '@mui/lab';
import { CallRounded, MailRounded, SupervisorAccountRounded } from '@mui/icons-material';
import axios from 'axios';
import Config from '../../Config';

const FollowUpHistory = ({ leadId, productId }) => {
  const theme = useTheme();
  const [currentLeadProducts, setCurrentLeadProducts] = useState([]);
  const [followUpData, setFollowUpData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { followUpValues, statusValues, userValues, loggedUser } = useDetails();
  const user = userValues.filter((user) => user.username === loggedUser);

  //#region Formatting
  const sidToColor = {
    S1: theme.palette.text.disabled,
    S2: theme.palette.secondary.main,
    S3: theme.palette.warning.main,
    S4: theme.palette.success.main,
    S5: theme.palette.error.main,
  };

  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };
  const dateOptions = { day: '2-digit', month: 'short', year: '2-digit' };
  
  const statusMap = statusValues.reduce((map, status) => {
    map[status.SID] = status.sName;
    return map;
  }, {});

  const userMap = userValues.reduce((map, user) => {
    map[user.UID] = user.uName;
    return map;
  }, {});
  
  //#region Data
  const fetchLeadsData = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}/leadData/${user[0]?.UID}/All`);
      const data = Config.decryptData(response.data);
      setCurrentLeadProducts(data.filter(product => product.LID === leadId));
      setSelectedProduct(productId);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFollowUpData = async () => {
    try {
      const leadFollowUp = followUpValues
        .filter(followUp => followUp.LID === leadId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setFollowUpData(leadFollowUp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeadsData();
    fetchFollowUpData();
  }, [leadId, productId]);

  const productFollowUp = followUpData.filter(followUp => followUp.PID === selectedProduct);

  const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);
  };

  return (
    <Paper elevation={3} className="p-2 max-h-[250px] overflow-auto scrollbar-thin">
      {/* scrollbar-thumb-rounded scrollbar-thumb-gray-500 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-700 */}
      <div
        className="text-center rounded-md py-2 w-full"
        style={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText
        }}
      >
        <p className="text-lg">Follow-up History</p>
      </div>
      <Tabs
        value={selectedProduct}
        onChange={handleProductChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Product Tabs"
        sx={{ marginBottom: '16px' }}
      >
        {currentLeadProducts.map((product) => (
          <Tab key={product.productDetails.PID} label={product.productDetails.pName} value={product.productDetails.PID} />
        ))}
      </Tabs>
      <Box>
        {productFollowUp.length === 0 ? (
          <div className="text-center italic pb-10" style={{ color: theme.palette.text.secondary }}>
            No follow-up done yet
          </div>
        ) : (
          <Timeline sx={{ p: 0, overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {productFollowUp.map((followUp, index) => (
              <TimelineItem key={followUp.FID}>
                <TimelineOppositeContent sx={{ px: 1, maxWidth: 'fit-content' }}>
                  <div className='text-right font-semibold mt-4'>
                    <p className="text-xs">{new Date(followUp.date).toLocaleTimeString([], timeOptions)}</p>
                    <p className="text-sm">{new Date(followUp.date).toLocaleDateString('en-GB', dateOptions).replace(/ /g, '-')}</p>
                  </div>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot color="success" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ px: 1 }}>
                  <div className='grid w-full mb-2'>
                    {followUp.type == 'call' && (
                      <div className='flex items-center'>
                        <CallRounded fontSize='small' color='info' />
                        <div className='text-sm pl-1 font-semibold uppercase'
                          style={{ color: theme.palette.info.main }}>{followUp.type}</div>
                      </div>
                    )}
                    {followUp.type == 'email' && (
                      <div className='flex items-center'>
                        <MailRounded fontSize='small' color='info' />
                        <div className='text-sm pl-1 font-semibold uppercase'
                          style={{ color: theme.palette.info.main }}>{followUp.type}</div>
                      </div>
                    )}
                    {followUp.type == 'physical' && (
                      <div className='flex items-center'>
                        <SupervisorAccountRounded fontSize='small' color='info' />
                        <div className='text-sm pl-1 font-semibold uppercase mb-1'
                          style={{ color: theme.palette.info.main }}>{followUp.type}</div>
                      </div>
                    )}
                    <div className="flex">
                      <span className="text-xs italic mr-1"
                        style={{ color: theme.palette.text.secondary }}>Done By:</span>
                      <span className='text-xs italic mb-1'
                        style={{ color: theme.palette.text.secondary }}>{userMap[followUp.UID] || 'Unknown'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-xs mr-2">Status: </span>
                      <span className='text-xs px-1 rounded-xl mb-1'
                        style={{
                          backgroundColor: sidToColor[followUp.SID],
                          color: theme.palette.primary.contrastText
                        }}
                      >
                        {statusMap[followUp.SID] || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold text-xs mr-2">Remarks:</span>
                      <span className='text-xs'>{followUp.remarks}</span>
                    </div>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Box>
    </Paper>
  );
};

export default FollowUpHistory;
