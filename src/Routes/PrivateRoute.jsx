import React, { use } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { Navigate, useLocation } from 'react-router';
import Spinner from '../Components/Spinner';

const PrivateRoute = ({ children }) => {
    const { user, loading} = use(AuthContext)

    const location = useLocation();
    // console.log(location);
    

    if (loading) {
        return <div className='min-h-screen flex justify-center items-center'>
            <Spinner />
        </div>
    }

    if (user && user?.email) {
        return children;
    }

    return <Navigate state={{from:location}} to={'/auth/login'} replace/>
};


export default PrivateRoute;