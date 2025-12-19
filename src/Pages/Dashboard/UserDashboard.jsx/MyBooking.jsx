import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaTicketAlt,
    FaTag,
    FaCheckCircle,
    FaTimesCircle,
    FaHourglassHalf,
    FaCreditCard,
    FaTrash,
    FaEye,
    FaShareAlt,
    FaPrint,
    FaUserFriends,
    FaRoute,
    FaPlaneDeparture,
    FaBus,
    FaTrain,
    FaShip,
    FaCar,
    FaExclamationTriangle,
    FaArrowRight,
    FaDownload,
    FaWhatsapp,
    FaEnvelope,
    FaFilter,
    FaSearch
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../../../Components/Shared/Navbar";
import Footer from "../../../Components/Shared/Footer";
import { AuthContext } from "../../../Context/AuthContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Shared/Loading";

const MyBookings=()=> {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch user bookings
    const { data: bookings = [], isLoading, error } = useQuery({
        queryKey: ['userBookings', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/bookings/user/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
        refetchInterval: 30000, // Refetch every 30 seconds for countdown updates
    });

    // Cancel booking mutation
    const cancelMutation = useMutation({
        mutationFn: async (bookingId) => {
            const res = await axiosSecure.patch(`/bookings/${bookingId}/cancel`);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Booking cancelled successfully");
            queryClient.invalidateQueries(['userBookings', user?.email]);
        },
        onError: () => {
            toast.error("Failed to cancel booking");
        }
    });

    // Filter bookings based on status and search term
    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === "all" || booking.status === filter;
        const matchesSearch = 
            booking.ticketTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.to?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesFilter && matchesSearch;
    });

    // Transport icon mapping
    const getTransportIcon = (type) => {
        const transportMap = {
            bus: <FaBus className="text-blue-500" />,
            train: <FaTrain className="text-emerald-500" />,
            plane: <FaPlaneDeparture className="text-purple-500" />,
            ship: <FaShip className="text-indigo-500" />,
            car: <FaCar className="text-orange-500" />,
        };
        return transportMap[type?.toLowerCase()] || <FaBus className="text-gray-500" />;
    };

    // Status badge styling
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { 
                color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
                icon: <FaHourglassHalf className="text-yellow-500" />,
                text: "Pending"
            },
            accepted: { 
                color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
                icon: <FaCheckCircle className="text-blue-500" />,
                text: "Accepted"
            },
            rejected: { 
                color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
                icon: <FaTimesCircle className="text-red-500" />,
                text: "Rejected"
            },
            paid: { 
                color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300",
                icon: <FaCreditCard className="text-emerald-500" />,
                text: "Paid"
            },
            cancelled: { 
                color: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300",
                icon: <FaTimesCircle className="text-gray-500" />,
                text: "Cancelled"
            },
            completed: { 
                color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
                icon: <FaCheckCircle className="text-purple-500" />,
                text: "Completed"
            }
        };
        return statusConfig[status] || statusConfig.pending;
    };

    // Calculate countdown
    const calculateCountdown = (departureDateTime) => {
        if (!departureDateTime) return "N/A";
        
        const now = new Date();
        const departure = new Date(departureDateTime);
        const timeLeft = departure - now;

        if (timeLeft < 0) return "Departed";

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD').format(price);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle booking actions
    const handleViewDetails = (ticketId) => {
        navigate(`/tickets/${ticketId}`);
    };

    const handleCancelBooking = (bookingId, status) => {
        if (status === 'paid') {
            toast.error("Cannot cancel paid bookings. Please contact support.");
            return;
        }
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            cancelMutation.mutate(bookingId);
        }
    };

    const handlePayNow = (bookingId) => {
        // Navigate to payment page or open payment modal
        navigate(`/payment/${bookingId}`);
    };

    const handleShareBooking = (booking) => {
        const shareData = {
            title: `My ${booking.transportType} Booking`,
            text: `I've booked ${booking.ticketTitle} from ${booking.from} to ${booking.to} on ${formatDate(booking.departureDateTime)}`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(shareData.text);
            toast.success("Booking details copied to clipboard!");
        }
    };

    // const handlePrintTicket = (booking) => {
    //     // In a real app, this would generate a printable ticket PDF
    //     toast.success("Ticket printing in progress...");
    //     // window.print() or generate PDF
    // };

    // Stats calculation
    const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    const upcomingBookings = bookings.filter(b => 
        new Date(b.departureDateTime) > new Date() && 
        b.status !== 'cancelled' && 
        b.status !== 'rejected'
    ).length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <Loading />
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Error Loading Bookings
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            {error.message || "Please try again later"}
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">My Booked Tickets</h1>
                        <p className="text-blue-100">Manage and view all your upcoming and past bookings</p>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-200">Total Bookings</p>
                                        <p className="text-2xl font-bold">{bookings.length}</p>
                                    </div>
                                    <FaTicketAlt className="text-2xl text-blue-300" />
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-200">Upcoming</p>
                                        <p className="text-2xl font-bold">{upcomingBookings}</p>
                                    </div>
                                    <FaCalendarAlt className="text-2xl text-emerald-300" />
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-200">Total Spent</p>
                                        <p className="text-2xl font-bold">{formatPrice(totalSpent)} tk</p>
                                    </div>
                                    <FaTag className="text-2xl text-yellow-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Filters and Search */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === "all" 
                                    ? "bg-blue-600 text-white" 
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}
                            >
                                All Bookings
                            </button>
                            <button
                                onClick={() => setFilter("pending")}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === "pending" 
                                    ? "bg-yellow-600 text-white" 
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setFilter("accepted")}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === "accepted" 
                                    ? "bg-blue-600 text-white" 
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}
                            >
                                Accepted
                            </button>
                            <button
                                onClick={() => setFilter("paid")}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === "paid" 
                                    ? "bg-emerald-600 text-white" 
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}
                            >
                                Paid
                            </button>
                        </div>
                        
                        <div className="relative w-full md:w-auto">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings Grid */}
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                        <FaTicketAlt className="text-5xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No bookings found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {filter === "all" 
                                ? "You haven't made any bookings yet."
                                : `No ${filter} bookings found.`
                            }
                        </p>
                        <button
                            onClick={() => navigate('/tickets')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Browse Tickets
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredBookings.map((booking) => {
                                const status = getStatusBadge(booking.status);
                                const countdown = calculateCountdown(booking.departureDateTime);
                                const isUpcoming = new Date(booking.departureDateTime) > new Date();
                                
                                return (
                                    <motion.div
                                        key={booking._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                    >
                                        {/* Booking Header */}
                                        <div className="relative">
                                            <img
                                                src={booking.ticketImage}
                                                alt={booking.ticketTitle}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                                            
                                            {/* Status Badge */}
                                            <div className="absolute top-3 right-3">
                                                <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${status.color}`}>
                                                    {status.icon}
                                                    <span className="text-sm font-medium">{status.text}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Transport Type */}
                                            <div className="absolute bottom-3 left-3">
                                                <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2">
                                                    {getTransportIcon(booking.transportType)}
                                                    <span className="text-white font-medium capitalize">
                                                        {booking.transportType}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Booking Content */}
                                        <div className="p-5">
                                            {/* Title and Reference */}
                                            <div className="mb-4">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                                                    {booking.ticketTitle}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <FaTicketAlt className="text-xs" />
                                                    <span>Ref: {booking.bookingReference}</span>
                                                </div>
                                            </div>

                                            {/* Route */}
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                    <FaRoute />
                                                    <span>Route</span>
                                                </div>
                                                <div className="flex items-center justify-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                                    <div className="text-center">
                                                        <div className="font-bold text-gray-900 dark:text-white">{booking.from}</div>
                                                        <div className="text-xs text-gray-500">From</div>
                                                    </div>
                                                    <FaArrowRight className="text-gray-400" />
                                                    <div className="text-center">
                                                        <div className="font-bold text-gray-900 dark:text-white">{booking.to}</div>
                                                        <div className="text-xs text-gray-500">To</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Booking Details Grid */}
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                                                        <FaCalendarAlt />
                                                        <span>Date</span>
                                                    </div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">
                                                        {formatDate(booking.departureDateTime)}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                                                        <FaClock />
                                                        <span>Time</span>
                                                    </div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">
                                                        {formatTime(booking.departureDateTime)}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                                                        <FaUserFriends />
                                                        <span>Quantity</span>
                                                    </div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">
                                                        {booking.quantity} person{booking.quantity > 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                                                        <FaTag />
                                                        <span>Total</span>
                                                    </div>
                                                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                        {formatPrice(booking.totalPrice)} tk
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Countdown */}
                                            {isUpcoming && booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                                                <div className="mb-4 p-3 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                            <FaClock />
                                                            <span>Departs in:</span>
                                                        </div>
                                                        <div className="font-bold text-gray-900 dark:text-white">
                                                            {countdown}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(booking.ticketId)}
                                                    className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <FaEye />
                                                    <span>View</span>
                                                </button>
                                                
                                                {booking.status === 'accepted' && (
                                                    <button
                                                        onClick={() => handlePayNow(booking._id)}
                                                        className="flex-1 px-3 py-2 bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <FaCreditCard />
                                                        <span>Pay Now</span>
                                                    </button>
                                                )}

                                                {(booking.status === 'pending' || booking.status === 'accepted') && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking._id, booking.status)}
                                                        disabled={cancelMutation.isLoading}
                                                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <FaTrash />
                                                        <span>Cancel</span>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleShareBooking(booking)}
                                                    className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <FaShareAlt />
                                                    <span>Share</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* Quick Actions */}
                {filteredBookings.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <button 
                                onClick={() => window.print()}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-center"
                            >
                                <FaPrint className="text-2xl text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Print All Tickets</span>
                            </button>
                            <button 
                                onClick={() => navigate('/contact')}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-center"
                            >
                                <FaWhatsapp className="text-2xl text-green-600 mx-auto mb-2" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Get Support</span>
                            </button>
                            <button 
                                onClick={() => navigate('/tickets')}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-center"
                            >
                                <FaTicketAlt className="text-2xl text-blue-600 mx-auto mb-2" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Book More</span>
                            </button>
                            <button 
                                onClick={() => {
                                    const emailBody = `My Booking Summary:\n\n${bookings.map(b => 
                                        `${b.ticketTitle} - ${b.from} to ${b.to} - ${formatDate(b.departureDateTime)}`
                                    ).join('\n')}`;
                                    window.location.href = `mailto:?subject=My Bookings&body=${encodeURIComponent(emailBody)}`;
                                }}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-center"
                            >
                                <FaEnvelope className="text-2xl text-red-600 mx-auto mb-2" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Email Summary</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default MyBookings;