import React from 'react';
import useRole from '../../../Hooks/useRole';
import AdminDashboard from './AdminDashboard';
import VendorDashboard from './VendorDashboard';
import UserDashboard from './UserDashboard';
import Loading from '../../../Components/Shared/Loading';

const DashboardHome = () => {
    const {role,roleLoading} = useRole();

    if(roleLoading) return <Loading/>;

    if(role === 'admin'){
        return <AdminDashboard/>
    }else if(role === 'vendor'){
        return <VendorDashboard />
    }else{
        return <UserDashboard/>
    }
};

export default DashboardHome;