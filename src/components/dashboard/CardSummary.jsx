import React, { useState, useEffect } from 'react';
import { AssignmentRounded, AssignmentIndRounded, AssignmentLateRounded, AssistantPhotoRounded } from '@mui/icons-material';
import { colors, LinearProgress, useTheme } from '@mui/material';

import BusinessAnalyst from '../../assets/DashboardCards/businessAnalyst.svg'
import EIGAP from '../../assets/DashboardCards/eigap.svg'
import LRS from '../../assets/DashboardCards/lrs.svg'
import MapData from '../../assets/DashboardCards/mapData.svg'
import Config from '../../Config';
import axios from 'axios';
import { useDetails } from '../../providers/DetailsProvider';

//#region Card Layout
const Card1 = ({ color, title, count, icon }) => (
    <div className={`${color} text-white shadow-md rounded-lg p-4 m-2 flex`}>
        <div className="flex-grow">
            <div className="text-lg font-semibold mb-2">
                <p>{title}</p>
            </div>
            <div className="text-xl font-semibold">
                <p>{count}</p>
            </div>
        </div>
        <div className="flex items-center justify-center p-2 ml-2">
            {icon}
        </div>
    </div>
);

const Card2 = ({ color, title, total, active, dead, icon, alt }) => (
    <div className={`${color} text-white shadow-md rounded-lg p-4 m-2`}>
        <div className='text-xl font-semibold mb-2'>{title}</div>
        <div className="flex">
            <div className="flex-grow">
                <div className="text-lg font-semibold">
                    <p>Total Leads</p>
                </div>
                <div className="text-lg font-semibold mb-2">
                    <p>{total}</p>
                </div>
            </div>
            <div className="flex items-center justify-center p-2 ml-2">
                <img src={icon} alt={alt} />
            </div>
        </div>
        <div className='text-xs'>Active: {active} | Inactive: {dead}</div>
    </div>
);

const CardSummary = () => {
    const theme = useTheme();
    const { userValues, loggedUser } = useDetails();
    if (!userValues.length || !loggedUser) {
        return <><LinearProgress color='primary' /></>;
    }
    const user = userValues.filter((user) => user.username === loggedUser);
    const [totalLeads, setTotalLeads] = useState(0);
    const [activeLeads, setActiveLeads] = useState(0);
    const [deadLeads, setDeadLeads] = useState(0);
    const [newLeads, setNewLeads] = useState(0);
    const [card2Data, setCard2Data] = useState([]);

    //#region Fetch Count Data
    const fetchLeadCount = async () => {

        try {
            const response = await axios.get(`${Config.apiUrl}/leads-count/${user[0].UID}`);
            if (Array.isArray(response.data) && response.data.length > 0) {
                const data = response.data[0];
                const { totalLeads, activeLeads, deadLeads, newLeads } = data;
                setTotalLeads(totalLeads);
                setActiveLeads(activeLeads);
                setDeadLeads(deadLeads);
                setNewLeads(newLeads);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching total count:', error);
        }
    };

    const fetchProductLeadCount = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/productlead-count/${user[0]?.UID}`);

            if (response.data.length > 0) {
                const productCountData = response.data.map(item => {
                    let colorClass = '';
                    let icon;

                    switch (item.PID) {
                        case 'P1':
                            colorClass = 'bg-purple-500';
                            break;
                        case 'P2':
                            colorClass = 'bg-orange-500';
                            break;
                        case 'P3':
                            colorClass = 'bg-pink-500';
                            break;
                        case 'P4':
                            colorClass = 'bg-teal-600';
                            break;
                        default:
                            colorClass = 'bg-gray-500';
                    }

                    switch (item.productName) {
                        case 'Business Analyst':
                            icon = BusinessAnalyst;
                            break;
                        case 'EIGAP':
                            icon = EIGAP;
                            break;
                        case 'LRS':
                            icon = LRS;
                            break;
                        case 'Map Data':
                            icon = MapData;
                            break;
                        default:
                            icon = DefaultIcon;
                    }

                    return {
                        color: colorClass,
                        title: item.productName,
                        total: item.totalLeads,
                        active: item.activeLeads,
                        dead: item.deadLeads,
                        icon: icon,
                        alt: item.productName
                    };
                });
                setCard2Data(productCountData);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchLeadCount();
        fetchProductLeadCount();
    }, []);

    //#region Card1 Data
    const card1Data = [
        {
            color: 'bg-red-500',
            title: 'Total Leads',
            count: totalLeads,
            icon: <AssignmentRounded fontSize="large" />
        },
        {
            color: 'bg-blue-500',
            title: 'New Leads',
            count: newLeads,
            icon: <AssignmentIndRounded fontSize="large" />
        },
        {
            color: 'bg-green-600',
            title: 'Active Leads',
            count: activeLeads,
            icon: <AssignmentLateRounded fontSize="large" />
        },
        {
            color: 'bg-gray-500',
            title: 'Inactive Leads',
            count: deadLeads,
            icon: <AssistantPhotoRounded fontSize="large" />
        },
    ];

    //#region Display
    return (
        <>
            <div className='text-lg pl-3 mb-2 font-bold' style={{color: theme.palette.primary.main}}>
                Hi, {user[0]?.uName}
            </div>
            <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1">
                {card1Data.map((card, index) => (
                    <Card1
                        key={index}
                        color={card.color}
                        title={card.title}
                        count={card.count}
                        icon={card.icon}
                    />
                ))}
                {card2Data.map((card, index) => (
                    <Card2
                        key={index}
                        color={card.color}
                        title={card.title}
                        total={card.total}
                        active={card.active}
                        dead={card.dead}
                        icon={card.icon}
                        alt={card.alt}
                    />
                ))}
            </div>
        </>
    )
}

export default CardSummary;