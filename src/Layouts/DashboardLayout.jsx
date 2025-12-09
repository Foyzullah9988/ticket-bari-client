import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { FaAd, FaHistory, FaUsers } from 'react-icons/fa';
import useRole from '../Hooks/useRole';
import {  MdPendingActions } from 'react-icons/md';
import { BiTask } from 'react-icons/bi';
import { CgProfile } from "react-icons/cg";
import { LuTicketCheck, LuTicketPlus } from "react-icons/lu";
import Footer from '../Components/Shared/Footer';
import { IoTicketOutline } from 'react-icons/io5';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';


const DashboardLayout = () => {
    const { role } = useRole();
    return (
        <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Navbar */}
                    <nav className="navbar w-full bg-base-300">
                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            {/* Sidebar toggle icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                        </label>
                        <div className="px-4">Ticket Bari dashboard</div>
                    </nav>
                    {/* Page content here */}
                    <Outlet />
                </div>

                <div className="drawer-side is-drawer-close:overflow-visible">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                        {/* Sidebar content here */}
                        <ul className="menu w-full grow ">
                            {/* List item */}
                            <li>
                                <Link to={'/'}>
                                    <img src="/Assets/logo.png" alt="" /></Link>
                            </li>
                            <li>
                                <NavLink to={'/'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                                    {/* Home icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                    <span className="is-drawer-close:hidden">Home</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/dashboard'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                                    <CgProfile />

                                    <span className="is-drawer-close:hidden">My Profile</span>
                                </NavLink>
                            </li>

                            {
                                role === 'user' &&
                                <>
                                    <li>
                                        <NavLink to={'/dashboard/add-tickets'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Assigned Deliveries">
                                            <div className="mt-1.5 inline-block size-4">
                                                <BiTask />
                                            </div>
                                            <span className="is-drawer-close:hidden">My Booked Tickets</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to={'/dashboard/completed-deliveries'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Completed Deliveries">
                                            <div className="mt-1.5 inline-block size-4">
                                                <FaHistory />


                                            </div>
                                            <span className="is-drawer-close:hidden">Transaction History</span>
                                        </NavLink>
                                    </li>

                                </>
                            }



                            {
                                role === 'vendor' &&
                                <>
                                    <li>
                                        <NavLink to={'/dashboard/add-tickets'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Assigned Deliveries">
                                            <div className="mt-1.5 inline-block size-4">
                                                <LuTicketPlus />

                                            </div>
                                            <span className="is-drawer-close:hidden">Add Ticket</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to={'/dashboard/completed-deliveries'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Completed Deliveries">
                                            <div className="mt-1.5 inline-block size-4">
                                                <LuTicketCheck className="rotate-45"/>
                                            </div>
                                            <span className="is-drawer-close:hidden">My Added Tickets</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to={'/dashboard/completed-deliveries'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Completed Deliveries">
                                            <div className="mt-1.5 inline-block size-4">
                                                <MdPendingActions  />

                                            </div>
                                            <span className="is-drawer-close:hidden">Requested Bookings</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to={'/dashboard/completed-deliveries'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Completed Deliveries">
                                            <div className="mt-1.5 inline-block size-4">
                                                <FaMoneyBillTrendUp />

                                            </div>
                                            <span className="is-drawer-close:hidden">Revenue Overview </span>
                                        </NavLink>
                                    </li>

                                </>
                            }

                            {
                                role === 'admin'
                                &&
                                <>
                                    <li>
                                        <NavLink to={'/dashboard/make-vendor'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Approve Riders">
                                            <div className="mt-1.5 inline-block size-4">
                                                <IoTicketOutline />

                                            </div>
                                            <span className="is-drawer-close:hidden"> Manage Tickets </span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to={'/dashboard/assign-riders'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Assign Riders">
                                            <div className="mt-1.5 inline-block size-4">
                                                <FaUsers />
                                            </div>
                                            <span className="is-drawer-close:hidden">Manage Users</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to={'/dashboard/users-management'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Users Management">
                                            <div className="mt-1.5 inline-block size-4">
                                                <FaAd />

                                            </div>
                                            <span className="is-drawer-close:hidden">Advertise Tickets</span>
                                        </NavLink>
                                    </li>
                                </>
                            }


                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;