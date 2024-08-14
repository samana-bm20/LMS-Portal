import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
<<<<<<< HEAD
import { useAuth } from '../providers/AuthProvider';
import MainLayout from '../layout/MainLayout';

//pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard'
import Leads from '../pages/Leads'
import Tasks from '../pages/Tasks';
=======
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard'
import Leads from '../pages/Leads'
import { useAuth } from '../providers/AuthProvider';
import MainLayout from '../layout/MainLayout';
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const router = isAuthenticated ? createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/dashboard',
          element: <Dashboard /> 
        },
        {
          path: '/leads',
          element: <Leads />
        },
<<<<<<< HEAD
        {
          path: '/tasks',
          element: <Tasks />
        },
=======
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
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
