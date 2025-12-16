import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState, useEffect } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { AuthContext } from '../../../Context/AuthContext';
import { FaTicketAlt, FaCalendar, FaMapMarkerAlt, FaMoneyBill, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaTrash, FaEye, FaDownload, FaEdit, FaRoute, FaCheck, FaStore, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { MdPendingActions } from 'react-icons/md';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useForm } from 'react-hook-form';

const MyTickets = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const { data: tickets = [], refetch, isLoading } = useQuery({
        queryKey: ['my-tickets', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets', {
                params: {
                    vendorEmail: user?.email
                }
            });
            return res.data;
        },
        enabled: !!user?.email
    });

    // Reset form when modal opens with selected ticket data
    useEffect(() => {
        if (selectedTicket && isModalOpen) {
            reset({
                departureDateTime: selectedTicket.departureDateTime ?
                    new Date(selectedTicket.departureDateTime).toISOString().slice(0, 16) : '',
                price: selectedTicket.price || '',
                availableQuantity: selectedTicket.availableQuantity || '',
                title: selectedTicket.title || '',
                from: selectedTicket.from || '',
                to: selectedTicket.to || ''
            });
        }
    }, [selectedTicket, isModalOpen, reset]);

    const sortedTickets = tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'approved':
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
            case 'approved':
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



    const departureTime = (ticket) => {
        if (!ticket.departureDateTime) return "Not set";

        const dDate = new Date(ticket.departureDateTime);
        const now = new Date();
        const diff = dDate - now;

        if (diff <= 0) {
            return "Expired";
        }

        const day = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (day > 0) {
            return `${day}d left`;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m left`;
    };


    const viewTicketDetails = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle update ticket
    const handleUpdate = async (data) => {
        if (!selectedTicket) return;

        try {
            // Prepare update data
            const updateData = {
                ...data,
                status: 'edited',
                updatedAt: new Date().toISOString()
            };

            // Convert price to number if it exists
            if (updateData.price) {
                updateData.price = Number(updateData.price);
            }

            // Convert availableQuantity to number if it exists
            if (updateData.availableQuantity) {
                updateData.availableQuantity = Number(updateData.availableQuantity);
            }

            const res = await axiosSecure.patch(`/tickets/${selectedTicket._id}`, updateData);

            if (res.data.modifiedCount > 0) {
                await refetch();
                Swal.fire({
                    title: 'Updated!',
                    text: 'Your ticket has been updated successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                setIsModalOpen(false);
                setSelectedTicket(null);
                reset();
            } else {
                Swal.fire({
                    title: 'No Changes',
                    text: 'No changes were made to the ticket.',
                    icon: 'info',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Update error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update ticket. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    // Handle ticket cancellation
    const handleDeleteTicket = async (ticket) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ticket #${ticket?.title}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/tickets/${ticket._id}`);

                    if (res.data.deletedCount > 0) {
                        refetch();
                        Swal.fire(
                            'Deleted!',
                            'Your ticket has been deleted.',
                            'success'
                        );
                    }
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Failed to delete ticket. Please try again.',
                        'error'
                    );
                    console.log(error);
                }
            }
        });
    };

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
                            <p className="text-sm opacity-90">Approved</p>
                            <h3 className="text-3xl font-bold mt-2">
                                {tickets.filter(t => t.verificationStatus?.toLowerCase() === 'approved').length}
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
                                {tickets.reduce((sum, ticket) => sum + (ticket.price || 0), 0)} tk
                            </h3>
                        </div>
                        <FaMoneyBill className="text-4xl opacity-80" />
                    </div>
                </div>
            </div>

            {/* Tickets List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                                <th className="font-semibold text-gray-700 dark:text-gray-300">Ticket Details</th>
                                <th className="font-semibold text-gray-700 dark:text-gray-300">Date & Time</th>
                                <th className="font-semibold text-gray-700 dark:text-gray-300">Price</th>
                                <th className="font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                <th className="font-semibold text-gray-700 dark:text-gray-300">Departure Time</th>
                                <th className="font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No tickets found
                                    </td>
                                </tr>
                            ) : (
                                sortedTickets.map((ticket) => (
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
                                                        {ticket.title}
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
                                                    <span>{formatTime(ticket.createdAt)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-lg font-bold text-gray-800 dark:text-white">
                                                {ticket.price} tk
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {ticket.availableQuantity} seats left
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(ticket.verificationStatus)}
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.verificationStatus)}`}>
                                                    {ticket.verificationStatus}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <FaClock className="text-sm" />
                                                    <span>{departureTime(ticket)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button
                                                disabled={ticket.verificationStatus?.toLowerCase() === 'rejected'}
                                                    onClick={() => viewTicketDetails(ticket)}
                                                    className={`${ticket.verificationStatus === 'rejected'?'text-base-200':'text-green-600 hover:text-green-800 dark:text-green-400'}btn btn-sm btn-ghost `}
                                                    title="Edit Ticket"
                                                >
                                                    Edit <FaEdit />
                                                </button>
                                                <button
                                                    disabled={ticket.verificationStatus?.toLowerCase() === 'rejected'}
                                                    onClick={() => handleDeleteTicket(ticket)}
                                                    className={`${ticket.verificationStatus === 'rejected'?'text-base-200':'text-red-600 hover:text-red-800 dark:text-red-400'}btn btn-sm btn-ghost `}
                                                    title="Delete Ticket"
                                                >
                                                    Delete <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {tickets
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 3)
                        .map((ticket) => (
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
                                            Ticket {ticket.title} {ticket.verificationStatus?.toLowerCase() === 'approved'
                                                ? 'was approved'
                                                : ticket.verificationStatus?.toLowerCase() === 'rejected'
                                                    ? 'was rejected'
                                                    : 'was pending'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(ticket.createdAt)} at {formatTime(ticket.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800 dark:text-white">{ticket.price} tk</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{ticket.verificationStatus}</p>
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

            {/* Ticket Details Modal */}
            {isModalOpen && selectedTicket && (
                <div className="modal modal-open">
                    <form onSubmit={handleSubmit(handleUpdate)} className="modal-box max-w-full w-full h-full max-h-screen rounded-none lg:rounded-xl lg:max-w-4xl lg:h-auto lg:max-h-[90vh] overflow-y-auto p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-base-300">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="p-1.5 sm:p-2 bg-primary text-primary-content rounded-lg">
                                    <FaTicketAlt className="text-lg sm:text-xl" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate">Edit Ticket Details</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs">Update ticket information</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-xs btn-circle btn-ghost"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedTicket(null);
                                    reset();
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                            {/* Left Column */}
                            <div className="space-y-2 sm:space-y-3">
                                {/* Route Information */}
                                <div className="card bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20">
                                    <div className="card-body p-2.5 sm:p-3">
                                        <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1">
                                            <FaRoute className="text-primary" />
                                            Route Information
                                        </h4>
                                        <div className="space-y-2 sm:space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Ticket Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('title', { required: 'Ticket title is required' })}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                                    placeholder="Enter ticket title"
                                                />
                                                {errors.title && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    From Location *
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('from', { required: 'From location is required' })}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                                    placeholder="Enter departure location"
                                                />
                                                {errors.from && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.from.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    To Location *
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('to', { required: 'Destination is required' })}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                                    placeholder="Enter destination"
                                                />
                                                {errors.to && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.to.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-2 sm:space-y-3">
                                {/* Pricing Information */}
                                <div className="card bg-linear-to-r from-success/10 to-emerald-100 dark:from-success/20 dark:to-success/5 border border-success/20">
                                    <div className="card-body p-2.5 sm:p-3">
                                        <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1">
                                            <FaMoneyBill className="text-success" />
                                            Pricing & Availability
                                        </h4>
                                        <div className="space-y-2 sm:space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Price (tk) *
                                                </label>
                                                <input
                                                    type="number"
                                                    {...register('price', {
                                                        required: 'Price is required',
                                                        min: { value: 1, message: 'Price must be at least 1 tk' }
                                                    })}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                                    placeholder="Enter price"
                                                />
                                                {errors.price && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Available Quantity *
                                                </label>
                                                <input
                                                    type="number"
                                                    {...register('availableQuantity', {
                                                        required: 'Available quantity is required',
                                                        min: { value: 1, message: 'Quantity must be at least 1' }
                                                    })}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                                    placeholder="Enter available seats"
                                                />
                                                {errors.availableQuantity && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.availableQuantity.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Departure Time */}
                                <div className="card bg-base-200 border border-base-300">
                                    <div className="card-body p-2.5 sm:p-3">
                                        <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1">
                                            <FaCalendarAlt className="text-warning" />
                                            Departure Time
                                        </h4>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Departure Date & Time *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaCalendarAlt className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="datetime-local"
                                                    {...register('departureDateTime', {
                                                        required: 'Departure date and time is required',
                                                        validate: (value) => {
                                                            if (!value) return true;
                                                            const selectedDate = new Date(value);
                                                            const now = new Date();
                                                            return selectedDate > now || 'Departure time must be in the future';
                                                        }
                                                    })}
                                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                                    min={new Date().toISOString().slice(0, 16)}
                                                />
                                            </div>
                                            {errors.departureDateTime && (
                                                <p className="text-sm text-red-600 mt-1">{errors.departureDateTime.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-action flex-col sm:flex-row gap-1.5 sm:gap-2">
                            <button
                                type="button"
                                className="btn btn-outline hover:btn-error w-full sm:w-auto order-2 sm:order-1 text-xs sm:text-sm px-2 sm:px-3 py-1.5 h-auto"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedTicket(null);
                                    reset();
                                }}
                            >
                                Cancel
                            </button>

                            <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto order-1 sm:order-2">
                                <button
                                    type="submit"
                                    className="btn bg-green-500 hover:bg-green-600 text-white gap-1 hover:scale-105 transition-transform flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5 h-auto"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        'Update Ticket'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="modal-backdrop" onClick={() => {
                        setIsModalOpen(false);
                        setSelectedTicket(null);
                        reset();
                    }}></div>
                </div>
            )}
        </div>
    );
};

export default MyTickets;