import React, { use, useState } from 'react';
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
    FaExclamationCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';
import Loading from '../../../Components/Shared/Loading';

const ManageTickets = () => {
    const { user } = use(AuthContext)
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch all tickets
    const { data: tickets = [], isLoading, error, refetch } = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets');
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to load tickets');
        }
    });

    // Filter tickets based on search and status
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            searchTerm === '' ||
            ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ticket.vendorName)?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            ticket.verificationStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Handle approve button click with confirmation
    const handleApprove = (ticket) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to approve the ticket "${ticket.title}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, approve it!"
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus(ticket._id, 'approved');
            }
        });
    };

    // Handle reject button click with confirmation
    const handleReject = (ticket) => {
        if (ticket.verificationStatus === 'approved') return;

        Swal.fire({
            title: "Are you sure?",
            text: `You want to reject the ticket "${ticket.title}"?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, reject it!"
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus(ticket._id, 'rejected');
            }
        });
    };

    // Execute action after confirmation
    const updateStatus = (ticketId, verificationStatus) => {
        setActionLoading(true);
        const updateInfo = { verificationStatus: verificationStatus };

        axiosSecure.patch(`/tickets/${ticketId}`, updateInfo)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    setActionLoading(false);

                    // Update selectedTicket if modal is open
                    if (isModalOpen && selectedTicket && selectedTicket._id === ticketId) {
                        setSelectedTicket(prev => ({
                            ...prev,
                            verificationStatus: verificationStatus
                        }));
                    }

                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Ticket ${verificationStatus} successfully!`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    setActionLoading(false);
                    Swal.fire({
                        icon: "error",
                        title: "Update failed",
                        text: "No changes were made to the ticket."
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

    const viewTicketDetails = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const getStatusBadge = (verificationStatus) => {
        switch (verificationStatus) {
            case 'approved':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center bg-green-100 dark:bg-gray-600 text-green-800 dark:text-white">
                        <FaCheck className="mr-1" />
                        Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center bg-red-100 dark:bg-gray-600 text-red-800 dark:text-white">
                        <FaTimes className="mr-1" />
                        Rejected
                    </span>
                );
            case 'pending':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center bg-yellow-100 dark:bg-gray-600 text-yellow-800 dark:text-white animate-pulse">
                        <FaClock className="mr-1" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white">
                        <FaExclamationCircle className="mr-1" />
                        Unknown
                    </span>
                );
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Bus':
                return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300';
            case 'Train':
                return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300';
            case 'Flight':
                return 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-300';
            case 'Ferry':
                return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300';
            default:
                return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300';
        }
    };

    const exportToCSV = () => {
        const headers = ['Ticket ID', 'Name', 'Vendor', 'Category', 'From', 'To', 'Price', 'Quantity', 'Status', 'Date'];
        const csvData = filteredTickets.map(ticket => [
            ticket._id || ticket.title,
            ticket.vendorName,
            ticket.category,
            ticket.from,
            ticket.to,
            `$${ticket.price}`,
            ticket.quantity,
            ticket.verificationStatus,
            ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tickets_${new Date().toISOString().split('T')[0]}.csv`;
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

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6">
                <Loading />
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
                        <h3 className="text-lg font-semibold text-red-800">Error Loading Tickets</h3>
                    </div>
                    <p className="text-red-700 mt-2">
                        {error.response?.data?.error || 'Unable to load tickets. Please try again.'}
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
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 dark:text-white">Manage Tickets</h1>
                        <p className="text-gray-600 dark:text-gray-400">Review and manage tickets submitted by vendors</p>
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
                            disabled={filteredTickets.length === 0}
                        >
                            <FaDownload className="w-3 h-3" />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-linear-to-r dark:from-blue-900 dark:to-cyan-900 from-blue-500 to-cyan-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                        <div className="text-xl md:text-3xl font-bold mb-2">{tickets.length}</div>
                        <div className="text-sm opacity-90">Total Tickets</div>
                        <div className="text-xs opacity-80 mt-1">From all vendors</div>
                    </div>

                    <div className="bg-linear-to-r dark:from-yellow-900 dark:to-amber-900 from-yellow-500 to-amber-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                        <div className="text-xl md:text-3xl font-bold mb-2">
                            {tickets.filter(t => t.verificationStatus === 'pending').length}
                        </div>
                        <div className="text-sm opacity-90">Pending Review</div>
                        <div className="text-xs opacity-80 mt-1">Awaiting approval</div>
                    </div>

                    <div className="bg-linear-to-r dark:from-green-900 dark:to-emerald-900 from-green-500 to-emerald-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                        <div className="text-xl md:text-3xl font-bold mb-2">
                            {tickets.filter(t => t.verificationStatus === 'approved').length}
                        </div>
                        <div className="text-sm opacity-90">Approved</div>
                        <div className="text-xs opacity-80 mt-1">Visible to users</div>
                    </div>

                    <div className="bg-linear-to-r dark:from-red-900 dark:to-orange-900 from-red-500 to-orange-600 text-white rounded-xl p-4 md:p-6 shadow-lg">
                        <div className="text-xl md:text-3xl font-bold mb-2">
                            {tickets.filter(t => t.verificationStatus === 'rejected').length}
                        </div>
                        <div className="text-sm opacity-90">Rejected</div>
                        <div className="text-xs opacity-80 mt-1">Not visible</div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card bg-base-100 shadow border border-base-300 mb-6">
                <div className="card-body p-3 sm:p-4 ">
                    <div className="flex flex-col  gap-4 items-center  ">
                        <div className="flex-1 w-full ">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tickets by title, ID, or location"
                                    className="input border input-bordered w-full pl-12"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='flex justify-end items-center  w-full'>
                            <div className="flex gap-2">
                                <div className="dropdown dropdown-bottom">
                                    <label tabIndex={0} className="btn btn-outline gap-2">
                                        <FaFilter />
                                        Filter: {statusFilter === 'all' ? 'All' : statusFilter}
                                    </label>
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><button onClick={() => setStatusFilter('all')}>All Status</button></li>
                                        <li><button onClick={() => setStatusFilter('pending')}>Pending</button></li>
                                        <li><button onClick={() => setStatusFilter('approved')}>Approved</button></li>
                                        <li><button onClick={() => setStatusFilter('rejected')}>Rejected</button></li>
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
                            Total: <span className="font-semibold">{tickets.length}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                            Pending: <span className="font-semibold">{tickets.filter(t => t.verificationStatus === 'pending').length}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                            Approved: <span className="font-semibold">{tickets.filter(t => t.verificationStatus === 'approved').length}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                            Rejected: <span className="font-semibold">{tickets.filter(t => t.verificationStatus === 'rejected').length}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                            Filtered: <span className="font-semibold">{filteredTickets.length}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white dark:bg-base-200 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredTickets.length === 0 ? (
                    <div className="text-center py-12">
                        <FaSearch className="text-4xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No tickets found</h3>
                        <p className="text-gray-500">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter'
                                : 'No tickets in the system yet'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ticket Details
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vendor
                                    </th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price & Quantity
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
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket._id} className="hover:bg-base-100 transition-colors">
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="shrink-0 h-10 w-10 md:h-12 md:w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                                    <FaTicketAlt className="text-primary text-lg" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] md:max-w-none dark:text-white">
                                                        {ticket.title}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                        <FaMapMarkerAlt className="text-green-500 mr-1" />
                                                        <span className="truncate max-w-[100px]">{ticket.from}</span>
                                                        <ArrowRightIcon className="w-3 h-3 mx-1 text-gray-400" />
                                                        <FaMapMarkerAlt className="text-red-500 mr-1" />
                                                        <span className="truncate max-w-[100px]">{ticket.to}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        <span className={`px-2 py-0.5 rounded-full ${getCategoryColor(ticket.category)}`}>
                                                            {ticket.category || 'Transport'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="shrink-0 h-8 w-8">
                                                    <img
                                                        className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                                                        src={user?.photoURL}
                                                        alt={ticket.vendorName}
                                                    />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[100px] md:max-w-none dark:text-white">
                                                        {ticket.vendorName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            <div className="text-lg font-bold text-green-600">
                                                ${ticket.price}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Qty: {ticket.quantity}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Available: {ticket.availableQuantity}
                                            </div>
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            {getStatusBadge(ticket.verificationStatus)}
                                        </td>

                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => viewTicketDetails(ticket)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 dark:bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                                >
                                                    <FaEye className="mr-1" />
                                                    View
                                                </button>

                                                <button
                                                    onClick={() => handleApprove(ticket)}
                                                    disabled={ticket.verificationStatus === 'approved'}
                                                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 dark:bg-green-900 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ${ticket.verificationStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <FaCheck className="mr-1" />
                                                    {ticket.verificationStatus === 'approved' ? 'Approved' : 'Approve'}
                                                </button>

                                                <button
                                                    onClick={() => handleReject(ticket)}
                                                    disabled={ticket.verificationStatus === 'rejected' || ticket.verificationStatus === 'approved'}
                                                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 dark:bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ${ticket.verificationStatus === 'rejected' || ticket.verificationStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <FaTimes className="mr-1" />
                                                    {ticket.verificationStatus === 'rejected' ? 'Rejected' : 'Reject'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Ticket Details Modal */}
            {isModalOpen && selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="fixed inset-0 bg-black/80 bg-opacity-50"
                        onClick={() => {
                            setIsModalOpen(false);
                            setSelectedTicket(null);
                        }}
                    ></div>

                    <div className="relative bg-white dark:bg-gray-500 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto dark:text-white">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-primary text-primary-content rounded-lg mr-3">
                                        <FaTicketAlt className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ticket Details</h3>
                                        <p className="text-gray-600 text-sm dark:text-gray-300">Complete information about this ticket</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setSelectedTicket(null);
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
                                            Route Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-300">From:</span>
                                                <span className="font-semibold flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-green-500" />
                                                    {selectedTicket.from}
                                                </span>
                                            </div>
                                            <div className="flex justify-center">
                                                <ArrowRightIcon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-300 ">To:</span>
                                                <span className="font-semibold flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-red-500" />
                                                    {selectedTicket.to}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-base-200 dark:bg-gray-700 border border-base-300 dark:border-gray-600 rounded-xl p-4">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                            <FaTicketAlt className="text-secondary dark:text-blue-400" />
                                            Ticket Information
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-300">Ticket ID:</span>
                                                <span className="font-mono font-bold text-primary">#{selectedTicket._id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-300">Name:</span>
                                                <span className="font-semibold">{selectedTicket.title}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-300   ">Category:</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(selectedTicket.category)}`}>
                                                    {selectedTicket.category || 'Transport'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                                                {getStatusBadge(selectedTicket.verificationStatus)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div className="bg-linear-to-r dark:from-gray-800 dark:to-gray-900 from-success/10 to-emerald-100 border border-success/20 rounded-xl p-4">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                            <FaMoneyBill className="text-success" />
                                            Pricing & Availability
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                                                <div className="text-gray-600 dark:text-gray-300 text-sm">Price per ticket</div>
                                                <div className="font-bold text-2xl text-success">${selectedTicket.price}</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-base-100 dark:bg-gray-700 p-3 rounded-lg">
                                                    <div className="text-gray-600 dark:text-gray-300 text-sm">Total Quantity</div>
                                                    <div className="font-bold text-xl">{selectedTicket.quantity}</div>
                                                </div>
                                                <div className="bg-base-100 dark:bg-gray-700 p-3 rounded-lg">
                                                    <div className="text-gray-600 dark:text-gray-300 text-sm">Available</div>
                                                    <div className="font-bold text-xl text-primary">{selectedTicket.availableQuantity}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-base-200 border border-base-300 rounded-xl p-4">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                            <FaStore className="text-warning" />
                                            Vendor Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="shrink-0 h-12 w-12">
                                                    <img
                                                        className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                                                        src={user?.photoURL}
                                                        alt={selectedTicket.vendorName}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{selectedTicket.vendorName}</div>
                                                    <div className="text-sm text-gray-500">{selectedTicket.vendorEmail}</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-base-300">
                                                <span className="text-gray-600">Created:</span>
                                                <span className="flex items-center gap-1">
                                                    <FaCalendarAlt className="w-4 h-4" />
                                                    {selectedTicket.createdAt &&
                                                        new Date(selectedTicket.createdAt).toLocaleDateString()
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end items-center  w-full pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setSelectedTicket(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-red-700 dark:bg-gray-800 rounded-lg hover:bg-red-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                                >
                                    Close
                                </button>

                                {selectedTicket.verificationStatus === 'pending' && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleReject(selectedTicket)}
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
                                                    Reject Ticket
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleApprove(selectedTicket)}
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
                                                    Approve Ticket
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

export default ManageTickets;