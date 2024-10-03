import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useDetails } from '../providers/DetailsProvider';
import MainLayout from '../layout/MainLayout';

//pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard'
import Leads from '../pages/Leads'
import Tasks from '../pages/Tasks';
import Reminder from "../pages/Reminder"
import Products from '../pages/Products';
import Users from '../pages/Users';
import MLSoftwaresInfo from '../pages/ml_softwares_info'
import ErrorPage from '../pages/ErrorPage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { userValues, loggedUser } = useDetails();
  const user = userValues && loggedUser
  ? userValues.find((user) => user.username === loggedUser)
  : null;
  const router = isAuthenticated ? createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        // {
        //   path: '/',
        //   element: <Navigate to='/dashboard' replace />
        // },
        {
          path: '/lms/dashboard',
          element: <Dashboard />
        },
        {
          path: '/lms/leads',
          element: <Leads />
        },
        {
          path: '/lms/tasks',
          element: <Tasks />
        },
        {
          path: '/lms/reminder',
          element: <Reminder />
        },
        {
          path: '/lms/products',
          element: <Products />
        },
        {
          path: '/lms/users',
          element: <Users />
        },
        {
          path: '/lms/softwares-info',
          element: user?.userType === 1 ? <MLSoftwaresInfo /> : <ErrorPage />
        },
      ],
    },
    {
      path: '*',
      element: <h2>Not Found</h2>
    }
  ]) :
    createBrowserRouter([
      {
        path: '*',
        element: <Login />
      }
    ]);

  return (
    <RouterProvider router={router} />
  )
};

export default AppRoutes;



// import React from 'react';
// import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import { useAuth } from '../providers/AuthProvider';
// import MainLayout from '../layout/MainLayout';

// //pages
// import Login from '../pages/Login';
// import Dashboard from '../pages/Dashboard';
// import Leads from '../pages/Leads';
// import Tasks from '../pages/Tasks';
// import Reminder from "../pages/Reminder";

// const AppRoutes = () => {
//   const { isAuthenticated } = useAuth();
//   const router = isAuthenticated ? createBrowserRouter([
//     {
//       path: '/',
//       element: <MainLayout />,
//       children: [
//         {
//           path: '/',
//           element: <Navigate to='/dashboard' replace />
//         },
//         {
//           path: '/dashboard',
//           element: <Dashboard />
//         },
//         {
//           path: '/leads',
//           element: <Leads />
//         },
//         {
//           path: '/tasks',
//           element: <Tasks />
//         },
//         {
//           path: '/reminder',
//           element: <Reminder />
//         },
//       ],
//     },
//     {
//       path: '*',
//       element: <h2>Not Found</h2>
//     }
//   ], { basename: '/LMS' }) :
//     createBrowserRouter([
//       {
//         path: '*',
//         element: <Login />
//       }
//     ], { basename: '/LMS' });

//   return (
//     <RouterProvider router={router} />
//   )
// };

// export default AppRoutes;

