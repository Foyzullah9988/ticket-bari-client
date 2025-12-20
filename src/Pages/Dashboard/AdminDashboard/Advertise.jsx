import React, { useState, useMemo } from 'react';
import { FaBullhorn, FaFilter, FaSearch, FaSync, FaTimes, FaCheck, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../../Components/Shared/Loading';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Skeleton1 from '../../../Components/Shared/Skeleton1';

const AdvertiseTickets = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [transportFilter, setTransportFilter] = useState('all');
    const [advertiseData, setAdvertiseData] = useState({
        duration: 7,
        priority: 'medium'
    });

    // Load all tickets with useQuery
    const {
        data: tickets = [],
        isLoading,
        isError,
        error,
        refetch: refetchTickets
    } = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets');
            return res.data;
        },
    });

    // Separate query for advertised tickets (if you have a specific endpoint)
    // Otherwise, filter from tickets data
    const { data: adTickets = [] } = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets');
            return res.data;
        },
        // If you don't have separate endpoint, comment this and use filtered data
        enabled: false, 
    });


    const advertisedTickets = adTickets.filter(ticket => ticket.isAdvertised);


    // If using filter approach instead of separate endpoint
    const approvedTickets = tickets.filter(ticket => ticket.verificationStatus === 'approved');


    // Filter tickets based on search and transport type
    const filteredTickets = approvedTickets.filter(ticket => {
        const matchesSearch =
            searchTerm === '' ||
            ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.to?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTransport =
            transportFilter === 'all' ||
            ticket.transportType === transportFilter;

        return matchesSearch && matchesTransport;
    });

    // Sort filtered tickets by createdAt (newest first)
    const sortedTickets = useMemo(() => {
        return [...filteredTickets].sort((a, b) => {
            // Use createdAt if available, otherwise use departureDateTime
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.departureDateTime);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.departureDateTime);
            return dateB - dateA; // Newest first (descending)
        });
    }, [filteredTickets]);

    // Sort advertised tickets by advertisedAt or createdAt (newest first)
    const sortedAdvertisedTickets = useMemo(() => {
        return [...advertisedTickets].sort((a, b) => {
            // Use advertisedAt if available, otherwise use createdAt or departureDateTime
            const dateA = a.advertisement?.advertisedAt 
                ? new Date(a.advertisement.advertisedAt) 
                : (a.createdAt ? new Date(a.createdAt) : new Date(a.departureDateTime));
            const dateB = b.advertisement?.advertisedAt 
                ? new Date(b.advertisement.advertisedAt) 
                : (b.createdAt ? new Date(b.createdAt) : new Date(b.departureDateTime));
            return dateB - dateA; // Newest first
        });
    }, [advertisedTickets]);

    // Mutation for advertising ticket
    const advertiseMutation = useMutation({
        mutationFn: async ({ ticketId, advertisementData }) => {
            const res = await axiosSecure.patch(`/tickets/${ticketId}`, advertisementData);
            return res.data;
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(['tickets']);
            toast.success('Ticket advertised successfully!');

            // Reset advertisement form
            setAdvertiseData({
                duration: 7,
                priority: 'medium'
            });
        },
        onError: (error) => {
            console.error('Advertisement error:', error);
            toast.error('Failed to advertise ticket');
        }
    });

    // Mutation for removing advertisement
    const removeAdMutation = useMutation({
        mutationFn: async ({ ticketId, advertisementData }) => {
            // Note: Use PATCH instead of POST
            const res = await axiosSecure.patch(`/tickets/${ticketId}`, advertisementData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tickets']);
            toast.success('Advertisement removed successfully!');
        },
        onError: (error) => {
            console.error('Remove advertisement error:', error);
            toast.error('Failed to remove advertisement');
        }
    });

    // Advertise ticket with custom data
    const advertiseTicket = (ticket) => {
        try {
            // Don't allow more than 6 tickets to be advertised
            if (sortedAdvertisedTickets.length >= 6) {
                toast.error('Maximum 6 tickets can be advertised at once');
                return;
            }

            // Prepare advertisement data
            const advertisementData = {
                isAdvertised: true,
                advertisement: {
                    duration: advertiseData.duration,
                    priority: advertiseData.priority,
                    advertisedAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + advertiseData.duration * 24 * 60 * 60 * 1000).toISOString()
                }
            };

            // Use mutation
            advertiseMutation.mutate({
                ticketId: ticket._id,
                advertisementData
            });
        } catch (error) {
            console.error('Advertisement error:', error);
            toast.error('Failed to advertise ticket');
        }
    };

    // Remove advertisement
    const removeAdvertisement = (ticket) => {
        try {
            const advertisementData = {
                isAdvertised: false,
                advertisement: null
            };

            // Use mutation
            removeAdMutation.mutate({
                ticketId: ticket._id,
                advertisementData
            });
        } catch (error) {
            console.error('Remove advertisement error:', error);
            toast.error('Failed to remove advertisement');
        }
    };

    // Handle advertisement form change
    const handleAdvertiseFormChange = (field, value) => {
        setAdvertiseData(prev => ({
            ...prev,
            [field]: value
        }));
    };



    if (isLoading) {
        return <div className='flex flex-col justify-center items-center gap-2'>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
        </div>;
    }

    if (isError) {
        return (
            <div className="p-8 text-center">
                <div className="text-error text-2xl mb-4">Error loading tickets</div>
                <p className="mb-4">{error?.message || 'Unknown error'}</p>
                <button
                    onClick={() => refetchTickets()}
                    className="btn btn-primary"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary text-primary-content rounded-xl">
                        <FaBullhorn className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl dark:text-white font-bold text-gray-800">Advertise Tickets</h1>
                        <p className="text-gray-600 dark:text-gray-400">Promote tickets on the homepage</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="stat">
                        <div className="stat-title text-sm">Advertised Tickets</div>
                        <div className="stat-value text-primary">{sortedAdvertisedTickets.length}/6</div>
                        <div className="stat-desc">
                            {sortedAdvertisedTickets.length >= 6 ? (
                                <span className="text-error">Maximum limit reached</span>
                            ) : (
                                <span className="text-success">Slots available</span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => refetchTickets()}
                        className="btn btn-primary gap-2"
                    >
                        <FaSync />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Summary Card */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-linear-to-r dark:from-blue-900 dark:to-cyan-900 from-blue-700 to-cyan-600 text-white rounded-xl p-4 md:p-6 shadow-lg relative">
                    <div className="text-xl md:text-3xl font-bold mb-2">{approvedTickets.length}</div>
                    <div className="text-sm opacity-90">Approved</div>
                    <div className="text-xs opacity-75 mt-1">Ready for ads</div>
                    <div className="absolute top-4 right-4 opacity-20">
                        <FaCheck className="text-3xl" />
                    </div>
                </div>

                <div className="bg-linear-to-r  dark:from-green-900 dark:to-emerald-900 from-green-500 to-emerald-600  text-white rounded-xl p-4 md:p-6 shadow-lg relative">
                    <div className="text-xl md:text-3xl font-bold mb-2">{sortedAdvertisedTickets.length}</div>
                    <div className="text-sm opacity-90">Active Ads</div>
                    <div className="text-xs opacity-75 mt-1">{6 - sortedAdvertisedTickets.length} slots</div>
                    <div className="absolute top-4 right-4 opacity-20">
                        <FaBullhorn className="text-3xl" />
                    </div>
                </div>

                <div className="bg-linear-to-r dark:from-purple-900 dark:to-violet-900 from-purple-500 to-violet-600 text-white rounded-xl p-4 md:p-6 shadow-lg relative">
                    <div className="text-xl md:text-3xl font-bold mb-2">{sortedTickets.length}</div>
                    <div className="text-sm opacity-90">Filtered</div>
                    <div className="text-xs opacity-75 mt-1">Search results</div>
                    <div className="absolute top-4 right-4 opacity-20">
                        <FaSearch className="text-3xl" />
                    </div>
                </div>

                <div className="bg-linear-to-r dark:from-amber-900 dark:to-orange-900 from-amber-500 to-orange-600 text-white rounded-xl p-4 md:p-6 shadow-lg relative">
                    <div className="text-xl md:text-3xl font-bold mb-2">{tickets.length - approvedTickets.length}</div>
                    <div className="text-sm opacity-90">Pending</div>
                    <div className="text-xs opacity-75 mt-1">Awaiting approval</div>
                    <div className="absolute top-4 right-4 opacity-20">
                        <FaClock className="text-3xl" />
                    </div>
                </div>
            </div>

            {/* Advertisement Configuration Card */}
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title">
                        <FaBullhorn className="text-primary" />
                        Advertisement Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">


                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Duration (Days)</span>
                            </label>
                            <select
                                className="select select-bordered"
                                value={advertiseData.duration}
                                onChange={(e) => handleAdvertiseFormChange('duration', parseInt(e.target.value))}
                            >
                                <option value={1}>1 Day</option>
                                <option value={3}>3 Days</option>
                                <option value={7}>7 Days</option>
                                <option value={14}>14 Days</option>
                                <option value={30}>30 Days</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Priority</span>
                            </label>
                            <select
                                className="select select-bordered"
                                value={advertiseData.priority}
                                onChange={(e) => handleAdvertiseFormChange('priority', e.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-info/10 rounded-lg">
                        <p className="text-sm">
                            <span className="font-bold">Note:</span> These settings will apply to the next ticket you advertise. You can advertise up to 6 tickets simultaneously.
                        </p>
                    </div>
                </div>
            </div>


            {/* Search and Filter */}
            <div className="card bg-base-100 shadow border border-base-300">
                <div className="card-body p-3 sm:p-4 ">
                    <div className="flex flex-col  gap-4 items-center  ">
                        <div className="flex-1 w-full ">
                            <div className="relative">
                                <FaSearch className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tickets by title, origin, or destination"
                                    className="input border input-bordered w-full md:pl-12 pl-10 "
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
                                        Filter: {transportFilter === 'all' ? 'All Transport' : transportFilter}
                                    </label>
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><button onClick={() => setTransportFilter('all')}>All Transport</button></li>
                                        <li><button onClick={() => setTransportFilter('Bus')}>Bus</button></li>
                                        <li><button onClick={() => setTransportFilter('Train')}>Train</button></li>
                                        <li><button onClick={() => setTransportFilter('Plane')}>Plane</button></li>
                                        <li><button onClick={() => setTransportFilter('Ship')}>Ship</button></li>
                                        <li><button onClick={() => setTransportFilter('Car')}>Car</button></li>
                                    </ul>
                                </div>
                                <button
                                    className="btn btn-outline btn-error gap-1.5 text-xs px-2 sm:px-3 py-2 h-auto"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setTransportFilter('all');
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Advertised Tickets Sidebar */}

                <div className="lg:col-span-1">

                    <div className="card bg-base-100 shadow sticky top-6">

                        <div className="card-body">

                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title">
                                    <FaBullhorn className="text-primary" />
                                    Active Advertisements
                                </h2>
                                <div className="badge badge-primary px-1">{sortedAdvertisedTickets.length}/6</div>
                            </div>


                            {sortedAdvertisedTickets.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-2">
                                        <FaBullhorn className="text-3xl mx-auto" />
                                    </div>
                                    <p className="text-gray-500">No active advertisements</p>
                                    <p className="text-sm text-gray-400 mt-2">Select tickets from the right panel to advertise</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {sortedAdvertisedTickets.map((ticket) => (
                                        <div key={ticket._id} className="card card-compact bg-linear-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 border border-primary/20">
                                            <div className="card-body">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">

                                                            <div className="badge badge-secondary badge-sm px-2">
                                                                {ticket.advertisement?.priority || 'medium'}
                                                            </div>
                                                        </div>
                                                        <h3 className="font-bold text-sm">{ticket.title}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs font-medium px-2 py-1 rounded bg-primary/20 text-primary ">
                                                                {ticket.transportType}
                                                            </span>
                                                            <span className="text-success font-bold">${ticket.price}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {ticket.from} → {ticket.to}
                                                        </p>
                                                        {ticket.advertisement?.expiresAt && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Expires: {new Date(ticket.advertisement.expiresAt).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removeAdvertisement(ticket)}
                                                        className="btn btn-error btn-xs btn-circle"
                                                        title="Remove advertisement"
                                                        disabled={removeAdMutation.isLoading}
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {sortedAdvertisedTickets.length > 0 && (
                                <div className="mt-4 p-3 bg-base-200 rounded-lg">
                                    <p className="text-sm">
                                        <span className="font-bold">Tip:</span> Click the X button to remove any advertisement.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* All Tickets Table */}
                <div className="lg:col-span-2">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body p-0">
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th className="font-bold">Ticket Details</th>
                                            <th className="font-bold">Transport</th>
                                            <th className="font-bold">Price & Stock</th>
                                            <th className="font-bold">Vendor</th>
                                            <th className="font-bold">Ad Status</th>
                                            <th className="font-bold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedTickets.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-8">
                                                    <div className="text-gray-500">
                                                        <FaSearch className="text-4xl mx-auto mb-2 opacity-50" />
                                                        <p>No tickets found</p>
                                                        <p className="text-sm mt-1">Try changing your search or filter</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            sortedTickets.map((ticket) => (
                                                <tr key={ticket._id} className="hover:bg-base-200/30 transition-colors">
                                                    <td>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="avatar">
                                                                <div className="mask mask-squircle w-14 h-14">
                                                                    <img
                                                                        src={ticket.image}
                                                                        alt={ticket.title}
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold">{ticket.title}</div>
                                                                <div className="text-sm opacity-70">
                                                                    {ticket.from} → {ticket.to}
                                                                </div>
                                                                <div className="text-xs opacity-50">
                                                                    {new Date(ticket.departureDateTime).toLocaleDateString()}
                                                                </div>
                                                                {/* Show createdAt if available */}
                                                                {ticket.createdAt && (
                                                                    <div className="text-xs text-gray-400 mt-1">
                                                                        Added: {new Date(ticket.createdAt).toLocaleDateString()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex flex-col items-start gap-1 ">
                                                            <span className={`badge ${ticket.transportType === 'Bus' ? 'badge-primary' :
                                                                ticket.transportType === 'Train' ? 'badge-secondary' :
                                                                    ticket.transportType === 'Plane' ? 'badge-accent' :
                                                                        ticket.transportType === 'Ship' ? 'badge-info' :
                                                                            'badge-warning'
                                                                } px-2`}>
                                                                {ticket.transportType}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex flex-col items-start gap-1">
                                                            <span className="font-bold text-success">${ticket.price}</span>
                                                            <div className="text-sm badge badge-ghost px-1.5">
                                                                {ticket.quantity} available
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div className="font-medium text-sm">{ticket.vendorName}</div>
                                                            <div className="text-xs opacity-50 truncate max-w-[120px]">
                                                                {ticket.vendorEmail}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={`px-2 badge gap-1 ${ticket.isAdvertised ? 'badge-success' : 'badge-neutral'}`}>
                                                            {ticket.isAdvertised ? (
                                                                <>
                                                                    <FaCheck className="text-xs" />
                                                                    Active
                                                                </>
                                                            ) : (
                                                                'Available'
                                                            )}
                                                        </div>

                                                    </td>
                                                    <td>
                                                        {ticket.isAdvertised ? (
                                                            <button
                                                                onClick={() => removeAdvertisement(ticket)}
                                                                className="btn btn-error btn-sm gap-1"
                                                                disabled={removeAdMutation.isLoading}
                                                            >
                                                                <FaTimes />
                                                                Remove
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => advertiseTicket(ticket)}
                                                                disabled={sortedAdvertisedTickets.length >= 6 || advertiseMutation.isLoading}
                                                                className={`btn btn-success btn-sm gap-1 ${sortedAdvertisedTickets.length >= 6 ? 'btn-disabled' : ''}`}
                                                            >
                                                                <FaBullhorn />
                                                                Advertise
                                                                {sortedAdvertisedTickets.length >= 6 && (
                                                                    <span className="tooltip" data-tip="Maximum limit reached"></span>
                                                                )}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default AdvertiseTickets;