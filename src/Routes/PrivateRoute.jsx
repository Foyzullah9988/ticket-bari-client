import React, { use } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Navigate, useLocation } from 'react-router';
import Loading from '../Components/Shared/Loading';

const PrivateRoute = ({ children }) => {
    const { user, loading} = use(AuthContext)

    const location = useLocation();
    // console.log(location);
    

    if (loading) {
        return <div className='min-h-screen flex justify-center items-center'>
            <Loading/>
        </div>
    }

    if (user && user?.email) {
        return children;
    }

    return <Navigate state={{from:location}} to={'/auth/login'} replace/>
};


export default PrivateRoute;