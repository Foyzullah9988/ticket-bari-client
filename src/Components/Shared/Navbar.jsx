import React, { use } from 'react';
import { Link, NavLink } from 'react-router';
import Theme from './Theme';
import { AuthContext } from '../../Context/AuthContext';
// import useRole from '../../Hooks/useRole';

const Navbar = () => {
    // const {role} = useRole()
    // console.log(role);

    const { user, logout } = use(AuthContext)
    console.log(user);

    const handleLogout = () => {
        logout()
            .then(() => {

            })
            .catch(error => {
                console.error(error);
            })
    }

    const links = <>
        <li>
            <NavLink>
                hi
            </NavLink>
        </li>
    </>
    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">

                    <Link to={'/'} className="btn btn-ghost text-xl">Ticket Bari</Link>
                    {/* <div>{role}</div> */}
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {
                            links
                        }
                    </ul>
                </div>
                <div className="navbar-end">
                    <Theme />
                    {/* <a className="btn">Button</a> */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {
                                links
                            }
                            <li>
                                {user ? <button onClick={handleLogout} className="btn">Log Out</button>
                                : <Link to={'/auth/login'} className="btn">Login</Link>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;