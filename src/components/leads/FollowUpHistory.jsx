// import React, { useEffect, useState, useContext } from 'react';
// import { Box, Typography, Paper } from '@mui/material';
// import axios from 'axios';
// import Config from '../../Config';
// import { DetailsContext } from '../../context';
// import {
//   Timeline,
//   TimelineItem,
//   TimelineSeparator,
//   TimelineConnector,
//   TimelineContent,
//   TimelineDot,
// } from '@mui/lab';
// import { green, red } from '@mui/material/colors';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import EditIcon from '@mui/icons-material/Edit';

// const FollowUpHistory = ({ leadId }) => {
//   const [followUpData, setFollowUpData] = useState([]);
//   const { statusValues, productValues } = useContext(DetailsContext);

//   const fetchFollowUpData = async () => {
//     try {
//       const response = await axios.get(`${Config.apiUrl}/followUpDetails`);
//       const followUp = response.data;
//       const filteredFollowUp = followUp
//       .filter(followUp => followUp.LID === leadId)
//       .sort((a, b) => {
       
//         if (a.date < b.date) return 1;
//         if (a.date > b.date) return -1;
//         return 0; 
//       });
//       // const filteredFollowUp = followUp.filter(followUp => followUp.LID === leadId);
//       setFollowUpData(filteredFollowUp);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchFollowUpData();
//   }, [leadId]);

//   const statusMap = statusValues.reduce((map, status) => {
//     map[status.SID] = status.sName; 
//     return map;
//   }, {});
//   const productMap = productValues.reduce((map, product) => {
//     map[product.PID] = product.pName;
//     return map;
//   }, {});

//   const getDotColor = (status) => {
//     switch (status) {
//       case 'completed':
//         return green[500];
//       case 'pending':
//         return red[500];
//       default:
//         return green[500];
//     }
//   };

//   return (
//     <>
//       <Typography
//         variant="h6"
//         gutterBottom
//         sx={{
//           backgroundColor: '#0245A3',
//           color: 'white',
//           textAlign: 'center',
//           padding: '2px 0',
//         }}
//       >
//         Follow-up history
//       </Typography>
//       <Box
//         sx={{
//           height: '300px',
//           overflowY: 'auto',
//           padding: '0 16px',
//           width: '500px',
//         }}
//       >
//         {followUpData.length === 0 ? (
//           <Typography variant="body1" color="textSecondary" align="center">
//             No follow-up done yet
//           </Typography>
//         ) : (
//           <Timeline>
//             {followUpData.map((followUp, index) => (
//               <TimelineItem key={followUp.FID}>
//                 <TimelineSeparator>
//                   <TimelineDot style={{ backgroundColor: getDotColor(followUp.SID) }} />
//                   {index < followUpData.length - 1 && <TimelineConnector />}
//                 </TimelineSeparator>
//                 <TimelineContent>
//                   <Paper elevation={3} style={{ padding: '6px 16px', display: 'flex', alignItems: 'center' }}>
//                     <Box
//                       sx={{
//                         width: '150px',
//                       }}
//                     >
//                       <Typography
//                         variant="h6"
//                         component="h1"
//                         sx={{
//                           fontSize: '12px',
//                           fontWeight: 800,
//                         }}
//                       >
//                         Follow-Up for { productMap[followUp.PID] || 'Unknown'}
//                       </Typography>

//                       <Typography sx={{ fontSize: '12px' }}>
//                         Type: {followUp.type}
//                       </Typography>

//                       <Typography sx={{ fontSize: '12px' }}>
//                         Status: {statusMap[followUp.SID] || 'Unknown'}
//                       </Typography>
//                       <Typography sx={{ fontSize: '12px' }}>
//                         Notes: {followUp.remarks}
//                       </Typography>

//                       {followUp.status === 'pending' && (
//                         <Typography sx={{ fontSize: '12px' }} style={{ color: red[500] }}>
//                           Missed follow up
//                         </Typography>
//                       )}
//                     </Box>
//                   </Paper>
//                 </TimelineContent>
//                 <Typography
//                   sx={{ fontSize: '12px' }}
//                   variant="body2"
//                   color="textSecondary"
//                   style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}
//                 >
//                   <CalendarTodayIcon style={{ marginRight: 4 }} />
//                   {followUp.date}
//                 </Typography>
//                 <EditIcon style={{ marginLeft: 'auto', cursor: 'pointer' }} />
//               </TimelineItem>
//             ))}
//           </Timeline>
//         )}
//       </Box>
//     </>
//   );
// };

// export default FollowUpHistory;
import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import Config from '../../Config';
import { DetailsContext } from '../../context';
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

const FollowUpHistory = ({ leadId }) => {
  const [followUpData, setFollowUpData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { statusValues, productValues } = useContext(DetailsContext);

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

  const statusMap = statusValues.reduce((map, status) => {
    map[status.SID] = status.sName;
    return map;
  }, {});

  const productMap = productValues.reduce((map, product) => {
    map[product.PID] = product.pName;
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

  const filteredFollowUps = followUpData.filter(followUp => followUp.PID === selectedProduct);

  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          backgroundColor: '#0245A3',
          color: 'white',
          textAlign: 'center',
          padding: '2px 0',
        }}
      >
        Follow-up history
      </Typography>
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
          height: '235px',
          overflowY: 'auto',
          padding: '0 16px',
          width: '500px',
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
    </>
  );
};

export default FollowUpHistory;