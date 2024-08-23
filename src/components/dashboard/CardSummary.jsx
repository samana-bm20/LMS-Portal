import React, { useState, useEffect } from 'react';
import { AssignmentRounded, AssignmentIndRounded, AssignmentLateRounded, AssistantPhotoRounded } from '@mui/icons-material';
import BusinessAnalyst from '../../assets/DashboardCards/businessAnalyst.svg'
import EIGAP from '../../assets/DashboardCards/eigap.svg'
import LRS from '../../assets/DashboardCards/lrs.svg'
import MapData from '../../assets/DashboardCards/mapData.svg'
import Config from '../../Config';
import axios from 'axios';

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
        <div className='text-xs'>Active: {active} | Dead: {dead}</div>
    </div>
);

const CardSummary = () => {
    //Total Lead count active or dead declare variable (state variable and updater variable = initial value)
    const [totalCount, setTotalCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [deadCount, setInactiveCount] = useState(0);
    const [totalLeadsLastTwoMonths, setTotalLeadsLastTwoMonths] = useState(0);

    //Total Product Lead countdeclare variable (state variable and updater variable = initial value)
    const [card2Data, setCard2Data] = useState([]);
    const cardOrder = ['Business Analyst', 'EIGAP', 'LRS', 'Map Data'];



    // funtion of lead count (fetch data of total lead, active lead, new lead, dead lead from api)
    const fetchTotalCount = async () => {
       
        try {
            const response = await axios.get(`${Config.apiUrl}/leads-count`);
            if (Array.isArray(response.data) && response.data.length > 0) {
                const data = response.data[0];
                const { totalLeads, activeLeads, deadLeads, totalLeadsLastTwoMonths } = data;
                setTotalCount(totalLeads);
                setActiveCount(activeLeads);
                setInactiveCount(deadLeads);
                setTotalLeadsLastTwoMonths(totalLeadsLastTwoMonths);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching total count:', error);
        }
    };

    // funtion of productLead count (fetch data of ProductName,ActiveLead,DeadLead,totalProductLead from api)
    const fetchProductLeadCount = async () => {
        try {
            const response = await axios.get(`${Config.apiUrl}/productlead-count`);
    
            if (Array.isArray(response.data) && response.data.length > 0) {
                const transformedData = response.data.map(item => {
                    let colorClass = '';
    
                    switch (item.PID) {
                        case 'P1':
                            colorClass = 'bg-purple-500';
                            break;
                        case 'P2':
                            colorClass = 'bg-orange-500';
                            break;
                        case 'P3':
                            colorClass = 'bg-teal-600';
                            break;
                        case 'P4':
                            colorClass = 'bg-pink-500';
                            break;
                        default:
                            colorClass = 'bg-gray-500'; 
                    }
    
                    return {
                        color: colorClass,
                        title: item.productName,
                        total: item.totalLeads,
                        active: item.activeLeads,
                        dead: item.deactiveLeads,
                        icon: getIcon(item.productName), // Implement getIcon function if needed
                        alt: item.productName
                    };
                });
    
                // Sort the transformedData according to the fixed cardOrder
                const sortedData = transformedData.sort((a, b) => {
                    return cardOrder.indexOf(a.title) - cardOrder.indexOf(b.title);
                });
    
                setCard2Data(sortedData);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    
    const getIcon = (productName) => {
        switch (productName) {
            case 'Business Analyst':
                return BusinessAnalyst;
            case 'EIGAP':
                return EIGAP;
            case 'LRS':
                return LRS;
            case 'Map Data':
                return MapData;
            default:
                return DefaultIcon; 
        }
    };

    // Call function
useEffect(() => {
    fetchTotalCount();
    fetchProductLeadCount();
}, [totalCount]);

    const card1Data = [
        {
            color: 'bg-red-500',
            title: 'Total Leads',
            count: totalCount !== null ? totalCount : 'Loading...',
            icon: <AssignmentRounded fontSize="large" />
        },
        {
            color: 'bg-blue-500',
            title: 'New Leads',
            count: totalLeadsLastTwoMonths !== null ? totalLeadsLastTwoMonths : 'Loading...',
            icon: <AssignmentIndRounded fontSize="large" />
        },
        {
            color: 'bg-green-600',
            title: 'Active Leads',
            count: activeCount !== null ? activeCount : 'Loading...',
            icon: <AssignmentLateRounded fontSize="large" />
        },
        {
            color: 'bg-gray-500',
            title: 'Dead Leads',
            count: deadCount !== null ? deadCount : 'Loading...',
            icon: <AssistantPhotoRounded fontSize="large" />
        },
    ];

    return (
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
        </div>)
}

export default CardSummary;