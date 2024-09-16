import React, { useEffect, useState } from 'react';
import { IconButton, Fab, useTheme } from '@mui/material'
import {
    BorderColorRounded, NotificationsActiveRounded, PersonRounded, BusinessRounded,
    CallRounded, MailRounded, SupervisorAccountRounded
} from '@mui/icons-material'
import { useDetails } from '../../providers/DetailsProvider'
import EditFollowUp from './EditFollowUp';

const UpcomingFollowUps = () => {
    const theme = useTheme();
    const [selectedFollowUp, setSelectedFollowUp] = useState([]);
    const [openEditFollowUp, setOpenEditFollowUp] = useState(false);
    const { followUpValues, statusValues, productValues, userValues, leadValues, loggedUser } = useDetails();
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

    const productMap = productValues.reduce((map, product) => {
        map[product.PID] = product.pName;
        return map;
    }, {});

    const userMap = userValues.reduce((map, user) => {
        map[user.UID] = user.uName;
        return map;
    }, {});

    const leadMap = leadValues.reduce((map, lead) => {
        map[lead.LID] = {
            name: lead.name,
            organizationName: lead.organizationName
        };
        return map;
    }, {});

    //#region Data & Edit
    const upcomingFollowUps = user[0]?.userType === 2 ? followUpValues
        .filter(item => 
            item.hasOwnProperty('nextDate') && 
            new Date(item.nextDate) > new Date() &&
            item.UID == user[0]?.UID) 
        .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate)) : followUpValues
        .filter(item => 
            item.hasOwnProperty('nextDate') && 
            new Date(item.nextDate) > new Date())
        .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));

    const handleOpenEditFollowUp = (followUp) => {
        setSelectedFollowUp(followUp)
        setOpenEditFollowUp(true);
    }

    //#region Email Trigger
    const sendEmailReminder = async () => {
        for (const followUp of upcomingFollowUps) {
            const templateParams = {
                leadName: leadMap[followUp.LID]?.name || 'Unknown',
                organizationName: leadMap[followUp.LID]?.organizationName || 'Unknown',
                productName: productMap[followUp.PID] || 'Unknown',
                nextDate: new Date(followUp.nextDate).toLocaleDateString(),
                nextTime: new Date(followUp.nextDate).toTimeString().split(' ')[0],
                nextType: followUp.nextType,
                status: statusMap[followUp.SID] || 'Unknown',
                assignedUser: userMap[followUp.UID] || 'Unknown',
            };
            try {
                await emailjs.send(
                    'service_63mgy57',
                    'template_wekuqv4',
                    templateParams,
                    '-sblNuKabrsnOpvKG'
                );
            } catch (error) {
                console.error('Failed to send email', error);
            }
        }

    };

    useEffect(() => {
        const interval =
            setInterval(() => {
                const date = new Date()
                const followUpDate = upcomingFollowUps[0].nextDate
                const currentDate = new Date(date.toISOString());
                const currentTime = new Date(currentDate);
                const followUpTime = new Date(followUpDate);
                const differenceInMilliseconds = followUpTime - currentTime;

                if (differenceInMilliseconds > 593000 && differenceInMilliseconds < 600000) {
                    // sendEmailReminder()
                    alert('Email Sent')
                }
                if (differenceInMilliseconds > 86395000 && differenceInMilliseconds < 86400000) {
                    // sendEmailReminder()
                    alert('Email Sent')
                }
            }, 5000);

        return () => clearInterval(interval);
    }, [upcomingFollowUps]);

    return (
        <>
            {upcomingFollowUps.length == 0 ? (
                <div className='m-4 p-4 text-md font semibold text-center italic'
                    style={{ color: theme.palette.text.secondary }}>No upcoming follow-ups</div>
            ) : (
                upcomingFollowUps.map((followUp, index) => (
                    <div key={index} className="grid m-3">
                        <div className='flex justify-between items-center m-1 -mb-1'>
                            <p className='text-sm font-semibold'>Date: {new Date(followUp.nextDate).toLocaleDateString('en-GB', dateOptions).replace(/ /g, '-')}</p>

                            <div className='flex items-end'>
                                {followUp.edits && (() => {
                                    const previousDates = followUp.edits
                                        .filter(edit => edit.previousNextDate)
                                        .map(edit => new Date(edit.previousNextDate));

                                    if (previousDates.length > 0) {
                                        const oldestDate = new Date(Math.min(...previousDates));

                                        // Display the oldest previousDate
                                        return <p className="text-xs italic ml-2 mb-2" style={{ color: theme.palette.text.secondary }}
                                        >Original date: {oldestDate.toLocaleDateString('en-GB', dateOptions).replace(/ /g, '-')}</p>;
                                    }

                                    return null;
                                })()}
                                <IconButton fontSize='small' onClick={() => handleOpenEditFollowUp(followUp)}>
                                    <BorderColorRounded fontSize='small' />
                                </IconButton>
                            </div>
                        </div>

                        <div className="flex justify-between items-center gap-4 p-2 rounded-lg shadow-md"
                            style={{ backgroundColor: theme.palette.background.card }}
                        >
                            <div className="grid p-4 place-items-center rounded-lg w-[120px]"
                                style={{ backgroundColor: theme.palette.info.main }}>
                                <NotificationsActiveRounded sx={{ color: theme.palette.primary.contrastText }} />
                                <p className='text-xs font-semibold mt-1'
                                    style={{ color: theme.palette.primary.contrastText }}>
                                    {new Date(followUp.nextDate).toLocaleTimeString([], timeOptions)}</p>
                            </div>

                            <div className="grid mx-8 w-full">
                                <div className="flex justify-between items-center gap-1">
                                    <div className='flex'>
                                        <PersonRounded fontSize='small' />
                                        <span className='text-md ml-2 font-semibold'>{leadMap[followUp.LID]?.name || 'Unknown'}</span>
                                    </div>
                                    <div className='flex items-center'>
                                        <BusinessRounded fontSize='small' />
                                        <span className='text-md ml-2 font-semibold'>{leadMap[followUp.LID]?.organizationName || 'Unknown'}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between gap-1">
                                    <div>
                                        <span className='text-xs'>Product:</span>
                                        <span className='text-sm font-semibold ml-1'>{productMap[followUp.PID] || 'Unknown'}</span>
                                    </div>
                                    <div>
                                        <span className='text-xs'>Last Status:</span>
                                        <span className='text-sm p-1 rounded-xl mb-1 ml-1'
                                            style={{
                                                backgroundColor: sidToColor[followUp.SID],
                                                color: theme.palette.primary.contrastText
                                            }}
                                        >
                                            {statusMap[followUp.SID] || 'Unknown'}
                                        </span>
                                    </div>
                                </div>

                                <div className="gap-1 italic">
                                    <span className='text-xs'
                                        style={{ color: theme.palette.text.secondary }}>
                                        Assigned to:</span>
                                    <span className='text-sm font-semibold ml-1'
                                        style={{ color: theme.palette.text.secondary }}>
                                        {userMap[followUp.UID] || 'Unknown'}</span>
                                </div>
                            </div>

                            <div className='px-8'>
                                <Fab color='info' variant="extended" sx={{ pointerEvents: 'none' }}>
                                    {followUp.nextType === 'call' && (
                                        <>
                                            <CallRounded />
                                            <p className='ml-1'>Call</p>
                                        </>
                                    )}
                                    {followUp.nextType === 'email' && (
                                        <>
                                            <MailRounded />
                                            <p className='ml-1'>Mail</p>
                                        </>
                                    )}
                                    {followUp.nextType === 'physical' && (
                                        <>
                                            <SupervisorAccountRounded />
                                            <p className='ml-1'>Meet</p>
                                        </>
                                    )}
                                </Fab>
                            </div>

                        </div>
                    </div>
                )
                ))}
            <EditFollowUp
                openEditFollowUp={openEditFollowUp}
                setOpenEditFollowUp={setOpenEditFollowUp}
                selectedFollowUp={selectedFollowUp}
            />
        </>
    )
}

export default UpcomingFollowUps