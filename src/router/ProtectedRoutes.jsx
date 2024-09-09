// src/components/ProtectedRoute.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const ProtectedRoute = ({ element, ...rest }) => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                {...rest}
                element={isAuthenticated ? element : <Navigate to="/" />}
            />
        </Routes>
    );
};

export default ProtectedRoute;
