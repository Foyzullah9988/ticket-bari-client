import React, { use, useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';
import Theme from './Theme';
import { AuthContext } from '../../Context/AuthContext';
import useRole from '../../Hooks/useRole';
import { IoLogIn, IoLogOut, IoMoon, IoSunny } from 'react-icons/io5';

const Navbar = ({ fixed = true }) => {
    const { role } = useRole();
    const { user, logout } = use(AuthContext);
    const [isVisible, setIsVisible] = useState(true);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const inactivityTimeoutRef = useRef(null);
    const mousePositionRef = useRef({ x: 0, y: 0 });

    // Dark mode state
    

    const handleLogout = () => {
        logout()
            .then(() => { })
            .catch(error => {
                console.error(error);
            });
    };

    const handleMouseMove = (e) => {
        const currentX = e.clientX;
        const currentY = e.clientY;

        const deltaX = Math.abs(currentX - mousePositionRef.current.x);
        const deltaY = Math.abs(currentY - mousePositionRef.current.y);

        if (deltaX > 3 || deltaY > 3) {
            if (!isHovered) {
                setIsVisible(true);
                resetInactivityTimer();
            }
        }

        mousePositionRef.current = { x: currentX, y: currentY };
    };

    const handleTouchMove = () => {
        setIsVisible(true);
        resetInactivityTimer();
    };

    const resetInactivityTimer = () => {
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }

        if (!isHovered && window.scrollY > 0) {
            inactivityTimeoutRef.current = setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        }
    };

    useEffect(() => {
        if (window.scrollY === 0) {
            setIsVisible(true);
            setIsAtTop(true);
        } else {
            setIsAtTop(false);
            resetInactivityTimer();
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);

            if (inactivityTimeoutRef.current) {
                clearTimeout(inactivityTimeoutRef.current);
            }
        };
    }, [isHovered]);

    useEffect(() => {
        const handleScrollForTop = () => {
            if (window.scrollY === 0) {
                setIsAtTop(true);
                setIsVisible(true);
                if (inactivityTimeoutRef.current) {
                    clearTimeout(inactivityTimeoutRef.current);
                }
            } else {
                setIsAtTop(false);
                if (!isHovered) {
                    resetInactivityTimer();
                }
            }
        };

        window.addEventListener('scroll', handleScrollForTop, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScrollForTop);
        };
    }, [isHovered]);

    const links = <>
        <li>
            <NavLink to={'/dashboard/profile'} end
                className='p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors lg:hidden'>
                Profile
            </NavLink>
        </li>
        <li>
            <NavLink to={'/all-tickets'} end
                className='p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors lg:hidden'>
                All Tickets
            </NavLink>
        </li>
        <li>
            <NavLink to={'/dashboard'} end
                className='p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors lg:hidden'>
                Dashboard
            </NavLink>
        </li>
        <li>
            <button onClick={handleLogout} className="w-full text-left p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
                Logout <IoLogOut className="inline ml-1" />
            </button>
        </li>
    </>;

    return (
        <div
            className={`${fixed ? 'fixed top-0 left-0 w-full z-50' : 'relative'} transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'} 
            bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm`}
            onMouseEnter={() => {
                setIsHovered(true);
                setIsVisible(true);
                if (inactivityTimeoutRef.current) {
                    clearTimeout(inactivityTimeoutRef.current);
                }
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                if (window.scrollY > 0) {
                    resetInactivityTimer();
                }
            }}
        >
            <div className='container mx-auto'>
                <div className="navbar px-0">
                    {/* Logo Section */}
                    <Link to={'/'} className="navbar-start flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-600 to-green-500 flex items-center justify-center">
                                <img 
                                    src="/travel.png" 
                                    alt="Ticket Bari Logo" 
                                    className='w-10 h-10 object-cover rounded-full'
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{role?.charAt(0)}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xl font-bold bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                Ticket Bari
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Travel Made Easy</p>
                        </div>
                    </Link>

                    {/* Center Navigation - Hidden on mobile */}
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal gap-2 px-1">
                            <li>
                                <NavLink to={'/'} end
                                    className={({ isActive }) => 
                                        `px-4 py-2 rounded-lg ${isActive ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20'}`
                                    }>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/all-tickets'} end
                                    className={({ isActive }) => 
                                        `px-4 py-2 rounded-lg ${isActive ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20'}`
                                    }>
                                    All Tickets
                                </NavLink>
                            </li>
                            {user && (
                                <li>
                                    <NavLink to={'/dashboard'} end
                                        className={({ isActive }) => 
                                            `px-4 py-2 rounded-lg ${isActive ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20'}`
                                        }>
                                        Dashboard
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Right Section */}
                    <div className="navbar-end flex items-center gap-4">
                        {/* Theme Toggle */}
                        <div className="flex items-center">
                            <label className="swap swap-rotate">
                                <input 
                                    type="checkbox" 
                                    onChange={(e) => {
                                        const theme = e.target.checked ? "dark" : "light";
                                        const html = document.querySelector('html');
                                        html.setAttribute("data-theme", theme);
                                        localStorage.setItem("theme", theme);
                                        
                                    }}
                                    defaultChecked={localStorage.getItem('theme') === "dark"}
                                />
                                
                                <IoSunny className="swap-on w-6 h-6 text-amber-500" />
                                <IoMoon className="swap-off w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </label>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className='lg:hidden'>
                            {user ? (
                                <div className="dropdown dropdown-end ">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle ">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                        </svg>
                                    </div>
                                    <ul
                                        tabIndex="-1"
                                        className="dropdown-content menu bg-white dark:bg-gray-800 rounded-box mt-3 w-56 p-2 shadow-lg border border-gray-200 dark:border-gray-700 z-9999">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={user?.photoURL} 
                                                    alt={user?.displayName} 
                                                    className='w-12 h-12 rounded-full border-2 border-emerald-200 dark:border-emerald-800 object-cover'
                                                    referrerPolicy='no-referrer'
                                                />
                                                <div>
                                                    <h2 className='font-semibold text-gray-900 dark:text-white'>{user?.displayName}</h2>
                                                    <p className='text-sm text-gray-500 dark:text-gray-400'>{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {links}
                                    </ul>
                                </div>
                            ) : (
                                <Link to={'/auth/login'} className="btn btn-primary">
                                    <IoLogIn /> Login
                                </Link>
                            )}
                        </div>

                        {/* Desktop User Section */}
                        <div className='hidden lg:flex'>
                            {user ? (
                                <div className='flex items-center gap-4'>
                                    <div className="dropdown dropdown-end">
                                        <div tabIndex={0} role="button" className="flex items-center gap-3 cursor-pointer">
                                            <div className="relative">
                                                <img 
                                                    src={user?.photoURL} 
                                                    alt={user?.displayName}
                                                    className='w-10 h-10 rounded-full border-2 border-emerald-200 dark:border-emerald-800 object-cover'
                                                    referrerPolicy='no-referrer'
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                            </div>
                                            
                                        </div>
                                        <ul tabIndex="-1" className="dropdown-content menu bg-white dark:bg-gray-800 rounded-box z-1 w-56 p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                                            {links}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to={'/auth/login'} className="btn btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <IoLogIn /> Login
                                    </Link>
                                    <Link to={'/auth/register'} className="btn btn-primary">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;