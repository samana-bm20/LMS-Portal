/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../providers/AuthProvider';
import MainLayout from '../layout/MainLayout';
import { Config } from "../Config";

//pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard'
import Leads from '../pages/Leads'
import Tasks from '../pages/Tasks';
import Reminder from "../pages/Reminder"
import Products from '../pages/Products';
import Users from '../pages/Users';
import MLSoftwaresInfo from '../pages/ml_softwares_info';
import ErrorPage from '../pages/ErrorPage';
import Payment from '../pages/Payment';
// import PaymentTable from '../components/paymentTable';

// eslint-disable-next-line react/prop-types
const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(`${Config.apiUrl}/verifyToken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Include this if your server expects JSON
            Authorization: token,
          },
          body: JSON.stringify({}), // Empty object as per the original request
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [children]);

  // Show a loading screen while checking token
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/lms/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const {  loading } = useAuth();
  const user = JSON.parse(sessionStorage.getItem('user'));

  if (loading) {
    return <><CircularProgress color='primary' /></>;
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <Navigate to='/lms/dashboard' replace />
        },
        {
          path: '/lms/dashboard',
          element: ( <AuthGuard><Dashboard /></AuthGuard>)
        },
        {
          path: '/lms/leads',
          element:( <AuthGuard><Leads /></AuthGuard>)
        },
        {
          path: '/lms/tasks',
          element: ( <AuthGuard><Tasks /></AuthGuard>)
        },
        {
          path: '/lms/reminder',
          element: ( <AuthGuard><Reminder /></AuthGuard>)
        },
        {
          path: '/lms/products',
          element:  ( <AuthGuard><Products /></AuthGuard>)
        },
        {
          path: '/lms/users',
          element: ( <AuthGuard><Users /></AuthGuard>)
        },
        {
          path: '/lms/softwares-info',
          element: user?.userType === 1 ?  ( <AuthGuard><MLSoftwaresInfo /></AuthGuard>) : <ErrorPage />
        },
        {
          path: '/lms/payment',
          element:  ( <AuthGuard><Payment/></AuthGuard>)
        },
        // {
        //   path: 'lms/PaymentTable',
        //   element: <PaymentTable />
        // }
       
      ],
    },
    {
      path: '/lms/',
      element: <Login />
    },
    {
      path: '*',
      element: <h2>Not Found</h2>
    }
  ])

  return (
    <RouterProvider router={router} />
  )
};

export default AppRoutes;
