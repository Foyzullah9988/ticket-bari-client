import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { AuthContext } from '../../Context/AuthContext';
import { FaTicketAlt, FaCalendar, FaMapMarkerAlt, FaMoneyBill, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaTrash, FaEye, FaDownload } from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import { Link } from 'react-router';
import Swal from 'sweetalert2';

const MyTickets = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: tickets = [], refetch, isLoading, isError } = useQuery({
        queryKey: ['my-tickets', user?.email],
        queryFn: async () => {
            
            
            const res = await axiosSecure.get('/tickets',{
                params:{
                    vendorEmail:user?.email
                }
            });
            return res.data;
        },
        enabled: !!user?.email
    });

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'completed':
                return <FaCheckCircle className="text-green-500" />;
            case 'pending':
            case 'processing':
                return <MdPendingActions className="text-yellow-500" />;
            case 'cancelled':
            case 'rejected':
                return <FaTimesCircle className="text-red-500" />;
            default:
                return <FaExclamationTriangle className="text-gray-500" />;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle ticket cancellation
    const handleCancelTicket = async (ticket) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to cancel ticket #${ticket._id?.slice(-6)}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/tickets/${ticket._id}/cancel`, {
                        status: 'cancelled'
                    });

                    if (res.data.modifiedCount > 0) {
                        refetch();
                        Swal.fire(
                            'Cancelled!',
                            'Your ticket has been cancelled.',
                            'success'
                        );
                    }
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Failed to cancel ticket. Please try again.',
                        'error'
                    );
                    console.log(error);
                }
            }
        });
    };

    // Handle download ticket
    const handleDownloadTicket = (ticket) => {
        // This would typically generate a PDF or open print dialog
        Swal.fire({
            title: 'Download Ticket',
            text: 'Your ticket is being prepared for download...',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false
        });

        // In real app, you would generate PDF here
        console.log('Downloading ticket:', ticket._id);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your tickets...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error shadow-lg">
                <div>
                    <FaTimesCircle className="text-xl" />
                    <span>Failed to load tickets. Please try again.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">My Tickets</h2>
                    <p className="text-gray-600 dark:text-gray-400">Manage and track all your booked tickets</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Total Tickets:</span>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        {tickets.length}
                    </span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Confirmed</p>
                            <h3 className="text-3xl font-bold mt-2">
                                {tickets.filter(t => t.verificationStatus?.toLowerCase() === 'confirmed').length}
                            </h3>
                        </div>
                        <FaCheckCircle className="text-4xl opacity-80" />
                    </div>
                </div>

                <div className="bg-linear-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Pending</p>
                            <h3 className="text-3xl font-bold mt-2">
                                {tickets.filter(t => t.verificationStatus?.toLowerCase() === 'pending').length}
                            </h3>
                        </div>
                        <MdPendingActions className="text-4xl opacity-80" />
                    </div>
                </div>

                <div className="bg-linear-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Cost</p>
                            <h3 className="text-3xl font-bold mt-2">
                                ৳{tickets.reduce((sum, ticket) => sum + (ticket.price ), 0)}
                            </h3>
                        </div>
                        <FaMoneyBill className="text-4xl opacity-80" />
                    </div>
                </div>
            </div>

            {/* Tickets List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                {tickets.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <FaTicketAlt className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Tickets Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't booked any tickets yet.</p>
                        <Link
                            to="/all-tickets"
                            className="btn btn-primary gap-2"
                        >
                            <FaTicketAlt /> Browse Available Tickets
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700">
                                    <th className="font-semibold text-gray-700 dark:text-gray-300">Ticket Details</th>
                                    <th className="font-semibold text-gray-700 dark:text-gray-300">Date & Time</th>
                                    <th className="font-semibold text-gray-700 dark:text-gray-300">Price</th>
                                    <th className="font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                    <th className="font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr
                                        key={ticket._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="w-12 h-12 rounded-lg bg-linear-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                                                        <FaTicketAlt className="text-blue-600 dark:text-blue-300 text-xl" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 dark:text-white">
                                                        {ticket.title || `Ticket #${ticket._id?.slice(-6)}`}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                        <FaMapMarkerAlt className="text-xs" />
                                                        {ticket.from} → {ticket.to}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <FaCalendar className="text-sm" />
                                                    <span>{formatDate(ticket.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                                                    <FaClock className="text-xs" />
                                                    <span>{formatTime(ticket.departureDateTime)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-lg font-bold text-gray-800 dark:text-white">
                                                ৳{ticket.price || '0'}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {ticket.seats || 1} seat(s)
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(ticket.verificationStatus)}
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.verificationStatus)}`}>
                                                    {ticket.verificationStatus }
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDownloadTicket(ticket)}
                                                    className="btn btn-sm btn-ghost text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                    title="Download Ticket"
                                                >
                                                    <FaDownload />
                                                </button>

                                                <Link
                                                    to={`/ticket/${ticket._id}`}
                                                    className="btn btn-sm btn-ghost text-green-600 hover:text-green-800 dark:text-green-400"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </Link>

                                                {ticket.verificationStatus?.toLowerCase() === 'pending' && (
                                                    <button
                                                        onClick={() => handleCancelTicket(ticket)}
                                                        className="btn btn-sm btn-ghost text-red-600 hover:text-red-800 dark:text-red-400"
                                                        title="Cancel Ticket"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {tickets.slice(0, 3).map((ticket) => (
                        <div
                            key={`activity-${ticket._id}`}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${getStatusColor(ticket.verificationStatus)}`}>
                                    {getStatusIcon(ticket.verificationStatus)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        Ticket {ticket.title} {ticket.verificationStatus?.toLowerCase() === 'cancelled' ? 'was cancelled' : 'was booked'}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(ticket.createdAt)} at {formatTime(ticket.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-800 dark:text-white">৳{ticket.price || '0'}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-linear-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    <FaExclamationTriangle className="text-yellow-500" />
                    Important Information
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Please arrive at the station/bus stop at least 30 minutes before departure.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Keep your ticket ID or confirmation email ready for verification.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>Cancellations are only possible up to 24 hours before departure.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>For any issues, contact our support team at support@ticketbari.com</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MyTickets;