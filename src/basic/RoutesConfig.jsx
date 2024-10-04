import React from "react";
import {
  HomeRounded, MapRounded, DynamicFormRounded, AssignmentRounded, WatchLaterRounded, SwitchAccountRounded, 
  WebhookRounded, EventRounded
} from '@mui/icons-material';

const RoutesConfig = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  
  const routes = [
    {
      name: 'Dashboard',
      to: '/lms/dashboard',
      icon: <HomeRounded />,
    },
    {
      name: 'Leads',
      to: '/lms/leads',
      icon: <DynamicFormRounded />,
    },
    {
      name: 'Tasks',
      to: '/lms/tasks',
      icon: <AssignmentRounded />,
    },
    {
      name: 'Reminder',
      to: '/lms/reminder',
      icon: <WatchLaterRounded />,
    },
    {
      name: 'Products',
      to: '/lms/products',
      icon: <MapRounded />,
    },
    {
      name: 'Users',
      to: '/lms/users',
      icon: <SwitchAccountRounded />,
    },
  ];

  if (user.userType === 1) {
    routes.push({
      name: 'ML Softwares',
      to: '/lms/softwares-info',
      icon: <WebhookRounded />,
    });
  }

  return routes;
};

export default RoutesConfig;
