import React from "react";
import { Link } from "react-router";
import {
    FaChair,
    FaBus,
    FaTrain,
    FaPlane,
    FaShip,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaClock,
    FaArrowRight,
    FaStar,
    FaTicketAlt,
} from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";

// Transport type icon mapping
const transportIcons = {
    bus: FaBus,
    train: FaTrain,
    plane: FaPlane,
    ship: FaShip,
    car: FaBus,
    default: FaBus
};

export default function TicketCard({ lastedTickets }) {

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Truncate text if too long
    const truncateText = (text, maxLength = 50) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 w-full gap-6">
                {lastedTickets.map((ticket) => {
                    const TransportIcon = transportIcons[ticket.transportType?.toLowerCase()] || transportIcons.default;
                    
                    return (
                        <div
                            key={ticket._id}
                            className="group bg-base-300 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col h-full hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-2xl dark:hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Image with   linear overlay */}
                            <div className="relative overflow-hidden rounded-xl mb-4">
                                <figure className="relative">
                                    <img
                                        src={ticket.image }
                                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt={ticket.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                                        }}
                                    />
                                    {/* Gradient overlay that changes in dark mode */}
                                    <div className="absolute inset-0 bg-  linear-to-br from-transparent via-transparent to-black/20 dark:to-black/40 opacity-60"></div>

                                    {/* Transport Type Badge */}
                                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <TransportIcon className="text-gray-700 dark:text-gray-300 text-base" />
                                        <span className="text-sm font-medium capitalize text-gray-800 dark:text-gray-200">
                                            {ticket.transportType }
                                        </span>
                                    </div>

                                    {/* Price Badge with Icon - FIXED: Green bg for light, Black bg for dark */}
                                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-green-600 dark:bg-black text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                                        <FaTicketAlt className="text-white text-base" />
                                        <span className="flex items-center gap-1">
                                            {ticket.price || "N/A"}
                                            <span className="ml-1 text-xs font-normal">tk</span>
                                        </span>
                                    </div>
                                </figure>
                            </div>

                            {/* Title */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold mb-2 line-clamp-1 text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {truncateText(ticket.title, 40)}
                                </h3>

                                {/* Route Information */}
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <FaMapMarkerAlt className="text-emerald-500 dark:text-emerald-400 text-sm" />
                                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{ticket.from || "Origin"}</span>
                                    </div>
                                    <FaArrowRight className="text-gray-500 dark:text-gray-400" />
                                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <FaMapMarkerAlt className="text-rose-500 dark:text-rose-400 text-sm" />
                                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{ticket.to || "Destination"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                        <FaCalendarAlt className="text-cyan-500 dark:text-cyan-400 text-base" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                            {ticket.departureDateTime ? formatDate(ticket.departureDateTime) : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                        <FaClock className="text-amber-500 dark:text-amber-400 text-base" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                            {ticket.departureDateTime ? formatTime(ticket.departureDateTime) : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                        <MdAirlineSeatReclineNormal className="text-purple-500 dark:text-purple-400 text-base" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                                            {ticket.availableQuantity || ticket.quantity || "0"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                        <FaChair className="text-rose-500 dark:text-rose-400 text-base" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Seats</p>
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                                            {ticket.quantity || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Perks Section */}
                            <div className="mb-5 flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaStar className="text-yellow-500 dark:text-yellow-400" />
                                    <h4 className="font-bold text-gray-800 dark:text-gray-300">Ticket Perks</h4>
                                </div>

                                <div className="space-y-2">
                                    {ticket.perks && Array.isArray(ticket.perks) && ticket.perks.length > 0 ? (
                                        ticket.perks.slice(0, 3).map((perk, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors border border-gray-100 dark:border-gray-700"
                                            >
                                                <div className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{perk}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 dark:text-gray-400 text-sm italic p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-700">
                                            No perks listed
                                        </div>
                                    )}

                                    {ticket.perks && Array.isArray(ticket.perks) && ticket.perks.length > 3 && (
                                        <div className="text-center pt-2">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                +{ticket.perks.length - 3} more perks
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* View Details Button - FIXED: Proper   linear classes */}
                            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                                <Link
                                    to={`/ticket-details/${ticket._id}`}
                                    className="group/btn w-full inline-flex items-center justify-center gap-2 bg-  bg-linear-to-l from-green-500 to-green-900 dark:to-black/90 dark:from-black/5
                                    hover:from-10% hover:to-40%
                                     text-white py-3.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                                >
                                    <span>View Details</span>
                                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}