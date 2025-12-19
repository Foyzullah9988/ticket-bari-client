import React from 'react';
import Home from '../Pages/Home/Home';
import Navbar from '../Components/Shared/Navbar';
import Footer from '../Components/Shared/Footer';
import { Outlet } from 'react-router';

const MainLayout = () => {
    return (
         <div className='flex flex-col min-h-screen bg-linear-to-br rounded-2xl from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden'>
            <Navbar />
            <div className='flex-1 container mx-auto mt-18 '>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;