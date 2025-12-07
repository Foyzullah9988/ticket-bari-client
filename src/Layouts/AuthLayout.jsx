import React from 'react';
import Navbar from '../Components/Shared/Navbar';
import Footer from '../Components/Shared/Footer';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar fixed={false}/>
            <div className='flex-1 container mx-auto mt-2'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default AuthLayout;