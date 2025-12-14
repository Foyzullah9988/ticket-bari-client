import React, { use, useState } from 'react';
import { FaCheck, FaTimes, FaEye, FaFilter, FaSearch, FaDownload, FaSync, FaUser, FaCalendar, FaTicketAlt, FaMoneyBill, FaMapMarkerAlt, FaRoute, FaClock, FaCalendarAlt, FaTag, FaStore } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthContext';

const ManageTickets = () => {
    const { user } = use(AuthContext)
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ isOpen: false, type: '', ticketId: '', ticketName: '' });
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch all tickets
    const { data: tickets = [], isLoading, refetch } = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets');
            return res.data;
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
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
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
                    <div className="badge badge-success gap-2 px-4 py-3 shadow-sm">
                        <FaCheck className="w-4 h-4" />
                        <span className="font-semibold">Approved</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="badge badge-error gap-2 px-4 py-3 shadow-sm">
                        <FaTimes className="w-4 h-4" />
                        <span className="font-semibold">Rejected</span>
                    </div>
                );
            case 'pending':
                return (
                    <div className="badge badge-warning gap-2 px-4 py-3 shadow-sm animate-pulse">
                        <FaClock className="w-4 h-4" />
                        <span className="font-semibold">Pending</span>
                    </div>
                );
            default:
                return (
                    <div className="badge badge-neutral gap-2 px-4 py-3">
                        <span className="font-semibold">Unknown</span>
                    </div>
                );
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Bus':
                return 'badge badge-primary gap-2';
            case 'Train':
                return 'badge badge-secondary gap-2';
            case 'Flight':
                return 'badge badge-accent gap-2';
            case 'Ferry':
                return 'badge badge-info gap-2';
            default:
                return 'badge badge-ghost gap-2';
        }
    };



    // Get vendor name from ticket object
    const getVendorName = (ticket) => {
        if (ticket.vendorName) return ticket.vendorName;
        return 'Vendor';
    };

    // Get vendor email from ticket object
    const getVendorEmail = (ticket) => {
        if (ticket.vendorEmail) return ticket.vendorEmail;
        return 'Email not available';
    };

    const exportToCSV = () => {
        const headers = ['Ticket ID', 'Name', 'Vendor', 'Category', 'From', 'To', 'Price', 'Quantity', 'Status', 'Date'];
        const csvData = filteredTickets.map(ticket => [
            ticket._id || ticket.title,
            getVendorName(ticket),
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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
                <div className="relative">
                    <div className="loading loading-spinner loading-lg text-primary mb-6"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaTicketAlt className="text-primary text-xl opacity-50" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 mt-4">Loading Tickets</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    Fetching all vendor tickets from the database...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary text-primary-content rounded-xl">
                            <FaTicketAlt className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Tickets</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                                Review and manage tickets submitted by vendors
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => refetch()}
                        className="btn btn-primary btn-outline gap-2 shadow-sm hover:shadow-md transition-all"
                    >
                        <FaSync className={`${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="btn btn-success gap-2 shadow-sm hover:shadow-md transition-all"
                        disabled={filteredTickets.length === 0}
                    >
                        <FaDownload />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
                    <div className="card-body p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Tickets</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{tickets.length}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">From all vendors</p>
                            </div>
                            <div className="p-3 bg-primary/20 rounded-xl">
                                <FaTicketAlt className="text-primary text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
                    <div className="card-body p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending Review</p>
                                <p className="text-3xl font-bold text-warning">
                                    {tickets.filter(t => t.verificationStatus === 'pending').length}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Awaiting approval</p>
                            </div>
                            <div className="p-3 bg-warning/20 rounded-xl">
                                <FaClock className="text-warning text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
                    <div className="card-body p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Approved</p>
                                <p className="text-3xl font-bold text-success">
                                    {tickets.filter(t => t.verificationStatus === 'approved').length}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Visible to users</p>
                            </div>
                            <div className="p-3 bg-success/20 rounded-xl">
                                <FaCheck className="text-success text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
                    <div className="card-body p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Rejected</p>
                                <p className="text-3xl font-bold text-error">
                                    {tickets.filter(t => t.verificationStatus === 'rejected').length}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not visible</p>
                            </div>
                            <div className="p-3 bg-error/20 rounded-xl">
                                <FaTimes className="text-error text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                <input
                                    type="text"
                                    placeholder="🔍 Search tickets by name, route, vendor, or ID..."
                                    className="input input-bordered w-full pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary/30"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-xs btn-circle btn-ghost"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Filter by Status</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">📋 All Status</option>
                                    <option value="pending">⏳ Pending</option>
                                    <option value="approved">✅ Approved</option>
                                    <option value="rejected">❌ Rejected</option>
                                </select>
                            </div>
                            <div className="form-control self-end">
                                <button
                                    className="btn btn-outline btn-error gap-2"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                    }}
                                >
                                    <FaTimes />
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <div className="badge badge-primary gap-1">
                            <FaTicketAlt className="w-3 h-3" />
                            Total: {tickets.length}
                        </div>
                        <div className="badge badge-warning gap-1">
                            <FaFilter className="w-3 h-3" />
                            Filtered: {filteredTickets.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="card bg-base-100 shadow-lg border border-base-300 overflow-hidden">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr className="bg-base-300">
                                    <th className="font-semibold text-base">Ticket ID</th>
                                    <th className="font-semibold text-base">Ticket Details</th>
                                    <th className="font-semibold text-base">Vendor</th>
                                    <th className="font-semibold text-base">Price & Quantity</th>
                                    <th className="font-semibold text-base">Date & Time</th>
                                    <th className="font-semibold text-base">Status</th>
                                    <th className="font-semibold text-base text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8">
                                                <div className="p-4 bg-base-200 rounded-full mb-4">
                                                    <FaFilter className="text-4xl opacity-50" />
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2">No Tickets Found</h3>
                                                <p className="max-w-md text-center mb-4">
                                                    No vendor tickets match your search criteria. Try adjusting your filters or search term.
                                                </p>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                        setStatusFilter('all');
                                                    }}
                                                >
                                                    Reset Filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTickets.map((ticket) => (
                                        <tr key={ticket._id} className="hover:bg-base-200/50 transition-colors duration-200 group">
                                            <td>
                                                <div className="font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg inline-block">
                                                    #{ticket._id?.slice(-6)}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                                                    <FaCalendarAlt className="w-3 h-3" />
                                                    {ticket.createdAt ?
                                                        new Date(ticket.createdAt).toLocaleDateString() :
                                                        'N/A'
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                    <FaTag className="text-primary" />
                                                    {ticket.title}
                                                </div>
                                                {/* <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate max-w-xs">
                                                    {ticket.description || 'No description available'}
                                                </div> */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={getCategoryColor(ticket.category)}>
                                                        <FaRoute className="w-3 h-3" />
                                                        {ticket.category || 'Transport'}
                                                    </span>
                                                    <div className="flex items-center gap-1 px-2 py-1 bg-base-200 rounded-lg">
                                                        <FaMapMarkerAlt className="text-success w-3 h-3" />
                                                        <span className="font-medium">{ticket.from}</span>
                                                        <ArrowRightIcon className="w-4 h-4 text-gray-400 mx-1" />
                                                        <FaMapMarkerAlt className="text-error w-3 h-3" />
                                                        <span className="font-medium">{ticket.to}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className=" rounded-full w-10">
                                                            <img src={user?.photoURL} alt="" className='object-cover' />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold flex items-center gap-1">
                                                            <FaStore className="w-3 h-3 text-secondary" />
                                                            {getVendorName(ticket)}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {getVendorEmail(ticket)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FaMoneyBill className="text-success text-xl" />
                                                    <span className="font-bold text-xl text-success">${ticket.price}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Total: </span>
                                                    <span className="font-semibold">{ticket.quantity}</span>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        📦 {ticket.availableQuantity} available
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <FaCalendar className="text-primary text-lg" />
                                                    <div>
                                                        <div className="font-semibold">
                                                            {ticket.departureDateTime ?
                                                                new Date(ticket.departureDateTime).toLocaleDateString() :
                                                                'Not specified'
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <FaClock className="w-3 h-3" />
                                                            {ticket.departureDateTime ?
                                                                new Date(ticket.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                                                ''
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {getStatusBadge(ticket.verificationStatus)}
                                            </td>
                                            <td>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => viewTicketDetails(ticket)}
                                                        className="btn btn-sm btn-info btn-outline gap-2 hover:gap-3 transition-all"
                                                    >
                                                        <FaEye />
                                                        View Details
                                                    </button>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(ticket)}
                                                            disabled={ticket.verificationStatus === 'approved'}
                                                            className={`btn btn-sm flex-1 gap-2 ${ticket.verificationStatus === 'approved' ? 'btn-success' : 'btn-outline btn-success hover:btn-success'}`}
                                                        >
                                                            <FaCheck />
                                                            {ticket.verificationStatus === 'approved' ? '✅ Approved' : 'Approve'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(ticket)}
                                                            disabled={ticket.verificationStatus === 'rejected'}
                                                            className={`btn btn-sm flex-1 gap-2 ${ticket.verificationStatus === 'rejected' ? 'btn-error' : 'btn-outline btn-error hover:btn-error'}`}
                                                        >
                                                            <FaTimes />
                                                            {ticket.verificationStatus === 'rejected' ? '❌ Rejected' : 'Reject'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Ticket Details Modal */}
            {isModalOpen && selectedTicket && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-5xl bg-base-100 shadow-2xl">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary text-primary-content rounded-xl">
                                    <FaTicketAlt className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl text-gray-900 dark:text-white">Ticket Details</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">Complete information about this ticket</p>
                                </div>
                            </div>
                            <button
                                className="btn btn-sm btn-circle btn-ghost"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedTicket(null);
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {/* Route Information */}
                                <div className="card bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20">
                                    <div className="card-body p-5">
                                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <FaRoute className="text-primary" />
                                            Route Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">From:</span>
                                                <span className="font-semibold text-lg flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-success" />
                                                    {selectedTicket.from}
                                                </span>
                                            </div>
                                            <div className="flex justify-center my-2">
                                                <ArrowRightIcon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">To:</span>
                                                <span className="font-semibold text-lg flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-error" />
                                                    {selectedTicket.to}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ticket Information */}
                                <div className="card bg-base-200 border border-base-300">
                                    <div className="card-body p-5">
                                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <FaTicketAlt className="text-secondary" />
                                            Ticket Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Ticket ID:</span>
                                                <span className="font-mono font-bold text-primary">#{selectedTicket._id?.slice(-8)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                                                <span className="font-semibold">{selectedTicket.title}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Category:</span>
                                                <span className={getCategoryColor(selectedTicket.category)}>
                                                    {selectedTicket.category || 'Transport'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                                {getStatusBadge(selectedTicket.verificationStatus)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {/* Pricing Information */}
                                <div className="card bg-linear-to-r from-success/10 to-emerald-100 dark:from-success/20 dark:to-success/5 border border-success/20">
                                    <div className="card-body p-5">
                                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <FaMoneyBill className="text-success" />
                                            Pricing & Availability
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center bg-white dark:bg-base-300 p-3 rounded-lg">
                                                <span className="text-gray-600 dark:text-gray-400">Price per ticket:</span>
                                                <span className="font-bold text-2xl text-success">${selectedTicket.price}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-base-100 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Quantity</p>
                                                    <p className="font-bold text-xl">{selectedTicket.quantity}</p>
                                                </div>
                                                <div className="bg-base-100 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
                                                    <p className="font-bold text-xl text-primary">{selectedTicket.availableQuantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vendor Information */}
                                <div className="card bg-base-200 border border-base-300">
                                    <div className="card-body p-5">
                                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <FaStore className="text-warning" />
                                            Vendor Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-primary text-primary-content rounded-full w-12">
                                                         <img src={user.photoURL} alt="" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-lg">{getVendorName(selectedTicket)}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{getVendorEmail(selectedTicket)}</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                                <span className="flex items-center gap-1">
                                                    <FaCalendarAlt className="w-3 h-3" />
                                                    {selectedTicket.createdAt &&
                                                        new Date(selectedTicket.createdAt).toLocaleDateString()
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {/* <div className="card bg-base-200 border border-base-300 mb-8">
                            <div className="card-body p-5">
                                <h4 className="font-semibold text-lg mb-3">Description</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed p-3 bg-base-100 rounded-lg">
                                    {selectedTicket.description || 'No description available for this ticket.'}
                                </p>
                            </div>
                        </div> */}

                        <div className="modal-action">
                            <button
                                className="btn btn-outline hover:btn-error"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedTicket(null);
                                }}
                            >
                                Close
                            </button>
                            {selectedTicket.verificationStatus === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleReject(selectedTicket)}
                                        className="btn btn-error gap-2 hover:scale-105 transition-transform"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? (
                                            <span className="loading loading-spinner"></span>
                                        ) : (
                                            <FaTimes />
                                        )}
                                        Reject Ticket
                                    </button>
                                    <button
                                        onClick={() => handleApprove(selectedTicket)}
                                        className="btn btn-success gap-2 hover:scale-105 transition-transform"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? (
                                            <span className="loading loading-spinner"></span>
                                        ) : (
                                            <FaCheck />
                                        )}
                                        Approve Ticket
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => {
                        setIsModalOpen(false);
                        setSelectedTicket(null);
                    }}></div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmAction.isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box bg-base-100 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-full ${confirmAction.type === 'approve' ? 'bg-success/20' : 'bg-error/20'}`}>
                                {confirmAction.type === 'approve' ? (
                                    <FaCheck className="text-success text-2xl" />
                                ) : (
                                    <FaTimes className="text-error text-2xl" />
                                )}
                            </div>
                            <h3 className="font-bold text-xl">
                                {confirmAction.type === 'approve' ? 'Approve Ticket' : 'Reject Ticket'}
                            </h3>
                        </div>

                        <p className="py-4">
                            Are you sure you want to <span className={`font-bold ${confirmAction.type === 'approve' ? 'text-success' : 'text-error'}`}>
                                {confirmAction.type}
                            </span> the ticket
                            <span className="font-semibold text-primary ml-1">"{confirmAction.ticketName}"</span>?
                        </p>

                        <div className="modal-action">
                            <button
                                className="btn btn-outline"
                                onClick={() => setConfirmAction({ isOpen: false, type: '', ticketId: '', ticketName: '' })}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateStatus}
                                className={`btn gap-2 ${confirmAction.type === 'approve' ? 'btn-success' : 'btn-error'}`}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : confirmAction.type === 'approve' ? (
                                    <>
                                        <FaCheck />
                                        Yes, Approve
                                    </>
                                ) : (
                                    <>
                                        <FaTimes />
                                        Yes, Reject
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => !actionLoading && setConfirmAction({ isOpen: false, type: '', ticketId: '', ticketName: '' })}></div>
                </div>
            )}
        </div>
    );
};

export default ManageTickets;