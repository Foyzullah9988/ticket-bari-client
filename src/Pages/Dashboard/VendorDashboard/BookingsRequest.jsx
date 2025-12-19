import React, { useState, useContext } from 'react';
import {
    FaCheck,
    FaTimes,
    FaEye,
    FaFilter,
    FaSearch,
    FaDownload,
    FaSync,
    FaUser,
    FaCalendar,
    FaTicketAlt,
    FaMoneyBill,
    FaMapMarkerAlt,
    FaRoute,
    FaClock,
    FaCalendarAlt,
    FaTag,
    FaStore,
    FaExclamationCircle,
    FaUserFriends,
    FaPhoneAlt,
    FaEnvelope,
    FaCreditCard,
    FaReceipt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';
import Loading from '../../../Components/Shared/Loading';

const BookingsRequest = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch all bookings
    const { data: bookings = [], isLoading, error, refetch } = useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const res = await axiosSecure.get('/bookings', { params: { vendorEmail: user?.email } });
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        retry: 2,
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to load bookings');
        }
    });

   

    // Filter bookings based on search and status
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            searchTerm === '' ||
            booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.ticketTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Handle status update with confirmation
    const handleUpdateStatus = (booking, newStatus) => {
        const actionText = newStatus === 'accepted' ? 'accept' :
            newStatus === 'cancelled' ? 'cancel' : 'update';

        Swal.fire({
            title: `Are you sure?`,
            text: `You want to ${actionText} the booking for "${booking.userName}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: newStatus === 'accepted' ? "#3085d6" :
                newStatus === 'cancelled' ? "#d33" : "#6c757d",
            cancelButtonColor: "#6c757d",
            confirmButtonText: `Yes, ${actionText} it!`
        }).then((result) => {
            if (result.isConfirmed) {
                updateBookingStatus(booking._id, newStatus);
            }
        });
    };

    // Execute status update
    const updateBookingStatus = (bookingId, status) => {
        setActionLoading(true);
        const updateInfo = { status: status };

        axiosSecure.patch(`/bookings/${bookingId}`, updateInfo)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    setActionLoading(false);

                    // Update selectedBooking if modal is open
                    if (isModalOpen && selectedBooking && selectedBooking._id === bookingId) {
                        setSelectedBooking(prev => ({
                            ...prev,
                            status: status
                        }));
                    }

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Booking ${status} successfully!`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    setActionLoading(false);
                    Swal.fire({
                        icon: "error",
                        title: "Update failed",
                        text: "No changes were made to the booking."
                    });
                }
            })
            .catch(error => {
                console.error(error);
                setActionLoading(false);
                Swal.fire({
                    icon: "error",
                    title: "Update failed",
                    text: error.response?.data?.message || "Something went wrong!"
                });
            });
    };

    const viewBookingDetails = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                        <FaCheck className="mr-1" />
                        Accepted
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">
                        <FaTimes className="mr-1" />
                        Cancelled
                    </span>
                );
            case 'pending':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 animate-pulse">
                        <FaClock className="mr-1" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        <FaExclamationCircle className="mr-1" />
                        {status}
                    </span>
                );
        }
    };

    const getTransportColor = (transportType) => {
        switch (transportType?.toLowerCase()) {
            case 'bus':
                return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300';
            case 'train':
                return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300';
            case 'plane':
            case 'flight':
                return 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-300';
            case 'ship':
            case 'ferry':
                return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300';
            case 'car':
                return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300';
            default:
                return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300';
        }
    };

    const exportToCSV = () => {
        const headers = ['Booking Ref', 'User Name', 'User Email', 'Ticket Title', 'From', 'To', 'Quantity', 'Total Price', 'Status', 'Booking Date'];
        const csvData = filteredBookings.map(booking => [
            booking.bookingReference || 'N/A',
            booking.userName,
            booking.userEmail,
            booking.ticketTitle,
            booking.from,
            booking.to,
            booking.quantity,
            `৳${booking.totalPrice}`,
            booking.status,
            booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        toast.success('📥 Report downloaded successfully!', {
            duration: 3000,
            style: {
                background: '#3B82F6',
                color: '#fff',
                borderRadius: '10px',
            },
        });
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6 flex flex-col gap-4">
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-center">
                        <FaExclamationCircle className="text-red-500 mr-2" />
                        <h3 className="text-lg font-semibold text-red-800">Error Loading Bookings</h3>
                    </div>
                    <p className="text-red-700 mt-2">
                        {error.response?.data?.error || 'Unable to load bookings. Please try again.'}
                    </p>
                    <button
                        onClick={refetch}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        <FaSync className="mr-2" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-linear-to-r from-primary/10 to-secondary/10 rounded-lg sm:rounded-xl">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 dark:text-white">Booking Requests</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage and process all booking requests from users</p>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <button
                            onClick={() => refetch()}
                            className="btn btn-primary btn-outline gap-1.5 shadow-sm hover:shadow-md transition-all text-xs px-2 sm:px-3 py-1.5 h-auto"
                        >
                            <FaSync className={`${isLoading ? 'animate-spin' : ''} w-3 h-3`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="btn btn-success gap-1.5 shadow-sm hover:shadow-md transition-all text-xs px-2 sm:px-3 py-1.5 h-auto"
                            disabled={filteredBookings.length === 0}
                        >
                            <FaDownload className="w-3 h-3" />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-linear-to-r dark:from-blue-900 dark:to-cyan-900 from-blue-500 to-cyan-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                        <div className="text-xl md:text-3xl font-bold mb-2">{bookings.length}</div>
                        <div className="text-sm opacity-90">Total Bookings</div>
                        <div className="text-xs opacity-80 mt-1">From all users</div>
                    </div>

                    <div className="bg-linear-to-r dark:from-yellow-900 dark:to-amber-900 from-yellow-500 to-amber-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                        <div className="text-xl md:text-3xl font-bold mb-2">
                            {bookings.filter(b => b.status === 'pending').length}
                        </div>
                        <div className="text-sm opacity-90">Pending Requests</div>
                        <div className="text-xs opacity-80 mt-1">Awaiting confirmation</div>
                    </div>

                    <div className="bg-linear-to-r dark:from-green-900 dark:to-emerald-900 from-green-500 to-emerald-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                        <div className="text-xl md:text-3xl font-bold mb-2">
                            {bookings.filter(b => b.status === 'accepted').length}
                        </div>
                        <div className="text-sm opacity-90">Accepted</div>
                        <div className="text-xs opacity-80 mt-1">Active bookings</div>
                    </div>

                    <div className="bg-linear-to-r dark:from-red-900 dark:to-orange-900 from-red-500 to-orange-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                        <div className="text-xl md:text-3xl font-bold mb-2">
                            {bookings.filter(b => b.status === 'cancelled').length}
                        </div>
                        <div className="text-sm opacity-90">Cancelled</div>
                        <div className="text-xs opacity-80 mt-1">Cancelled bookings</div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card bg-base-100 shadow border border-base-300 mb-6">
                <div className="card-body p-3 sm:p-4">
                    <div className="flex flex-col gap-4 items-center">
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search bookings by name, email, or reference"
                                    className="input border input-bordered w-full pl-12"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='flex justify-end items-center w-full'>
                            <div className="flex gap-2">
                                <div className="dropdown dropdown-bottom">
                                    <label tabIndex={0} className="btn btn-outline gap-2">
                                        <FaFilter />
                                        Filter: {statusFilter === 'all' ? 'All' : statusFilter}
                                    </label>
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><button onClick={() => setStatusFilter('all')}>All Status</button></li>
                                        <li><button onClick={() => setStatusFilter('pending')}>Pending</button></li>
                                        <li><button onClick={() => setStatusFilter('accepted')}>Accepted</button></li>
                                        <li><button onClick={() => setStatusFilter('cancelled')}>Cancelled</button></li>
                                    </ul>
                                </div>
                                <button
                                    className="btn btn-outline btn-error gap-1.5 text-xs px-2 sm:px-3 py-2 h-auto"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-sm text-gray-500">
                            Total: <span className="font-semibold">{bookings.length}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                            Pending: <span className="font-semibold">{bookings.filter(b => b.status === 'pending').length}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                            Accepted: <span className="font-semibold">{bookings.filter(b => b.status === 'accepted').length}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                            Cancelled: <span className="font-semibold">{bookings.filter(b => b.status === 'cancelled').length}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                            Filtered: <span className="font-semibold">{filteredBookings.length}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white dark:bg-base-200 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                        <FaSearch className="text-4xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings found</h3>
                        <p className="text-gray-500">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter'
                                : 'No bookings in the system yet'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Booking Details
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User Information
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Travel Details
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-base-100 transition-colors">
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="shrink-0 h-10 w-10 md:h-12 md:w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                                    <FaReceipt className="text-primary text-lg" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] md:max-w-none dark:text-white">
                                                        {booking.ticketTitle}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Ref: {booking.bookingReference || 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {formatDate(booking.bookingDate)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="shrink-0 h-8 w-8 bg-linear-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                                                    {booking.userName?.charAt(0) || 'U'}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[100px] md:max-w-none dark:text-white">
                                                        {booking.userName}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[120px]">
                                                        {booking.userEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm">
                                                    <FaMapMarkerAlt className="text-green-500 mr-1 w-3 h-3" />
                                                    <span className="truncate max-w-[80px]">{booking.from}</span>
                                                    <ArrowRightIcon className="w-3 h-3 mx-1 text-gray-400" />
                                                    <FaMapMarkerAlt className="text-red-500 mr-1 w-3 h-3" />
                                                    <span className="truncate max-w-[80px]">{booking.to}</span>
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <FaCalendarAlt className="mr-1 w-3 h-3" />
                                                    {booking.departureDateTime ? formatDate(booking.departureDateTime) : 'N/A'}
                                                </div>
                                                <div className="text-xs">
                                                    <span className={`px-2 py-0.5 rounded-full ${getTransportColor(booking.transportType)}`}>
                                                        {booking.transportType || 'Transport'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="text-lg font-bold text-green-600">
                                                    ৳{booking.totalPrice}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {booking.quantity} ticket{booking.quantity !== 1 ? 's' : ''}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ৳{booking.pricePerTicket || Math.round(booking.totalPrice / booking.quantity)} each
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            {getStatusBadge(booking.status)}
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => viewBookingDetails(booking)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 dark:bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                                >
                                                    <FaEye className="mr-1" />
                                                    View
                                                </button>

                                                {booking.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking, 'accepted')}
                                                            disabled={actionLoading}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 dark:bg-green-900 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                                                        >
                                                            <FaCheck className="mr-1" />
                                                            Accept
                                                        </button>

                                                        <button
                                                            onClick={() => handleUpdateStatus(booking, 'cancelled')}
                                                            disabled={actionLoading}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 dark:bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                                                        >
                                                            <FaTimes className="mr-1" />
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}

                                                {booking.status === 'accepted' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking, 'cancelled')}
                                                        disabled={actionLoading}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 dark:bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                                                    >
                                                        <FaTimes className="mr-1" />
                                                        Cancel
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

            {/* Booking Details Modal */}
            {isModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="fixed inset-0 bg-black/80 bg-opacity-50"
                        onClick={() => {
                            setIsModalOpen(false);
                            setSelectedBooking(null);
                        }}
                    ></div>

                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto dark:text-white">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-primary text-primary-content rounded-lg mr-3">
                                        <FaReceipt className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Details</h3>
                                        <p className="text-gray-600 text-sm dark:text-gray-300">Complete information about this booking</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setSelectedBooking(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div className="bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                            <FaRoute className="text-primary dark:text-blue-400" />
                                            Travel Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-300">From:</span>
                                                <span className="font-semibold flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-green-500" />
                                                    {selectedBooking.from}
                                                </span>
                                            </div>
                                            <div className="flex justify-center">
                                                <ArrowRightIcon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-300">To:</span>
                                                <span className="font-semibold flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-red-500" />
                                                    {selectedBooking.to}
                                                </span>
                                            </div>
                                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-300">Transport:</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTransportColor(selectedBooking.transportType)}`}>
                                                        {selectedBooking.transportType}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-base-200 dark:bg-gray-700 border border-base-300 dark:border-gray-600 rounded-xl p-4">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                            <FaTicketAlt className="text-secondary dark:text-blue-400" />
                                            Booking Information
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-300">Booking Reference:</span>
                                                <span className="font-mono font-bold text-primary">#{selectedBooking.bookingReference}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-300">Ticket Title:</span>
                                                <span className="font-semibold text-right">{selectedBooking.ticketTitle}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-300">Departure:</span>
                                                <span className="font-semibold">{formatDate(selectedBooking.departureDateTime)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                                                {getStatusBadge(selectedBooking.status)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div className="bg-linear-to-r dark:from-gray-800 dark:to-gray-900 from-success/10 to-emerald-100 border border-success/20 rounded-xl p-4">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                            <FaMoneyBill className="text-success" />
                                            Payment & Quantity
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                                                <div className="text-gray-600 dark:text-gray-300 text-sm">Total Amount</div>
                                                <div className="font-bold text-2xl text-success">৳{selectedBooking.totalPrice}</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-base-100 dark:bg-gray-600 p-3 rounded-lg">
                                                    <div className="text-gray-600 dark:text-gray-300 text-sm">Tickets</div>
                                                    <div className="font-bold text-xl flex items-center">
                                                        <FaUserFriends className="mr-2" />
                                                        {selectedBooking.quantity}
                                                    </div>
                                                </div>
                                                <div className="bg-base-100 dark:bg-gray-600 p-3 rounded-lg">
                                                    <div className="text-gray-600 dark:text-gray-300 text-sm">Per Ticket</div>
                                                    <div className="font-bold text-xl text-primary">
                                                        ৳{selectedBooking.pricePerTicket || Math.round(selectedBooking.totalPrice / selectedBooking.quantity)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-base-200 border border-base-300 rounded-xl p-4">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                            <FaUser className="text-warning" />
                                            User Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="shrink-0 h-12 w-12 bg-linear-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                    {selectedBooking.userName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{selectedBooking.userName}</div>
                                                    <div className="text-sm text-gray-500">{selectedBooking.userEmail}</div>
                                                </div>
                                            </div>
                                            <div className="space-y-2 pt-2 border-t border-base-300">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">User ID:</span>
                                                    <span className="text-xs font-mono">{selectedBooking.userId}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Booked On:</span>
                                                    <span className="flex items-center gap-1">
                                                        <FaCalendarAlt className="w-4 h-4" />
                                                        {formatDate(selectedBooking.bookingDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end items-center w-full pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setSelectedBooking(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                                >
                                    Close
                                </button>

                                {selectedBooking.status === 'pending' && (
                                    <div className="flex gap-3 ml-3">
                                        <button
                                            onClick={() => handleUpdateStatus(selectedBooking, 'cancelled')}
                                            disabled={actionLoading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition"
                                        >
                                            {actionLoading ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                <>
                                                    <FaTimes className="inline mr-1" />
                                                    Cancel Booking
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedBooking, 'accepted')}
                                            disabled={actionLoading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition"
                                        >
                                            {actionLoading ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                <>
                                                    <FaCheck className="inline mr-1" />
                                                    Accept Booking
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsRequest;