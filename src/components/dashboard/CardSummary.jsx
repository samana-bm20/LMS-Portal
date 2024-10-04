import React, { useState, useEffect, useRef } from 'react';
import {
    AssignmentRounded, AssignmentIndRounded, AssignmentLateRounded, AssistantPhotoRounded,
    ArrowBackIos, ArrowForwardIos
} from '@mui/icons-material';
import { LinearProgress, useTheme, alpha, IconButton } from '@mui/material';
import ESRI from '../../assets/DashboardCards/owner_esri.svg'
import ML from '../../assets/DashboardCards/owner_ml.svg'
import { Config } from "../../Config";
import axios from 'axios';

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

const ownerIconMap = {
    'ESRI': ESRI,
    'ML Infomap Pvt. Ltd': ML
};

const Card2 = ({ color, title, total, active, dead, owner, alt }) => {
    const ownerIcon = ownerIconMap[owner] || newLogo;

    return (
        <div className={`${color} text-white shadow-md rounded-lg p-4 m-2`} style={{ minWidth: '300px' }}>
            <div className="flex justify-between items-center h-full">
                <div>
                    <div className="text-xl font-semibold mb-2">
                        {title}
                    </div>
                    <div className="text-lg font-semibold">
                        <p>Total Leads</p>
                        <p>{total}</p>
                    </div>
                    <div className="text-xs mt-2">
                        Active: {active} | Inactive: {dead}
                    </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                    <img src={ownerIcon} alt={alt} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                </div>
            </div>
        </div>
    );
};

const CardSummary = () => {
    const theme = useTheme();
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [totalLeads, setTotalLeads] = useState(0);
    const [activeLeads, setActiveLeads] = useState(0);
    const [deadLeads, setDeadLeads] = useState(0);
    const [newLeads, setNewLeads] = useState(0);
    const [card2Data, setCard2Data] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cardContainerRef = useRef(null);

    const scrollLeft = () => {
        if (cardContainerRef.current) {
            cardContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (cardContainerRef.current) {
            cardContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    //#region Fetch Data
    useEffect(() => {
        const fetchLeadCount = async () => {
            if (user) {
                try {
                    const response = await axios.post(`${Config.apiUrl}/leadsCount`, {}, {
                        headers: {
                            'Authorization': token
                        }
                    });
                    const decryptData = Config.decryptData(response.data)

                    if (Array.isArray(decryptData) && decryptData.length > 0) {
                        const data = decryptData[0];
                        setTotalLeads(data.totalLeads);
                        setActiveLeads(data.activeLeads);
                        setDeadLeads(data.deadLeads);
                        setNewLeads(data.newLeads);
                    } else {
                        throw new Error('Unexpected response format');
                    }
                } catch (error) {
                    console.error('Error fetching total count:', error);
                    setError('Error fetching lead counts');
                }
            }
        };

        const fetchProductLeadCount = async () => {
            if (user) {
                try {
                    const response = await axios.post(`${Config.apiUrl}/productleadCount`, {}, {
                        headers: {
                            'Authorization': token
                        }
                    });
                    const decryptData = Config.decryptData(response.data)
                    if (decryptData.length > 0) {
                        const colors = [
                            'bg-purple-500',
                            'bg-orange-500',
                            'bg-pink-500',
                            'bg-teal-600',
                        ];
                        const productCountData = decryptData.map((item, index) => ({
                            color: colors[index % colors.length],
                            title: item.productName,
                            total: item.totalLeads,
                            active: item.activeLeads,
                            dead: item.deadLeads,
                            owner: item.owner,
                            alt: item.productName,
                        }));
                        setCard2Data(productCountData);
                    } else {
                        throw new Error('Unexpected response format');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setError('Error fetching product lead counts');
                }
            }
        };

        fetchLeadCount();
        fetchProductLeadCount();
        setLoading(false);
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
            <div className='text-lg pl-3 mb-2 font-bold' style={{ color: theme.palette.primary.main }}>
                Hi, {user?.uName || 'User'}
            </div>

            {loading && <LinearProgress color='primary' />}
            <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 mb-6">
                {card1Data.map((card, index) => (
                    <Card1
                        key={index}
                        color={card.color}
                        title={card.title}
                        count={card.count}
                        icon={card.icon}
                    />
                ))}
            </div>

            <div className="relative">
                <IconButton
                    onClick={scrollLeft}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        backgroundColor: alpha(theme.palette.background.default, 0.7),
                        color: theme.palette.primary.main,
                    }}
                >
                    <ArrowBackIos />
                </IconButton>

                <div
                    className="flex overflow-x-auto pb-4 no-scrollbar gap-4 px-2"
                    ref={cardContainerRef}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {card2Data.map((card, index) => (
                        <Card2
                            key={index}
                            color={card.color}
                            title={card.title}
                            total={card.total}
                            active={card.active}
                            dead={card.dead}
                            owner={card.owner}
                            alt={card.alt}
                        />
                    ))}
                </div>

                <IconButton
                    onClick={scrollRight}
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        backgroundColor: alpha(theme.palette.background.default, 0.7),
                        color: theme.palette.primary.main,
                    }}
                >
                    <ArrowForwardIos />
                </IconButton>
            </div>

        </>
    );
};

export default CardSummary;