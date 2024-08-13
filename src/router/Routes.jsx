import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard'
import Leads from '../pages/Leads'
import { useAuth } from '../providers/AuthProvider';
import MainLayout from '../layout/MainLayout';

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
