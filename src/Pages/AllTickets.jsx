import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import TicketCard from './Home/TicketCard';
import Loading from '../Components/Shared/Loading';
import {
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaSortAmountUp,
    FaTimes,
    FaBus,
    FaTrain,
    FaPlane,
    FaShip,
    FaCar,
    FaMapMarkerAlt,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';

const AllTickets = () => {
    const axiosSecure = useAxiosSecure();

    // State variables for filtering, sorting, and pagination
    const [searchFrom, setSearchFrom] = useState('');
    const [searchTo, setSearchTo] = useState('');
    const [transportFilter, setTransportFilter] = useState('all');
    const [priceSort, setPriceSort] = useState(null);
    const [filteredTickets, setFilteredTickets] = useState([]);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [ticketsPerPage, setTicketsPerPage] = useState(6);

    // Fetch users
    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
        retry: 2,
    });

    // Fetch tickets
    const { data: tickets = [], isLoading } = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets');
            return res.data;
        },
        retry: 2,
    });

    // Apply all filters and sorting
    useEffect(() => {
        if (tickets.length > 0 && users.length > 0) {
            // Filter out fraud vendors
            const fraudEmails = users
                .filter(user => user.role === 'fraud')
                .map(user => user.email);

            // Start with all approved, non-fraud tickets
            let result = tickets.filter(ticket =>
                ticket.verificationStatus === 'approved' &&
                !fraudEmails.includes(ticket?.vendorEmail)
            );

            // Apply location search filters
            if (searchFrom) {
                result = result.filter(ticket =>
                    ticket.from?.toLowerCase().includes(searchFrom.toLowerCase())
                );
            }

            if (searchTo) {
                result = result.filter(ticket =>
                    ticket.to?.toLowerCase().includes(searchTo.toLowerCase())
                );
            }

            // Apply transport type filter
            if (transportFilter !== 'all') {
                result = result.filter(ticket => {
                    // Check both category and transportType fields
                    const ticketCategory = ticket.category || ticket.transportType || '';
                    return ticketCategory.toLowerCase() === transportFilter.toLowerCase();
                });
            }

            // Apply price sorting
            if (priceSort === 'Low ➡️ High') {
                result.sort((a, b) => (a.price || 0) - (b.price || 0));
            } else if (priceSort === 'High ➡️ Low') {
                result.sort((a, b) => (b.price || 0) - (a.price || 0));
            } else {
                // Default sorting: newest first
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }

            setFilteredTickets(result);
            setCurrentPage(1); // Reset to first page when filters change
        }
    }, [tickets, users, searchFrom, searchTo, transportFilter, priceSort]);

    // Pagination calculations
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

    // Page navigation functions
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = startPage + maxVisiblePages - 1;
        
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchFrom('');
        setSearchTo('');
        setTransportFilter('all');
        setPriceSort(null);
        setCurrentPage(1);
    };

    // Check if any filters are active
    const isAnyFilterActive = searchFrom || searchTo || transportFilter !== 'all' || priceSort;

    // Loading state
    if (isLoading || usersLoading) return <Loading />;

    return (
        <div className="flex flex-col h-full mb-8 px-4 md:px-6">
            {/* Header Section */}
            <div className="my-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white">
                            All Travel Tickets
                        </h1>
                        <p className="text-gray-600 text-center dark:text-gray-400 mt-1">
                            Discover amazing travel deals across Bangladesh
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="card bg-base-100 dark:bg-base-300 shadow-lg border border-base-300 mb-6">
                <div className="card-body p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* From Location Search */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium dark:text-gray-300">From Location</span>
                            </label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 z-1 transform -translate-y-1/2 text-green-400" />
                                <input
                                    type="text"
                                    placeholder="Enter departure location"
                                    className="input input-bordered w-full pl-10 dark:bg-base-200"
                                    value={searchFrom}
                                    onChange={(e) => setSearchFrom(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* To Location Search */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium dark:text-gray-300">To Location</span>
                            </label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 z-1" />
                                <input
                                    type="text"
                                    placeholder="Enter destination location"
                                    className="input input-bordered w-full pl-10 dark:bg-base-200"
                                    value={searchTo}
                                    onChange={(e) => setSearchTo(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Transport Type Filter */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium dark:text-gray-300">Transport Type</span>
                            </label>
                            <div className="dropdown w-full">
                                <label tabIndex={0} className="btn btn-outline justify-start w-full">
                                    <FaFilter className="mr-2" />
                                    {transportFilter === 'all' ? 'All Transport' : transportFilter}
                                </label>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 dark:bg-base-200 rounded-box w-52 mt-1 z-10">
                                    <li><button onClick={() => setTransportFilter('all')}>All Transport</button></li>
                                    <li><button onClick={() => setTransportFilter('Bus')} className="flex items-center gap-2">
                                        <FaBus className="text-blue-500" /> Bus
                                    </button></li>
                                    <li><button onClick={() => setTransportFilter('Train')} className="flex items-center gap-2">
                                        <FaTrain className="text-purple-500" /> Train
                                    </button></li>
                                    <li><button onClick={() => setTransportFilter('Flight')} className="flex items-center gap-2">
                                        <FaPlane className="text-cyan-500" /> Flight
                                    </button></li>
                                    <li><button onClick={() => setTransportFilter('Ferry')} className="flex items-center gap-2">
                                        <FaShip className="text-indigo-500" /> Ferry
                                    </button></li>
                                    <li><button onClick={() => setTransportFilter('Car')} className="flex items-center gap-2">
                                        <FaCar className="text-orange-500" /> Car
                                    </button></li>
                                </ul>
                            </div>
                        </div>

                        {/* Price Sort */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium dark:text-gray-300">Sort by Price</span>
                            </label>
                            <div className="dropdown w-full">
                                <label tabIndex={0} className="btn btn-outline justify-start w-full">
                                    {priceSort === 'Low ➡️ High' ? <FaSortAmountDown className="mr-2" /> :
                                        priceSort === 'High ➡️ Low' ? <FaSortAmountUp className="mr-2" /> :
                                            <FaFilter className="mr-2" />}
                                    {priceSort || 'Sort Price'}
                                </label>
                                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 dark:bg-base-200 rounded-box w-52 mt-1 z-10">
                                    <li><button onClick={() => setPriceSort('Low ➡️ High')} className="flex items-center gap-2">
                                        <FaSortAmountDown className="text-green-500" /> Low to High
                                    </button></li>
                                    <li><button onClick={() => setPriceSort('High ➡️ Low')} className="flex items-center gap-2">
                                        <FaSortAmountUp className="text-red-500" /> High to Low
                                    </button></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters and Clear Button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-base-300">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium dark:text-gray-300">
                                Showing <span className="font-bold text-primary">{indexOfFirstTicket + 1}-{Math.min(indexOfLastTicket, filteredTickets.length)}</span> of{' '}
                                <span className="font-bold text-secondary">{filteredTickets.length}</span> tickets
                            </span>

                            {isAnyFilterActive && (
                                <div className="flex flex-wrap gap-2 ml-2">
                                    {searchFrom && (
                                        <span className="badge badge-outline gap-1">
                                            <FaMapMarkerAlt className="text-green-500" />
                                            From: {searchFrom}
                                        </span>
                                    )}
                                    {searchTo && (
                                        <span className="badge badge-outline gap-1">
                                            <FaMapMarkerAlt className="text-red-500" />
                                            To: {searchTo}
                                        </span>
                                    )}
                                    {transportFilter !== 'all' && (
                                        <span className="badge badge-outline">
                                            {transportFilter}
                                        </span>
                                    )}
                                    {priceSort && (
                                        <span className="badge badge-outline">
                                            {priceSort}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {isAnyFilterActive && (
                                <button
                                    onClick={clearAllFilters}
                                    className="btn btn-sm btn-error btn-outline gap-2"
                                >
                                    <FaTimes />
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tickets Per Page Selector */}
            <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2  w-full">
                    <div className='flex items-center gap-2 justify-end w-full'>
                        <span className="text-sm text-gray-600  dark:text-gray-400">Tickets per page:</span>
                    </div>
                    <select 
                        className="select select-bordered border select-sm w-20"
                        value={ticketsPerPage}
                        onChange={(e) => {
                            setTicketsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                        <option value={9}>9</option>
                    </select>
                </div>
            </div>

            {/* Tickets Display */}
            <div className="mb-8">
                {currentTickets.length > 0 ? (
                    <TicketCard realTickets={currentTickets} isLoading={isLoading} />
                ) : (
                    <div className="text-center py-16 bg-base-100 dark:bg-base-300 rounded-2xl border border-base-300">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                            <FaSearch className="text-3xl text-blue-500 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No tickets found</h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                            {isAnyFilterActive
                                ? 'Try adjusting your search or filter criteria to find more tickets.'
                                : 'No tickets are currently available. Please check back later.'
                            }
                        </p>
                        {isAnyFilterActive && (
                            <button
                                onClick={clearAllFilters}
                                className="btn btn-primary gap-2"
                            >
                                <FaTimes />
                                Clear All Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination Controls - Only show if there are multiple pages */}
            {filteredTickets.length > ticketsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-base-300">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="btn btn-sm btn-outline gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaChevronLeft />
                            Previous
                        </button>
                        
                        {/* Page Numbers */}
                        <div className="flex space-x-1">
                            {getPageNumbers().map(number => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={`btn btn-sm w-10 ${currentPage === number ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                        
                        {/* Next Button */}
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="btn btn-sm btn-outline gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <FaChevronRight />
                        </button>
                    </div>
                    
                    {/* Results Info */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllTickets;