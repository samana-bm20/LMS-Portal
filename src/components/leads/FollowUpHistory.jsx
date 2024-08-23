import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Paper, Tabs, Tab, useTheme } from '@mui/material';
import { useDetails } from '../../providers/DetailsProvider';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent
} from '@mui/lab';
import { green, red } from '@mui/material/colors';
import { CallRounded, MailRounded, SupervisorAccountRounded } from '@mui/icons-material';

const FollowUpHistory = ({ leadId, productId }) => {
  const theme = useTheme();
  const [followUpData, setFollowUpData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { followUpValues, statusValues, productValues, userValues } = useDetails();

  const sidToColor = {
    S1: theme.palette.text.disabled,
    S2: theme.palette.secondary.main,
    S3: theme.palette.warning.main,
    S4: theme.palette.success.main,
    S5: theme.palette.error.main,
  };

  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' };
  const dateOptions = { day: '2-digit', month: 'short', year: '2-digit' };

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
    fetchFollowUpData();
  }, [leadId]);

  const productFollowUp = followUpData.filter(followUp => followUp.PID === selectedProduct);
  const statusMap = statusValues.reduce((map, status) => {
    map[status.SID] = status.sName;
    return map;
  }, {});

  const productMap = productValues.reduce((map, product) => {
    map[product.PID] = product.pName;
    return map;
  }, {});

  const userMap = userValues.reduce((map, user) => {
    map[user.UID] = user.uName;
    return map;
  }, {});

  const assignedProducts = productValues.filter(product =>
    followUpData.some(followUp => followUp.PID === product.PID)
  );

  useEffect(() => {
    if (!selectedProduct && assignedProducts.length > 0) {
      setSelectedProduct(assignedProducts[0].PID);
    }
  }, [assignedProducts, selectedProduct]);

  const handleProductChange = (event, newValue) => {
    const productExists = assignedProducts.some(product => product.PID === newValue);
    if (productExists) {
      setSelectedProduct(newValue);
    } else if (assignedProducts.length > 0) {
      setSelectedProduct(assignedProducts[0].PID);
    }
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
        value={selectedProduct || (assignedProducts.length > 0 ? assignedProducts[0].PID : false)}
        onChange={handleProductChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Product Tabs"
        sx={{ marginBottom: '16px' }}
      >
        {assignedProducts.map((product) => (
          <Tab key={product.PID} label={product.pName} value={product.PID} />
        ))}
      </Tabs>
      <Box>
        {productFollowUp.length === 0 ? (
        <div className="text-center italic pb-10" style={{color: theme.palette.text.secondary}}>
         No follow-up done yet 
        </div>
        ) : (
        <Timeline sx={{p:0, overflowY: 'auto', scrollbarWidth: 'thin'}}>
        {productFollowUp.map((followUp, index) => (
          <TimelineItem key={followUp.FID}>
            <TimelineOppositeContent sx={{px:1, maxWidth: 'fit-content'}}>
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
            <TimelineContent sx={{px: 1 }}>
              <div className='grid w-full mb-2'>
              {followUp.type == 'call' && (
                <div className='flex items-center'>
                <CallRounded fontSize='small' color='info'/>
                <div className='text-sm pl-1 font-semibold uppercase'
                style={{color: theme.palette.info.main}}>{followUp.type}</div>
              </div>
              )}
              {followUp.type == 'email' && (
                <div className='flex items-center'>
                <MailRounded fontSize='small' color='info'/>
                <div className='text-sm pl-1 font-semibold uppercase'
                style={{color: theme.palette.info.main}}>{followUp.type}</div>
              </div>
              )}
              {followUp.type == 'physical' && (
                <div className='flex items-center'>
                <SupervisorAccountRounded fontSize='small' color='info'/>
                <div className='text-sm pl-1 font-semibold uppercase mb-1'
                style={{color: theme.palette.info.main}}>{followUp.type}</div>
              </div>
              )}
                <div className="flex">
                  <span className="text-xs italic mr-1"
                  style={{color: theme.palette.text.secondary}}>Done By:</span>
                  <span className='text-xs italic mb-1'
                  style={{color: theme.palette.text.secondary}}>{userMap[followUp.UID] || 'Unknown'}</span>
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


{/* 
import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Paper, Tabs, Tab, useTheme } from '@mui/material';
import axios from 'axios';
import Config from '../../Config';
import { useDetails } from '../../providers/DetailsProvider';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { green, red } from '@mui/material/colors';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';

const FollowUpHistory = ({ leadId, productId }) => {
  const theme = useTheme();
  const [followUpData, setFollowUpData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { statusValues, productValues, userValues } = useDetails();

  const fetchFollowUpData = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}/followUpDetails`);
      const followUp = response.data;
      const filteredFollowUp = followUp
        .filter(followUp => followUp.LID === leadId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setFollowUpData(filteredFollowUp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFollowUpData();
  }, [leadId]);

  const filteredFollowUps = followUpData.filter(followUp => followUp.PID === selectedProduct);

  const statusMap = statusValues.reduce((map, status) => {
    map[status.SID] = status.sName;
    return map;
  }, {});

  const productMap = productValues.reduce((map, product) => {
    map[product.PID] = product.pName;
    return map;
  }, {});

  const userMap = userValues.reduce((map, user) => {
    map[user.UID] = user.uName;
    return map;
  }, {});

  const assignedProducts = productValues.filter(product =>
    followUpData.some(followUp => followUp.PID === product.PID)
  );

  useEffect(() => {
    if (!selectedProduct && assignedProducts.length > 0) {
      setSelectedProduct(assignedProducts[0].PID);
    }
  }, [assignedProducts, selectedProduct]);

  const handleProductChange = (event, newValue) => {
    const productExists = assignedProducts.some(product => product.PID === newValue);
    if (productExists) {
      setSelectedProduct(newValue);
    } else if (assignedProducts.length > 0) {
      setSelectedProduct(assignedProducts[0].PID);
    }
  };

  const getDotColor = (status) => {
    switch (status) {
      case 'completed':
        return green[500];
      case 'pending':
        return red[500];
      default:
        return green[500];
    }
  };


  return (
    <Paper elevation={3} className="p-2">
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
      value={selectedProduct || (assignedProducts.length > 0 ? assignedProducts[0].PID : false)}
      onChange={handleProductChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="Product Tabs"
      sx={{ marginBottom: '16px' }}
    >
      {assignedProducts.map((product) => (
        <Tab key={product.PID} label={product.pName} value={product.PID} />
      ))}
    </Tabs>
    <Box
      sx={{
        overflowY: 'auto',
        padding: '0 16px',
        scrollbarWidth: 'thin',
      }}
    >
      {filteredFollowUps.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No follow-up done yet
        </Typography>
      ) : (
        <Timeline>
          {filteredFollowUps.map((followUp, index) => (
            <TimelineItem key={followUp.FID}>
              <TimelineSeparator>
                <TimelineDot style={{ backgroundColor: getDotColor(followUp.SID) }} />
                {index < filteredFollowUps.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} style={{ padding: '6px 16px', display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '150px',
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h1"
                      sx={{
                        fontSize: '12px',
                        fontWeight: 800,
                      }}
                    >
                      Follow-Up for {productMap[followUp.PID] || 'Unknown'}
                    </Typography>
                    <Typography sx={{ fontSize: '12px' }}>
                      Type: {followUp.type}
                    </Typography>
                    <Typography sx={{ fontSize: '12px' }}>
                      Status: {statusMap[followUp.SID] || 'Unknown'}
                    </Typography>
                    <Typography sx={{ fontSize: '12px' }}>
                      Notes: {followUp.remarks}
                    </Typography>
                    {followUp.status === 'pending' && (
                      <Typography sx={{ fontSize: '12px' }} style={{ color: red[500] }}>
                        Missed follow up
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </TimelineContent>
              <Typography
                sx={{ fontSize: '12px' }}
                variant="body2"
                color="textSecondary"
                style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}
              >
                <CalendarTodayIcon style={{ marginRight: 4 }} />
                {followUp.date}
              </Typography>
              <EditIcon style={{ marginLeft: 'auto', cursor: 'pointer' }} />
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </Box>
  </Paper>
  );
};

export default FollowUpHistory;

 */}