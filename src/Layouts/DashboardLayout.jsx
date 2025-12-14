import React, { useState, useEffect, useRef, use } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { FaHistory, FaUsers, FaHome, FaCog, FaBell, FaSignOutAlt, FaChartLine, FaTicketAlt, FaPlusCircle } from 'react-icons/fa';
import useRole from '../Hooks/useRole';
import { MdPendingActions, MdDashboard } from 'react-icons/md';
import { CgProfile } from "react-icons/cg";
import { LuTicketCheck, LuTicketPlus } from "react-icons/lu";
import Footer from '../Components/Shared/Footer';
import { IoTicketOutline, IoSettingsOutline } from 'react-icons/io5';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { RiAdvertisementLine } from 'react-icons/ri';
import { AuthContext } from '../Context/AuthContext';

const DashboardLayout = () => {
    const { user } = use(AuthContext);
    const { role, roleLoading } = useRole();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const hoverTimerRef = useRef(null);
    const location = useLocation();

    const getRoleDisplay = () => {
        switch (role) {
            case 'admin': return 'Administrator';
            case 'vendor': return 'Vendor';
            case 'user': return 'User';
            default: return 'User';
        }
    };

    const handleSidebarMouseEnter = () => {
        if (window.innerWidth >= 1024) {
            setIsHovering(true);
            hoverTimerRef.current = setTimeout(() => {
                setSidebarExpanded(true);
            }, 2000);
        }
    };

    const handleSidebarMouseLeave = () => {
        if (window.innerWidth >= 1024) {
            setIsHovering(false);
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
            }
            // Only collapse if not manually toggled to stay expanded
            if (!sidebarExpanded || isHovering) {
                setSidebarExpanded(false);
            }
        }
    };

    const toggleSidebar = () => {
        setSidebarExpanded(prev => !prev);
    };

    const handleLinkClick = () => {
        if (window.innerWidth < 1024) {
            setSidebarExpanded(false);
        }
        // On desktop, keep sidebar expanded if user clicked to expand it
        // Otherwise, if it was expanded by hover, collapse it
        else if (window.innerWidth >= 1024 && !sidebarExpanded) {
            // If sidebar was expanded by hover, don't do anything
            // Let the mouse leave handler handle it
        }
    };

    // Clear all timers and reset state on route change
    useEffect(() => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
        }
        setIsHovering(false);
        // On desktop, collapse sidebar on route change if it was expanded by hover
        if (window.innerWidth >= 1024 && isHovering) {
            setSidebarExpanded(false);
        }
    }, [location.pathname]);

    useEffect(() => {
        return () => {
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (window.innerWidth < 1024 && sidebarExpanded) {
                const sidebar = document.querySelector('.mobile-sidebar');
                if (sidebar && !sidebar.contains(event.target)) {
                    setSidebarExpanded(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarExpanded]);

    // Reset sidebar state on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarExpanded(false);
                if (hoverTimerRef.current) {
                    clearTimeout(hoverTimerRef.current);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // NavLink component for consistent styling
    const DashboardNavLink = ({ to, icon, children, end = false, className = '' }) => (
        <li>
            <NavLink
                to={to}
                end={end}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${sidebarExpanded ? 'gap-3' : 'justify-center'
                    } ${isActive ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md' :
                        'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    } ${className}`
                }
            >
                {icon}
                {sidebarExpanded && children}
            </NavLink>
        </li>
    );

    // User profile section component
    const UserProfileSection = ({ expanded }) => (
        <div className={`flex items-center gap-3 p-3 bg-linear-to-r from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-700 rounded-lg ${expanded ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
            <div className="avatar">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    <img
                        src={user?.photoURL || user?.imageURL}
                        referrerPolicy='no-referrer'
                        alt={user?.displayName}
                        className='object-cover w-full h-full rounded-full'
                    />
                </div>
            </div>
            {expanded && (
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-white truncate">{user?.displayName}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            role === 'vendor' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                            {getRoleDisplay()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );

    // Navigation links based on user role
    const renderRoleBasedLinks = () => {
        switch (role) {
            case 'user':
                return (
                    <>
                        {sidebarExpanded && (
                            <div className="px-3 pt-6 pb-2">
                                <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Tickets</h4>
                            </div>
                        )}
                        <DashboardNavLink
                            to="/dashboard/my-tickets"
                            icon={<FaTicketAlt className="text-lg min-w-5" />}
                        >
                            <span>My Tickets</span>
                        </DashboardNavLink>
                        <DashboardNavLink
                            to="/dashboard/book-ticket"
                            icon={<FaPlusCircle className="text-lg min-w-5" />}
                        >
                            <span>Book New Ticket</span>
                        </DashboardNavLink>
                        {sidebarExpanded && (
                            <div className="px-3 pt-6 pb-2">
                                <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">History</h4>
                            </div>
                        )}
                        <DashboardNavLink
                            to="/dashboard/transactions"
                            icon={<FaHistory className="text-lg min-w-5" />}
                        >
                            <span>Transaction History</span>
                        </DashboardNavLink>
                    </>
                );

            case 'vendor':
                return (
                    <>
                        {sidebarExpanded && (
                            <div className="px-3 pt-6 pb-2">
                                <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Ticket Management</h4>
                            </div>
                        )}
                        <DashboardNavLink
                            to="/dashboard/add-tickets"
                            icon={<LuTicketPlus className="text-lg min-w-5" />}
                        >
                            <span>Add New Ticket</span>
                        </DashboardNavLink>
                        <DashboardNavLink
                            to="/dashboard/my-tickets"
                            icon={<LuTicketCheck className="text-lg min-w-5" />}
                        >
                            <div className="flex items-center justify-between w-full">
                                <span>My Tickets</span>
                                <span className="badge badge-primary"></span>
                            </div>
                        </DashboardNavLink>
                        {sidebarExpanded && (
                            <div className="px-3 pt-6 pb-2">
                                <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Business</h4>
                            </div>
                        )}
                        <DashboardNavLink
                            to="/dashboard/bookings"
                            icon={<MdPendingActions className="text-lg min-w-5" />}
                        >
                            <div className="flex items-center justify-between w-full">
                                <span>Booking Requests</span>
                                <span className="badge badge-warning">5</span>
                            </div>
                        </DashboardNavLink>
                        <DashboardNavLink
                            to="/dashboard/revenue"
                            icon={<FaMoneyBillTrendUp className="text-lg min-w-5" />}
                        >
                            <span>Revenue</span>
                        </DashboardNavLink>
                        <DashboardNavLink
                            to="/dashboard/analytics"
                            icon={<FaChartLine className="text-lg min-w-5" />}
                        >
                            <span>Analytics</span>
                        </DashboardNavLink>
                    </>
                );

            case 'admin':
                return (
                    <>
                        {sidebarExpanded && (
                            <div className="px-3 pt-6 pb-2">
                                <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Administration</h4>
                            </div>
                        )}
                        <DashboardNavLink
                            to="/dashboard/manage-tickets"
                            icon={<IoTicketOutline className="text-lg min-w-5" />}
                        >
                            <div className="flex items-center justify-between w-full">
                                <span>Manage Tickets</span>
                                <span className="badge badge-primary">45</span>
                            </div>
                        </DashboardNavLink>
                        <DashboardNavLink
                            to="/dashboard/users"
                            icon={<HiOutlineUserGroup className="text-lg min-w-5" />}
                        >
                            <span>Manage Users</span>
                        </DashboardNavLink>
                        <DashboardNavLink
                            to="/dashboard/advertise"
                            icon={<RiAdvertisementLine className="text-lg min-w-5" />}
                        >
                            <span>Advertise Tickets</span>
                        </DashboardNavLink>
                        {sidebarExpanded && (
                            <div className="px-3 pt-6 pb-2">
                                <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Reports</h4>
                            </div>
                        )}
                        <DashboardNavLink
                            to="/dashboard/reports"
                            icon={<FaChartLine className="text-lg min-w-5" />}
                        >
                            <span>System Reports</span>
                        </DashboardNavLink>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
            {/* Top Navigation Bar */}
            <div className="navbar bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-50">
                <div className="flex-1 px-4 flex items-center w-fit">
                    <button
                        onClick={toggleSidebar}
                        className="btn btn-ghost btn-circle lg:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <Link to={'/'} className="w-fit flex items-center gap-2 ml-2">
                        <div className="h-10 w-10 bg-linear-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                            <img src="/travel.png" alt="Ticket Bari Logo" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Ticket Bari</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex pt-16">
                {/* Desktop Sidebar */}
                <div
                    className={`desktop-sidebar min-h-screen bg-white dark:bg-gray-800 shadow-xl fixed left-0 top-0 pt-16 z-40 transition-all duration-300 ease-in-out ${sidebarExpanded ? 'w-64' : 'w-16'
                        } hidden lg:block`}
                    onMouseEnter={handleSidebarMouseEnter}
                    onMouseLeave={handleSidebarMouseLeave}
                >
                    {/* Profile Section */}
                    <div className={`p-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
                        <UserProfileSection expanded={sidebarExpanded} />
                    </div>

                    {/* Navigation Menu */}
                    <div className="p-2">
                        <ul className="menu space-y-1">
                            {/* Common Links */}
                            <DashboardNavLink
                                to="/dashboard"
                                end
                                icon={<MdDashboard className="text-lg min-w-5" />}
                            >
                                <span>Dashboard</span>
                            </DashboardNavLink>

                            <DashboardNavLink
                                to="/dashboard/profile"
                                icon={<CgProfile className="text-lg min-w-5" />}
                            >
                                <span>My Profile</span>
                            </DashboardNavLink>

                            {/* Role Specific Links */}
                            {renderRoleBasedLinks()}
                        </ul>
                    </div>
                </div>

                {/* Mobile Sidebar */}
                {sidebarExpanded && (
                    <div className="lg:hidden fixed inset-0 z-40">
                        <div
                            className="absolute inset-0 bg-black bg-opacity-50"
                            onClick={toggleSidebar}
                        ></div>
                        <div className="mobile-sidebar absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl">
                            {/* Mobile Sidebar Header */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 mt-12">
                                <UserProfileSection expanded={true} />
                            </div>

                            {/* Mobile Navigation Menu */}
                            <div className="p-2 overflow-y-auto h-[calc(100%-120px)]">
                                <ul className="menu space-y-1">
                                    {/* Common Links */}
                                    <DashboardNavLink
                                        to="/dashboard"
                                        end
                                        icon={<MdDashboard className="text-lg min-w-5" />}
                                        className="gap-3"
                                    >
                                        <span>Dashboard</span>
                                    </DashboardNavLink>

                                    <DashboardNavLink
                                        to="/dashboard/profile"
                                        icon={<CgProfile className="text-lg min-w-5" />}
                                        className="gap-3"
                                    >
                                        <span>My Profile</span>
                                    </DashboardNavLink>

                                    {/* Role Specific Links */}
                                    {renderRoleBasedLinks()}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className={`flex-1 w-full transition-all duration-300 ${sidebarExpanded ? 'lg:ml-64' : 'lg:ml-16'}`}>
                    <div className="p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
                        {/* Breadcrumb */}
                        <div className="text-sm breadcrumbs mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li className="text-gray-600 dark:text-gray-400">Current Page</li>
                            </ul>
                        </div>

                        {/* Welcome Banner */}
                        <div className="mb-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome back! 👋</h2>
                            <p className="opacity-90">Here's what's happening with your tickets today.</p>
                            <div className="mt-4 flex items-center gap-4">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Role: {getRoleDisplay()}</span>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Today: {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6 min-h-[calc(100vh-300px)]">
                            {roleLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                                        <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                                    </div>
                                </div>
                            ) : (
                                <Outlet />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default DashboardLayout;