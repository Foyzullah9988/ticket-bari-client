import React, { use, useState } from 'react';
import { FaCheck, FaTimes, FaEye, FaFilter, FaSearch, FaDownload, FaSync, FaUser, FaCalendar, FaTicketAlt, FaMoneyBill, FaMapMarkerAlt, FaRoute, FaClock, FaCalendarAlt, FaTag, FaStore } from 'react-icons/fa';
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
                    <div className="badge badge-success gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-sm whitespace-nowrap">
                        <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-semibold">Approved</span>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="badge badge-error gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-sm whitespace-nowrap">
                        <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-semibold">Rejected</span>
                    </div>
                );
            case 'pending':
                return (
                    <div className="badge badge-warning gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm animate-pulse whitespace-nowrap">
                        <FaClock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-semibold">Pending</span>
                    </div>
                );
            default:
                return (
                    <div className="badge badge-neutral gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap">
                        <span className="font-semibold">Unknown</span>
                    </div>
                );
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Bus':
                return 'badge badge-primary gap-1 text-xs px-2 py-1';
            case 'Train':
                return 'badge badge-secondary gap-1 text-xs px-2 py-1';
            case 'Flight':
                return 'badge badge-accent gap-1 text-xs px-2 py-1';
            case 'Ferry':
                return 'badge badge-info gap-1 text-xs px-2 py-1';
            default:
                return 'badge badge-ghost gap-1 text-xs px-2 py-1';
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



    return (
        <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-linear-to-r from-primary/10 to-secondary/10 rounded-lg sm:rounded-xl">
                <div className="w-full">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <div className="p-1.5 sm:p-2.5 bg-primary text-primary-content rounded-lg">
                            <FaTicketAlt className="text-lg sm:text-xl" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">Manage Tickets</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                                Review and manage tickets submitted by vendors
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5 sm:mt-0">
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

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 border border-base-300">
                    <div className="card-body p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">Total Tickets</p>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{tickets.length}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">From all vendors</p>
                            </div>
                            <div className="p-1.5 sm:p-2.5 bg-primary/20 rounded-lg">
                                <FaTicketAlt className="text-primary text-base sm:text-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 border border-base-300">
                    <div className="card-body p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">Pending Review</p>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-warning">
                                    {tickets.filter(t => t.verificationStatus === 'pending').length}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Awaiting approval</p>
                            </div>
                            <div className="p-1.5 sm:p-2.5 bg-warning/20 rounded-lg">
                                <FaClock className="text-warning text-base sm:text-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 border border-base-300">
                    <div className="card-body p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">Approved</p>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-success">
                                    {tickets.filter(t => t.verificationStatus === 'approved').length}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Visible to users</p>
                            </div>
                            <div className="p-1.5 sm:p-2.5 bg-success/20 rounded-lg">
                                <FaCheck className="text-success text-base sm:text-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 border border-base-300">
                    <div className="card-body p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">Rejected</p>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-error">
                                    {tickets.filter(t => t.verificationStatus === 'rejected').length}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Not visible</p>
                            </div>
                            <div className="p-1.5 sm:p-2.5 bg-error/20 rounded-lg">
                                <FaTimes className="text-error text-base sm:text-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card bg-base-100 shadow border border-base-300">
                <div className="card-body p-3 sm:p-4">
                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-start lg:items-center">
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    className="input input-bordered w-full pl-9 pr-8 py-2 text-sm focus:ring-2 focus:ring-primary/30 border"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-xs btn-circle btn-ghost"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                            <div className="form-control w-full sm:w-auto">
                                <label className="label py-1">
                                    <span className="label-text font-semibold text-xs">Filter by Status</span>
                                </label>
                                <select
                                    className="select select-bordered w-full text-sm"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="form-control self-end">
                                <button
                                    className="btn btn-outline btn-error gap-1.5 text-xs px-2 sm:px-3 py-2 h-auto"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                    }}
                                >
                                    <FaTimes className="w-3 h-3" />
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        <div className="badge badge-primary gap-1 text-xs px-1">
                            <FaTicketAlt className="w-3 h-3 " />
                            Total: {tickets.length}
                        </div>
                        <div className="badge badge-warning gap-1 text-xs px-1">
                            <FaFilter className="w-3 h-3" />
                            Filtered: {filteredTickets.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="card bg-base-100 shadow border border-base-300 overflow-hidden w-full">
                <div className="card-body p-0 w-full">
                    <div className="overflow-x-auto w-full">
                        <table className="table table-zebra text-sm w-full min-w-[800px]">
                            <thead>
                                <tr className="bg-base-300">
                                    <th className="font-semibold px-2 sm:px-3 py-2 whitespace-nowrap">Ticket ID</th>
                                    <th className="font-semibold px-2 sm:px-3 py-2 whitespace-nowrap">Ticket Details</th>
                                    <th className="font-semibold px-2 sm:px-3 py-2 whitespace-nowrap">Vendor</th>
                                    <th className="font-semibold px-2 sm:px-3 py-2 whitespace-nowrap">Price & Quantity</th>
                                    <th className="font-semibold px-2 sm:px-3 py-2 whitespace-nowrap">Date & Time</th>
                                    <th className="font-semibold px-2 sm:px-3 py-2 whitespace-nowrap">Status</th>
                                    <th className="font-semibold px-2 sm:px-3 py-2 whitespace-nowrap text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.length === 0 ? (
                                    <div className='flex'>
                                        <tr className="flex w-52 flex-col gap-4 p-4">
                                            <div className="skeleton h-2 w-full"></div>
                                            <div className="skeleton h-2 w-full"></div>
                                        </tr>
                                        <tr className="flex w-52 flex-col gap-4 p-4">
                                            <div className="skeleton h-2 w-full"></div>
                                            <div className="skeleton h-2 w-full"></div>
                                        </tr>
                                        <tr className="flex w-52 flex-col gap-4 p-4">
                                            <div className="skeleton h-2 w-full"></div>
                                            <div className="skeleton h-2 w-full"></div>
                                        </tr>
                                        <tr className="flex w-52 flex-col gap-4 p-4">
                                            <div className="skeleton h-2 w-full"></div>
                                            <div className="skeleton h-2 w-full"></div>
                                        </tr>
                                        <tr className="flex w-52 flex-col gap-4 p-4">
                                            <div className="skeleton h-2 w-full"></div>
                                            <div className="skeleton h-2 w-full"></div>
                                        </tr>
                                        <tr className="flex w-52 flex-col gap-4 p-4">
                                            <div className="skeleton h-2 w-full"></div>
                                            <div className="skeleton h-2 w-full"></div>
                                        </tr>
                                        

                                       

                                    </div>
                                ) : (
                                    filteredTickets.map((ticket) => (
                                        <tr key={ticket._id} className="hover:bg-base-200/50 transition-colors duration-200 group">
                                            <td className="px-2 sm:px-3 py-2">
                                                <div className="font-mono font-bold text-primary bg-primary/10 px-1.5 sm:px-2 py-1 rounded text-xs sm:text-sm">
                                                    #{ticket._id?.slice(-6)}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                                    <FaCalendarAlt className="w-2.5 h-2.5" />
                                                    {ticket.createdAt ?
                                                        new Date(ticket.createdAt).toLocaleDateString() :
                                                        'N/A'
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1 text-xs sm:text-sm">
                                                    <FaTag className="text-primary w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                    <span className="truncate max-w-20 sm:max-w-[120px] md:max-w-[180px]">{ticket.title}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-1">
                                                    <span className={getCategoryColor(ticket.category)}>
                                                        <FaRoute className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                                                        {ticket.category || 'Transport'}
                                                    </span>
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-base-200 rounded text-xs">
                                                        <FaMapMarkerAlt className="text-success w-2 h-2" />
                                                        <span className="font-medium truncate max-w-10 sm:max-w-[60px]">{ticket.from}</span>
                                                        <ArrowRightIcon className="w-2.5 h-2.5 text-gray-400 mx-0.5" />
                                                        <FaMapMarkerAlt className="text-error w-2 h-2" />
                                                        <span className="font-medium truncate max-w-10 sm:max-w-[60px]">{ticket.to}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <div className="avatar placeholder">
                                                        <div className="rounded-full w-6 sm:w-8">
                                                            <img src={user?.photoURL} alt="" className='object-cover w-full h-full' />
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-semibold flex items-center gap-0.5 text-xs sm:text-sm">
                                                            <FaStore className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-secondary" />
                                                            <span className="truncate max-w-[60px] sm:max-w-20">{getVendorName(ticket)}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[60px] sm:max-w-20">
                                                            {getVendorEmail(ticket)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                                                    <FaMoneyBill className="text-success text-base sm:text-lg" />
                                                    <span className="font-bold text-base sm:text-lg text-success">${ticket.price}</span>
                                                </div>
                                                <div className="text-xs sm:text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Total: </span>
                                                    <span className="font-semibold">{ticket.quantity}</span>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        📦 {ticket.availableQuantity} available
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <div className="flex items-center gap-1 sm:gap-1.5">
                                                    <FaCalendar className="text-primary text-sm sm:text-base" />
                                                    <div>
                                                        <div className="font-semibold text-xs sm:text-sm">
                                                            {ticket.departureDateTime ?
                                                                new Date(ticket.departureDateTime).toLocaleDateString() :
                                                                'Not specified'
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                                                            <FaClock className="w-2 h-2" />
                                                            {ticket.departureDateTime ?
                                                                new Date(ticket.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                                                ''
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                {getStatusBadge(ticket.verificationStatus)}
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        onClick={() => viewTicketDetails(ticket)}
                                                        className="btn btn-xs btn-info btn-outline gap-1 text-xs px-1.5 sm:px-2 py-1 h-auto"
                                                    >
                                                        <FaEye className="w-2.5 h-2.5" />
                                                        <span className="hidden xs:inline">View</span>
                                                    </button>
                                                    <div className="flex gap-0.5 sm:gap-1">
                                                        <button
                                                            onClick={() => handleApprove(ticket)}
                                                            disabled={ticket.verificationStatus === 'approved'}
                                                            className={`btn btn-xs flex-1 gap-0.5 text-xs px-1 sm:px-1.5 py-1 h-auto ${ticket.verificationStatus === 'approved' ? 'btn-success' : 'btn-outline btn-success hover:btn-success'}`}
                                                        >
                                                            <FaCheck className="w-2.5 h-2.5" />
                                                            <span className="hidden sm:inline">{ticket.verificationStatus === 'approved' ? 'Approved' : 'Approve'}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(ticket)}
                                                            disabled={ticket.verificationStatus === 'rejected' || ticket.verificationStatus === 'approved'}
                                                            className={`btn btn-xs flex-1 gap-0.5 text-xs px-1 sm:px-1.5 py-1 h-auto ${ticket.verificationStatus === 'rejected' ? 'btn-error' : 'btn-outline btn-error hover:btn-error'}`}
                                                        >
                                                            <FaTimes className="w-2.5 h-2.5" />
                                                            <span className="hidden sm:inline">{ticket.verificationStatus === 'rejected' ? 'Rejected' : 'Reject'}</span>
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
                    <div className="modal-box max-w-full w-full h-full max-h-screen rounded-none lg:rounded-xl lg:max-w-4xl lg:h-auto lg:max-h-[90vh] overflow-y-auto p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-base-300">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="p-1.5 sm:p-2 bg-primary text-primary-content rounded-lg">
                                    <FaTicketAlt className="text-lg sm:text-xl" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate">Ticket Details</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs">Complete information about this ticket</p>
                                </div>
                            </div>
                            <button
                                className="btn btn-xs btn-circle btn-ghost"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedTicket(null);
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
                                        <div className="space-y-1.5 sm:space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">From:</span>
                                                <span className="font-semibold text-sm sm:text-base flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-success w-3 h-3" />
                                                    <span className="truncate max-w-[100px] sm:max-w-full">{selectedTicket.from}</span>
                                                </span>
                                            </div>
                                            <div className="flex justify-center my-0.5 sm:my-1">
                                                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">To:</span>
                                                <span className="font-semibold text-sm sm:text-base flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-error w-3 h-3" />
                                                    <span className="truncate max-w-[100px] sm:max-w-full">{selectedTicket.to}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ticket Information */}
                                <div className="card bg-base-200 border border-base-300">
                                    <div className="card-body p-2.5 sm:p-3">
                                        <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1">
                                            <FaTicketAlt className="text-secondary" />
                                            Ticket Information
                                        </h4>
                                        <div className="space-y-1.5 sm:space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Ticket ID:</span>
                                                <span className="font-mono font-bold text-primary text-xs">#{selectedTicket._id}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Name:</span>
                                                <span className="font-semibold text-xs sm:text-sm truncate max-w-[100px] sm:max-w-full">{selectedTicket.title}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Category:</span>
                                                <span className={getCategoryColor(selectedTicket.category)}>
                                                    {selectedTicket.category || 'Transport'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Status:</span>
                                                {getStatusBadge(selectedTicket.verificationStatus)}
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
                                        <div className="space-y-1.5 sm:space-y-2">
                                            <div className="flex justify-between items-center bg-white dark:bg-base-300 p-1.5 sm:p-2 rounded">
                                                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Price per ticket:</span>
                                                <span className="font-bold text-lg sm:text-xl text-success">${selectedTicket.price}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                                                <div className="bg-base-100 p-1.5 sm:p-2 rounded">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Quantity</p>
                                                    <p className="font-bold text-base sm:text-lg">{selectedTicket.quantity}</p>
                                                </div>
                                                <div className="bg-base-100 p-1.5 sm:p-2 rounded">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                                                    <p className="font-bold text-base sm:text-lg text-primary">{selectedTicket.availableQuantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vendor Information */}
                                <div className="card bg-base-200 border border-base-300">
                                    <div className="card-body p-2.5 sm:p-3">
                                        <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1">
                                            <FaStore className="text-warning" />
                                            Vendor Information
                                        </h4>
                                        <div className="space-y-1.5 sm:space-y-2">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <div className="avatar placeholder">
                                                    <div className="bg-primary text-primary-content rounded-full w-8 sm:w-10">
                                                        <img src={user.photoURL} alt="" className="object-cover w-full h-full" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-xs sm:text-sm truncate">{getVendorName(selectedTicket)}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{getVendorEmail(selectedTicket)}</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Created:</span>
                                                <span className="flex items-center gap-0.5 text-xs">
                                                    <FaCalendarAlt className="w-2.5 h-2.5" />
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

                        <div className="modal-action flex-col sm:flex-row gap-1.5 sm:gap-2">
                            <button
                                className="btn btn-outline hover:btn-error w-full sm:w-auto order-2 sm:order-1 text-xs sm:text-sm px-2 sm:px-3 py-1.5 h-auto"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedTicket(null);
                                }}
                            >
                                Close
                            </button>
                            {selectedTicket.verificationStatus === 'pending' && (
                                <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto order-1 sm:order-2">
                                    <button
                                        onClick={() => handleReject(selectedTicket)}
                                        className="btn btn-error gap-1 hover:scale-105 transition-transform flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5 h-auto"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : (
                                            <FaTimes className="w-3 h-3" />
                                        )}
                                        <span className="hidden sm:inline">Reject Ticket</span>
                                        <span className="sm:hidden">Reject</span>
                                    </button>
                                    <button
                                        onClick={() => handleApprove(selectedTicket)}
                                        className="btn btn-success gap-1 hover:scale-105 transition-transform flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5 h-auto"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : (
                                            <FaCheck className="w-3 h-3" />
                                        )}
                                        <span className="hidden sm:inline">Approve Ticket</span>
                                        <span className="sm:hidden">Approve</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => {
                        setIsModalOpen(false);
                        setSelectedTicket(null);
                    }}></div>
                </div>
            )}
        </div>
    );
};

export default ManageTickets;