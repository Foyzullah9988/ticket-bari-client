import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import {
    FaFire,
    FaTag,
    FaClock,
    FaMapMarkerAlt,
    FaArrowRight,
    FaBus,
    FaTrain,
    FaPlane,
    FaShip,
    FaStar,
    FaRegStar,
    FaCalendarAlt
} from 'react-icons/fa';
import { Link } from 'react-router';
import Loading from '../../Components/Shared/Loading';
import EmptyComponent from '../../Components/EmptyComponent';

const Advertised = () => {
    const axiosSecure = useAxiosSecure();

    const { data: tickets = [], isLoading } = useQuery({
        queryKey: ['tickets', 'advertised'],
        queryFn: async () => {
            const res = await axiosSecure('/tickets');
            return res.data;
        },
        retry: 2
    });

    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure('/users');
            return res.data;
        }
    });


    const fraudEmails = users
        .filter(user => user.role === 'fraud' || user.role !== 'vendor')
        .map(user => user.email);

    // Filter and sort advertised tickets
    const advertisedTickets = tickets
        .filter(ticket => ticket.isAdvertised === true &&
            ticket.verificationStatus === 'approved' &&
            !fraudEmails.includes(ticket?.vendorEmail)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get transport icon
    const getTransportIcon = (transportType) => {
        switch (transportType?.toLowerCase()) {
            case 'bus': return <FaBus className="text-blue-500" />;
            case 'train': return <FaTrain className="text-purple-500" />;
            case 'flight': return <FaPlane className="text-cyan-500" />;
            case 'plane': return <FaPlane className="text-cyan-500" />;
            case 'ferry': return <FaShip className="text-indigo-500" />;
            case 'ship': return <FaShip className="text-indigo-500" />;
            default: return <FaBus className="text-gray-500" />;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format price with currency
    const formatPrice = (price) => {
        return `${price} tk`;
    };

    if (isLoading) return <Loading />;

    return (
        <div className=" bg-linear-to-br my-6 rounded-2xl from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 md:px-6">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-500 rounded-full blur-lg opacity-100 animate-pulse"></div>
                            <div className="relative bg-linear-to-r from-orange-500 to-red-500 dark:from-orange-700 dark:to-red-700 text-white p-4 rounded-full">
                                <FaFire className="text-3xl" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-600 to-red-600 dark:from-orange-800 dark:to-red-800">
                            Special Offers
                        </span>
                    </h1>
                    <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-100 to-red-100 dark:from-gray-800 dark:to-gray-700 px-4 py-2 rounded-full border border-orange-200 dark:border-gray-600 mb-4">
                        <FaTag className="text-orange-500" />
                        <span className="text-orange-700 dark:text-orange-300 font-semibold ">
                            {advertisedTickets.length} Active Offers
                        </span>
                    </div>

                    {
                        advertisedTickets.length === 0 ? (
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                                No advertised tickets available at the moment. Please check back later for exciting offers!
                            </p>
                        ) : <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                            Discover our featured travel deals with exclusive discounts and promotions
                        </p>
                    }


                </div>


            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                {advertisedTickets.length !== 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {advertisedTickets.map((ticket) => (
                            <div
                                key={ticket._id}
                                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden border border-orange-100 dark:border-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 transform hover:-translate-y-2"
                            >
                                {/* Advertised Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-red-500 dark:from-orange-900 dark:to-red-900 rounded-full blur-md opacity-70 group-hover:opacity-90 transition-opacity"></div>
                                        <div className="relative bg-linear-to-r from-orange-500  to-red-500 dark:from-orange-900 dark:to-red-900 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                            <FaFire className="animate-pulse" />
                                            <span className="font-bold text-sm">Advertised</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Section */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={ticket.image}
                                        alt={ticket.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                                    {/* Transport Type */}
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        {getTransportIcon(ticket.transportType)}
                                        <span className="text-white text-sm font-medium">
                                            {ticket.transportType}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    {/* Title and Price */}
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                                            {ticket.title}
                                        </h3>
                                        <div className="flex items-baseline">
                                            <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                                {formatPrice(ticket.price)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Route Information */}
                                    <div className="flex items-center justify-between bg-linear-to-r from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl mb-4 border border-orange-100 dark:border-gray-700">
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-green-500" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                                                <p className="font-semibold text-gray-800 dark:text-white">{ticket.from}</p>
                                            </div>
                                        </div>

                                        <FaArrowRight className="text-orange-500 mx-2" />

                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-red-500" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
                                                <p className="font-semibold text-gray-800 dark:text-white">{ticket.to}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date and Time */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                                                <FaCalendarAlt className="text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Departure</p>
                                                <p className="font-semibold text-gray-800 dark:text-white">
                                                    {ticket.departureDateTime ? formatDate(ticket.departureDateTime) : 'Flexible'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                                                <FaClock className="text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                                                <p className="font-semibold text-gray-800 dark:text-white">
                                                    {ticket.availableQuantity} seats
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Perks (if any) */}
                                    {ticket.perks && ticket.perks.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaStar className="text-yellow-500" />
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">Special Perks</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {ticket.perks.slice(0, 3).map((perk, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium border border-orange-200 dark:border-orange-800"
                                                    >
                                                        {perk}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <Link
                                        to={`/ticket-details/${ticket._id}`}
                                        className="block w-full mt-4  "
                                    >
                                        <button className="cursor-pointer group/btn w-full bg-linear-to-r from-orange-500 to-red-500 dark:from-orange-900 dark:to-red-900 dark:hover:from-orange-800 dark:hover:to-red-800 hover:from-orange-600 hover:to-red-600 text-white py-3.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                            <span>View Special Offer</span>
                                            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom CTA */}
                {advertisedTickets.length > 0 && (
                    <div className="mt-12 text-center">
                        <div className="bg-linear-to-r from-orange-500/10 to-red-500/10 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        Don't Miss These Exclusive Deals!
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Book now to secure your seat at promotional prices
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                            {advertisedTickets.length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Active Offers
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Decorative Elements */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="fixed bottom-20 right-10 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
    );
};

export default Advertised;