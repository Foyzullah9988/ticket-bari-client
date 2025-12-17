import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaFilter, FaSearch, FaSync } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../../Components/Shared/Loading';

const AdvertiseTickets = () => {
    const axiosSecure = useAxiosSecure();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [transportFilter, setTransportFilter] = useState('all');

    // Load all tickets
    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const ticketsRes = await axiosSecure.get('/tickets');
            setTickets(ticketsRes.data);
        } catch (error) {
            console.error('Error loading tickets:', error);
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const appTickets = tickets.filter(ticket => ticket.verificationStatus === 'approved');

    // Filter advertised tickets
    const advertisedTickets = tickets.filter(ticket => ticket.isAdvertised === true);

    // Filter tickets based on search and transport type
    const filteredTickets = appTickets.filter(ticket => {
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



    if (loading) {
        return <Loading />;
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
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Advertise Tickets</h1>
                        <p className="text-gray-600">Promote tickets on the homepage</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="stat">
                        <div className="stat-title text-sm">Advertised Tickets</div>
                        <div className="stat-value text-primary">{advertisedTickets.length}/6</div>
                        <div className="stat-desc">
                            {advertisedTickets.length >= 6 && (
                                <span className="text-error">Maximum limit reached</span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={loadTickets}
                        className="btn btn-primary gap-2"
                    >
                        <FaSync />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tickets by title, origin, or destination"
                                    className="input input-bordered w-full pl-12"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
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
                                className="btn btn-outline"
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

            {/* Tickets List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Advertised Tickets Preview (Left Side) */}
                <div className="lg:col-span-1">
                    <div className="card bg-base-100 shadow sticky top-6">
                        <div className="card-body">
                            <h2 className="card-title">
                                <FaBullhorn className="text-primary" />
                                Advertised Tickets ({advertisedTickets.length}/6)
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">
                                These tickets will be displayed on the homepage
                            </p>

                            {advertisedTickets.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-2">
                                        <FaBullhorn className="text-3xl mx-auto" />
                                    </div>
                                    <p className="text-gray-500">No tickets advertised yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {advertisedTickets.map((ticket) => (
                                        <div key={ticket._id} className="card card-compact bg-base-200 hover:bg-base-300 transition-colors">
                                            <div className="card-body">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-sm truncate">{ticket.title}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs font-medium px-2 py-1 rounded bg-primary/20 text-primary">
                                                                {ticket.transportType}
                                                            </span>
                                                            <span className="text-success font-bold">${ticket.price}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {ticket.from} → {ticket.to}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(ticket.departureDateTime).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <button

                                                        className="btn btn-error btn-xs"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {advertisedTickets.length > 0 && (
                                <div className="mt-4 p-3 bg-info/10 rounded-lg">
                                    <p className="text-sm text-info-content">
                                        <span className="font-bold">Note:</span> Maximum 6 tickets can be advertised. These tickets will be displayed on the homepage.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* All Tickets List (Right Side) */}
                <div className="lg:col-span-2">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body p-0">
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th className="font-bold">Ticket Details</th>
                                            <th className="font-bold">Transport</th>
                                            <th className="font-bold">Price</th>
                                            <th className="font-bold">Vendor</th>
                                            <th className="font-bold">Status</th>
                                            <th className="font-bold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTickets.length === 0 ? (
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
                                            filteredTickets.map((ticket) => (
                                                <tr key={ticket._id} className="hover:bg-base-200/50">
                                                    <td>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="avatar">
                                                                <div className="mask mask-squircle w-16 h-16">
                                                                    <img
                                                                        src={ticket.image}
                                                                        alt={ticket.title}
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold">{ticket.title}</div>
                                                                <div className="text-sm opacity-50">
                                                                    {ticket.from} → {ticket.to}
                                                                </div>
                                                                <div className="text-sm opacity-50">
                                                                    {new Date(ticket.departureDateTime).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${ticket.transportType === 'Bus' ? 'badge-primary' :
                                                            ticket.transportType === 'Train' ? 'badge-secondary' :
                                                                ticket.transportType === 'Plane' ? 'badge-accent' :
                                                                    ticket.transportType === 'Ship' ? 'badge-info' :
                                                                        'badge-warning'
                                                            }`}>
                                                            {ticket.transportType}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className="font-bold text-success">${ticket.price}</span>
                                                            <div className="text-sm badge badge-ghost">
                                                                {ticket.quantity} available
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div className="font-bold">{ticket.vendorName}</div>
                                                            <div className="text-sm opacity-50">{ticket.vendorEmail}</div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={`badge gap-2 px-3 py-2 ${ticket.isAdvertised ? 'badge-success' : 'badge-neutral'
                                                            }`}>
                                                            {ticket.isAdvertised ? 'Advertised' : 'Not Advertised'}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                           
                                                            disabled={!ticket.isAdvertised && advertisedTickets.length >= 6}
                                                            className={`btn btn-sm ${ticket.isAdvertised ? 'btn-error' : 'btn-success'
                                                                } ${!ticket.isAdvertised && advertisedTickets.length >= 6 ? 'btn-disabled opacity-50' : ''}`}
                                                        >
                                                            {ticket.isAdvertised ? 'Remove' : 'Advertise'}
                                                            {!ticket.isAdvertised && advertisedTickets.length >= 6 && (
                                                                <span className="tooltip" data-tip="Maximum limit reached">
                                                                </span>
                                                            )}
                                                        </button>
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