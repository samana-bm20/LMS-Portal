import React from "react";
import {
  HomeRounded, MapRounded, DynamicFormRounded, AssignmentRounded, AlarmRounded, SwitchAccountRounded, 
  MoreTimeRounded, EventRounded
} from '@mui/icons-material'

const RoutesConfig = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: <HomeRounded />,
  },
  {
    name: 'Leads',
    to: '/leads',
    icon: <DynamicFormRounded />,
  },
  {
    name: 'Tasks',
    to: '/tasks',
    icon: <AssignmentRounded />,
  },
  {
    name: 'Reminder',
    to: '/reminder',
    icon: <AlarmRounded />,
  },
  {
    name: 'Products',
    to: '/products',
    icon: <MapRounded />,
  },
  {
    name: 'Users',
    to: '/users',
    icon: <SwitchAccountRounded />,
  },
  {
    name: 'ML Softwares',
    to: '/softwares-info',
    icon: <MoreTimeRounded />,
  },
  // {
  //   name: 'Calendar',
  //   to: '/calendar',
  //   icon: <EventRounded />,
  // },
];

export default RoutesConfig;
