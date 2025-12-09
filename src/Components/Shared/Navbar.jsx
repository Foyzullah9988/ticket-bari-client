import React, { use, useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';
import Theme from './Theme';
import { AuthContext } from '../../Context/AuthContext';
import useRole from '../../Hooks/useRole';
import { IoLogIn, IoLogOut } from 'react-icons/io5';

const Navbar = ({ fixed = true }) => {
    const { role } = useRole();
    console.log(role);

    const { user, logout } = use(AuthContext);
    // console.log(user);

    const [isVisible, setIsVisible] = useState(true);
    const [isAtTop, setIsAtTop] = useState(true);
    const [isHovered, setIsHovered] = useState(false); // নতুন state
    const inactivityTimeoutRef = useRef(null);
    const mousePositionRef = useRef({ x: 0, y: 0 });

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
            if (!isHovered) { // শুধুমাত্র hover না থাকলে show করবে
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
                className='p-1 rounded-sm  hover:bg-linear-to-r '>
                Profile
            </NavLink>
        </li>
        <li>
            <NavLink to={'/all-tickets'} end
                className='p-1 rounded-sm  hover:bg-linear-to-r '>
                All Tickets
            </NavLink>
        </li>

        <li><Link to={'/'} onClick={handleLogout} className="btn  ">Logout<IoLogOut /></Link></li>


    </>;

    return (
        <div
            className={`${fixed ? 'fixed top-0 left-0 w-full shadow-sm z-50' : 'relative'} shadow-sm bg-base-300/50 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
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
                    <Link to={'/'} className="navbar-start">
                        <figure>
                            <img src="/travel.png" alt="" referrerPolicy="no-referrer"
                                className='w-12  rounded-full h-12 object-cover' />
                        </figure>
                        <p className=" text-xl px-1">Ticket Bari</p>
                        <div>{role}</div>
                    </Link>



                    <div className="navbar-end">
                        <div className='mr-2'>
                            <Theme />
                        </div>
                        {
                            user && <nav className='mr-2'>
                                <ul>
                                    <li>
                                        <NavLink to={'/dashboard'} end
                                            className='p-1 rounded-sm  hover:bg-linear-to-r '>
                                            Dashboard
                                        </NavLink>
                                    </li>
                                </ul>
                            </nav>
                        }

                        <div className='lg:hidden'>
                            {
                                user ?
                                    <div className="dropdown dropdown-end ">
                                        <div tabIndex={0} role="button" className="btn btn-ghost ">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                            </svg>
                                        </div>
                                        <ul
                                            tabIndex="-1"
                                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                            <figure className='flex justify-center items-center'>
                                                <img src={user?.photoURL} alt="" className='h-18 w-18 object-cover rounded-full' />
                                            </figure>
                                            <h2 className='text-xl font-semibold text-center mt-1'>{user?.displayName}</h2>
                                            {
                                                links
                                            }
                                        </ul>
                                    </div>
                                    :
                                    <li><Link to={'/auth/login'} className="btn  "><IoLogIn />Login</Link></li>
                            }
                        </div>


                        <div className='hidden lg:flex'>
                            {user
                                ? <div className='flex justify-center items-center gap-3'>
                                    <div className="dropdown  dropdown-end  ">
                                        <div tabIndex={0} role="button" className=" m-1">
                                            <figure className='text-indigo-500 font-bold'>
                                                <img src={user?.photoURL} alt=""
                                                    referrerPolicy="no-referrer"
                                                    className='w-12  rounded-full h-12 object-cover' title={user?.displayName} />
                                            </figure>
                                        </div>
                                        <ul tabIndex="-1" className="dropdown-content menu   rounded-box z-1 w-52 p-2 shadow-sm font-semibold space-y-1">

                                            {
                                                links
                                            }
                                        </ul>
                                        <p className='bg-[#4a2424]'></p>
                                    </div>
                                </div>
                                :
                                <li><Link to={'/auth/login'} className="btn  "><IoLogIn />Login</Link></li>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;