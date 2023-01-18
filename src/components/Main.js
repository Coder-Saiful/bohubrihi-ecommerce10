import React from 'react';
import {Routes, Route} from 'react-router-dom';
import AdminDashboard from './Admin/AdminDashboard';
import Home from './Home/Home';
import PageNotFound from './PageNotFound';
import AdminRoute from './ProtectedRoute/AdminRoute';
import PrivateRoute from './ProtectedRoute/PrivateRoute';
import Dashboard from './User/Dashboard';
import Login from './User/Login';
import Register from './User/Register';

const Main = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/user/dashboard' element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            } />
            <Route path='/admin/dashboard' element={
                <AdminRoute>
                    <AdminDashboard />
                </AdminRoute>
            } />
            <Route path='*' element={<PageNotFound />} />
        </Routes>
    );
};

export default Main;