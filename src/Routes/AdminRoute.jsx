import React, { use } from 'react';
import { AuthContext } from '../Context/AuthContext';
import useRole from '../Hooks/useRole';
import Loading from '../Components/Shared/Loading';
import Forbidden from '../Components/Shared/Forbidden';


const AdminRoute = ({children}) => {
    const {loading,user}=use(AuthContext);
    const {role,roleLoading} =useRole();

    if(loading || !user|| roleLoading)return <Loading/>;
    if(role!=='admin')return <Forbidden/>;

    return  children;

};

export default AdminRoute;