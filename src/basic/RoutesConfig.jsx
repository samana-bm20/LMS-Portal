import React from "react";
import {
  HomeRounded, MapRounded, DynamicFormRounded, AssignmentRounded, AlarmRounded, EventRounded
} from '@mui/icons-material'

const RoutesConfig = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: <HomeRounded />,
  },
  // {
  //   name: 'Products',
  //   to: '/products',
  //   icon: <MapRounded />,
  // },
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
  // {
  //   name: 'Reminder',
  //   to: '/reminder',
  //   icon: <AlarmRounded />,
  // },
  // {
  //   name: 'Calendar',
  //   to: '/calendar',
  //   icon: <EventRounded />,
  // },
];

export default RoutesConfig;
