import React, { useEffect, useContext } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Grid, Card, CardContent } from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';
import { DetailsContext } from '../context';

const Reminder = () => {
    const { followUpValues, statusValues, productValues, userValues, leadValues } = useContext(DetailsContext);

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
    // const leadMap = leadValues.reduce((map, lead) => {
    //     map[lead.LID] = lead.name;
    //     return map;
    // }, {});

    const leadMap = leadValues.reduce((map, lead) => {
        map[lead.LID] = {
            name: lead.name,
            organizationName: lead.organizationName
        };
        
        return map;
    }, {});

    // console.log('Lead values', leadValues, 'and leadmap', leadMap)

    // useEffect(() => {
    //     const upComingFollowUps = followUpValues.filter(item => item.hasOwnProperty('nextDate'));
        
    // }, [followUpValues]);

    return (
        <div className="container mx-auto p-4">
            <Accordion defaultExpanded>
                <AccordionSummary
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        borderRadius: '5px',
                    }}
                    expandIcon={<ExpandMoreRounded sx={{ color: 'primary.contrastText' }} />}
                    aria-controls="reminders-content"
                    id="reminders-header"
                >
                    <Typography variant="h6" className="font-semibold">
                        Reminders
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1">
                        Up-coming follow-ups
                    </Typography>

                    <ul className="mt-2">
                        {followUpValues
                            .filter(item => item.hasOwnProperty('nextDate'))
                            .map((followUp, index) => (
                                <Card key={index} className="mb-2" variant="outlined">
                                    <CardContent>

                                        <Typography variant="h6" gutterBottom>
                                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <svg fill="#a92323" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xmlSpace="preserve" stroke="#a92323" style={{ marginRight: '8px' }}>
                                                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                    <g id="SVGRepo_iconCarrier">
                                                        <g>
                                                            <path d="M57.223,58.309l-5.969-6.244c1.746-1.919,2.82-4.458,2.82-7.25c0-5.953-4.843-10.796-10.796-10.796 s-10.796,4.843-10.796,10.796S37.324,55.61,43.277,55.61c2.441,0,4.688-0.824,6.499-2.196l6.001,6.277 C55.974,59.896,56.236,60,56.5,60c0.249,0,0.497-0.092,0.691-0.277C57.59,59.341,57.605,58.708,57.223,58.309z M43.277,53.61 c-4.85,0-8.796-3.946-8.796-8.796s3.946-8.796,8.796-8.796s8.796,3.946,8.796,8.796S48.127,53.61,43.277,53.61z" />
                                                            <path d="M29.5,21h-2h-7h-2h-9v9v2v7v2v9h9h2h9v-9v-2v-7h7h2h9V21h-9h-2H29.5z M18.5,48h-7v-7h7V48z M18.5,39h-7v-7h7V39z M18.5,30 h-7v-7h7V30z M27.5,48h-7v-7h7V48z M27.5,39h-7v-7h7V39z M27.5,30h-7v-7h7V30z M36.5,30h-7v-7h7V30z M38.5,23h7v7h-7V23z" />
                                                            <path d="M31.5,55h-27V16h48v14c0,0.553,0.447,1,1,1s1-0.447,1-1V15V5c0-0.553-0.447-1-1-1h-5V1c0-0.553-0.447-1-1-1h-7 c-0.553,0-1,0.447-1,1v3h-22V1c0-0.553-0.447-1-1-1h-7c-0.553,0-1,0.447-1,1v3h-5c-0.553,0-1,0.447-1,1v10v41c0,0.553,0.447,1,1,1 h28c0.553,0,1-0.447,1-1S32.053,55,31.5,55z M41.5,5V2h5v3v3h-5V5z M10.5,5V2h5v3v3h-5V5z M4.5,6h4v3c0,0.553,0.447,1,1,1h7 c0.553,0,1-0.447,1-1V6h22v3c0,0.553,0.447,1,1,1h7c0.553,0,1-0.447,1-1V6h4v8h-48V6z" />
                                                        </g>
                                                    </g>
                                                </svg>
                                                {new Date(followUp.nextDate).toLocaleDateString()}
                                            </span>
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Product: </strong> {productMap[followUp.PID] || 'Unknown'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Type : </strong> {followUp.nextType}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Lead : </strong>{leadMap[followUp.LID]?.name || 'Unknown'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Organization : </strong>{leadMap[followUp.LID]?.organizationName || 'Unknown'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Last Status : </strong> {statusMap[followUp.SID] || 'Unknown'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1">
                                                    <strong>Assigned User : </strong> {userMap[followUp.UID] || 'Unknown'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                    </ul>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default Reminder;