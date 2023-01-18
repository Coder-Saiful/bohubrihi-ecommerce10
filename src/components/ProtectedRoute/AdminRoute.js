import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, userInfo } from '../../utils/auth';

const AdminRoute = ({children}) => {
    return (
        isAuthenticated() ? (
            userInfo().role === 'admin' ? children : <Navigate to='/user/dashboard' />
        ) : <Navigate to='/login' />
    );
};

export default AdminRoute;