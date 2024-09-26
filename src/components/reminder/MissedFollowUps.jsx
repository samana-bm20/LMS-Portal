import React, { useEffect } from 'react'
import { IconButton, Fab, useTheme } from '@mui/material'
import {
    NotificationImportantRounded, PersonRounded, BusinessRounded,
    PhoneDisabledRounded, UnsubscribeRounded, PersonOffRounded
} from '@mui/icons-material'
import { useDetails } from '../../providers/DetailsProvider'

const MissedFollowUps = () => {
    const theme = useTheme();
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

    //#region Data
    const filteredFollowUps = user[0]?.userType === 2 ?
        followUpValues.filter(item =>
            item.hasOwnProperty('nextDate') &&
            new Date(item.nextDate) < new Date() &&
            item.UID == user[0]?.UID) :
        followUpValues.filter(item =>
            item.hasOwnProperty('nextDate') &&
            new Date(item.nextDate) < new Date());

    const missedFollowUps = filteredFollowUps.filter(filteredItem => {
        const maxFollowUpDate = followUpValues
            .filter(followUpItem =>
                followUpItem.LID === filteredItem.LID &&
                followUpItem.PID === filteredItem.PID)
            .reduce((maxDate, followUpItem) => {
                const followUpDate = new Date(followUpItem.date);
                return followUpDate > maxDate ? followUpDate : maxDate;
            }, new Date(0));

        const filteredDate = new Date(filteredItem.nextDate);

        return filteredDate > maxFollowUpDate;
    }).sort((a, b) => new Date(b.nextDate) - new Date(a.nextDate));

    return (
        <>
            {missedFollowUps.length == 0 ? (
                <div className='m-4 p-4 text-md font semibold text-center italic'
                    style={{ color: theme.palette.text.secondary }}>No missed follow-ups</div>
            ) : (
                missedFollowUps.map((followUp, index) => (
                    <div key={index} className="grid m-3">
                        <div className='flexitems-center m-1'>
                            <p className='text-sm font-semibold'>Date: {new Date(followUp.nextDate).toLocaleDateString('en-GB', dateOptions).replace(/ /g, '-')}</p>
                        </div>

                        <div className="flex justify-between items-center gap-4 p-2 rounded-lg shadow-md border"
                            style={{ backgroundColor: theme.palette.background.card }}>
                            <div className="grid p-4 place-items-center rounded-lg w-[120px]"
                                style={{ backgroundColor: theme.palette.error.main }}>
                                <NotificationImportantRounded sx={{ color: theme.palette.primary.contrastText }} />
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
                                <Fab color='error' variant="extended" sx={{ pointerEvents: 'none' }}>
                                    {followUp.nextType === 'call' && (
                                        <>
                                            <PhoneDisabledRounded />
                                            <p className='ml-1'>Call</p>
                                        </>
                                    )}
                                    {followUp.nextType === 'email' && (
                                        <>
                                            <UnsubscribeRounded />
                                            <p className='ml-1'>Mail</p>
                                        </>
                                    )}
                                    {followUp.nextType === 'physical' && (
                                        <>
                                            <PersonOffRounded />
                                            <p className='ml-1'>Meet</p>
                                        </>
                                    )}
                                </Fab>
                            </div>

                        </div>
                    </div>
                )
                ))}
        </>
    )
}

export default MissedFollowUps