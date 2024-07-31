import React from 'react'
import { AssignmentRounded, AssignmentIndRounded, AssignmentLateRounded, AssistantPhotoRounded } from '@mui/icons-material';
import BusinessAnalyst from '../../assets/DashboardCards/businessAnalyst.svg'
import EIGAP from '../../assets/DashboardCards/eigap.svg'
import LRS from '../../assets/DashboardCards/lrs.svg'
import MapData from '../../assets/DashboardCards/mapData.svg'

const card1Data = [
    {
        color: 'bg-red-500',
        title: 'Total Leads',
        count: '195',
        icon: <AssignmentRounded fontSize="large" />
    },
    {
        color: 'bg-blue-500',
        title: 'New Leads',
        count: '120',
        icon: <AssignmentIndRounded fontSize="large" />
    },
    {
        color: 'bg-green-600',
        title: 'Active Leads',
        count: '45',
        icon: <AssignmentLateRounded fontSize="large" />
    },
    {
        color: 'bg-gray-500',
        title: 'Dead Leads',
        count: '30',
        icon: <AssistantPhotoRounded fontSize="large" />
    },
];

const card2Data = [
    {
        color: 'bg-purple-500',
        title: 'Business Analyst',
        total: '80',
        active: '75',
        dead: '5',
        icon: BusinessAnalyst,
        alt: 'B.A.'
    },
    {
        color: 'bg-orange-500',
        title: 'EIGAP',
        total: '50',
        active: '38',
        dead: '12',
        icon: EIGAP,
        alt: 'B.A.'
    },
    {
        color: 'bg-pink-500',
        title: 'LRS',
        total: '69',
        active: '49',
        dead: '20',
        icon: LRS,
        alt: 'B.A.'
    },
    {
        color: 'bg-teal-600',
        title: 'Map Data',
        total: '73',
        active: '66',
        dead: '7',
        icon: MapData,
        alt: 'B.A.'
    },
];

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
        <div className='text-2xl font-semibold mb-2'>{title}</div>
        <div className="flex">
            <div className="flex-grow">
                <div className="text-lg font-semibold">
                    <p>Total Leads</p>
                </div>
                <div className="text-xl font-semibold mb-2">
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