import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Context/AuthContext';

const PublicRoute = ({ children }) => {
    const { user } = use(AuthContext);
    const location = useLocation();

    if (user) {
        return <Navigate to={location.state?.from?.pathname || '/'} replace />
    }

    return children
};

export default PublicRoute;