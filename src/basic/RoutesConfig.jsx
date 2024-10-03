import React from "react";
import {
  HomeRounded, MapRounded, DynamicFormRounded, AssignmentRounded, AlarmRounded, SwitchAccountRounded, 
  MoreTimeRounded, EventRounded
} from '@mui/icons-material';
import { useDetails } from '../providers/DetailsProvider';

const RoutesConfig = () => {
  const { userValues, loggedUser } = useDetails();
  
  // Find the logged-in user based on `userValues` and `loggedUser`
  const user = userValues && loggedUser
    ? userValues.find((user) => user.username === loggedUser)
    : null;

  // Default Routes
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
      icon: <AlarmRounded />,
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

  // Conditionally add the "ML Softwares" route if userType is 1
  if (user?.userType === 1) {
    routes.push({
      name: 'ML Softwares',
      to: '/lms/softwares-info',
      icon: <MoreTimeRounded />,
    });
  }

  return routes;
};

export default RoutesConfig;
