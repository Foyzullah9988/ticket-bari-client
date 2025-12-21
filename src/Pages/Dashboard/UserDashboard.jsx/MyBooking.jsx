import React, { useContext, useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
    FaCalendarAlt, FaClock, FaTicketAlt, FaTag,
    FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCreditCard,
    FaTrash, FaExclamationTriangle,
    FaArrowRight, FaFilter, FaSearch,
    FaArrowLeft, FaArrowRight as FaArrowRightIcon,
    FaMoneyBillWave, FaCalendarDay,
    FaSync
} from "react-icons/fa";
import Swal from "sweetalert2";
import Navbar from "../../../Components/Shared/Navbar";
import Footer from "../../../Components/Shared/Footer";
import { AuthContext } from "../../../Context/AuthContext";
import Skeleton2 from "../../../Components/Shared/Skeleton2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentTime, setCurrentTime] = useState(new Date());
    const itemsPerPage = 10;

    // Update current time every minute for countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    // Fetch user bookings
    const { data: bookings = [], isLoading, refetch, error } = useQuery({
        queryKey: ['bookings', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get('/bookings', {
                params: {
                    userEmail: user?.email
                }
            });
            return res.data;
        },
        enabled: !!user?.email,
        refetchInterval: 30000,
    });

    const cancelMutation = useMutation({
        mutationFn: async (bookingId) => {
            const res = await axiosSecure.delete(`/bookings/${bookingId}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Booking cancelled successfully");
            queryClient.invalidateQueries(['bookings', user?.email]);
        },
        onError: (error) => {
            toast.error("Failed to cancel booking");
            console.error("Cancel error:", error);
        }
    });

    // Calculate time left until departure
    const calculateTimeLeft = (departureDateTime) => {
        if (!departureDateTime) return "N/A";

        const departure = new Date(departureDateTime);
        const now = currentTime;
        const timeDiff = departure - now;

        if (timeDiff < 0) {
            return "Departed";
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    };

    // Filter and sort bookings by bookingDate (newest first)
    const filteredBookings = useMemo(() => {
        if (!bookings || bookings.length === 0) return [];

        const filtered = bookings.filter(booking => {
            const matchesFilter = filter === "all" || booking.status === filter;
            const matchesSearch =
                booking.ticketTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.to?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesFilter && matchesSearch;
        });

        // Sort by bookingDate (newest first), with fallback to createdAt
        return filtered.sort((a, b) => {
            const dateA = new Date(a.bookingDate || a.createdAt || 0);
            const dateB = new Date(b.bookingDate || b.createdAt || 0);
            return dateB - dateA; // Descending order (newest first)
        });
    }, [bookings, filter, searchTerm]);

    // Pagination calculation
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

    // Status badge styling
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                color: "bg-yellow-100 border border-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
                icon: <FaHourglassHalf className="text-yellow-500" />,
                text: "Pending"
            },
            accepted: {
                color: "bg-blue-100 border border-blue-200 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
                icon: <FaCheckCircle className="text-blue-500" />,
                text: "Accepted"
            },
            rejected: {
                color: "bg-red-100 border border-red-200 dark:bg-red-900/30 text-red-800 dark:text-red-300",
                icon: <FaTimesCircle className="text-red-500" />,
                text: "Rejected"
            },
            paid: {
                color: "bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300",
                icon: <FaCreditCard className="text-emerald-500" />,
                text: "Paid"
            },
            cancelled: {
                color: "bg-gray-100 border border-gray-200 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300",
                icon: <FaTimesCircle className="text-gray-500" />,
                text: "Cancelled"
            },
            completed: {
                color: "bg-purple-100 border border-purple-200 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
                icon: <FaCheckCircle className="text-purple-500" />,
                text: "Completed"
            }
        };
        return statusConfig[status] || statusConfig.pending;
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD').format(price || 0);
    };

    // Format date and time
    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid Date";

            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) + ' ' + date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return "N/A";
        }
    };

    // Format short date (for booking date column)
    const formatShortDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid Date";

            const now = currentTime;
            const diffTime = Math.abs(now - date);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                if (diffHours === 0) {
                    const diffMinutes = Math.floor(diffTime / (1000 * 60));
                    return `${diffMinutes}m ago`;
                }
                return `${diffHours}h ago`;
            } else if (diffDays === 1) {
                return "Yesterday";
            } else if (diffDays < 7) {
                return `${diffDays}d ago`;
            } else {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });
            }
        } catch (error) {
            return "N/A";
        }
    };

    // Handle booking cancel with SweetAlert2 modal
    const handleCancelBooking = (bookingId, status, bookingData) => {
        if (status === 'paid') {
            Swal.fire({
                title: 'Cannot Cancel',
                text: 'Paid bookings cannot be cancelled. Please contact support for assistance.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc2626',
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            html: `
                <div class="text-left">
                    <p class="mb-2">You are about to cancel this booking:</p>
                    <div class="bg-gray-50 p-3 rounded-lg mb-3">
                        <p class="font-semibold">${bookingData.ticketTitle || 'Untitled Booking'}</p>
                        <p class="text-sm text-gray-600">Ref: ${bookingData.bookingReference || 'N/A'}</p>
                        <p class="text-sm text-gray-600">From: ${bookingData.from || 'N/A'} → To: ${bookingData.to || 'N/A'}</p>
                        <p class="text-sm text-gray-600">Departure: ${formatDateTime(bookingData.departureDateTime)}</p>
                    </div>
                    <p class="text-red-600 font-medium">This action cannot be undone!</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            backdrop: true,
            allowOutsideClick: false,
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await cancelMutation.mutateAsync(bookingId);
                    return true;
                } catch (error) {
                    Swal.showValidationMessage('Cancellation failed. Please try again.');
                    return false;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Success message already shown in onSuccess of mutation
            }
        });
    };

    const handlePayNow = (bookingId) => {
        navigate(`/dashboard/payment/${bookingId}`);
    };

    // Stats calculation
    const totalSpent = bookings?.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0) || 0;
    const upcomingBookings = bookings?.filter(b => {
        if (!b.departureDateTime) return false;
        const departure = new Date(b.departureDateTime);
        const now = currentTime;
        return departure > now && b.status !== 'cancelled' && b.status !== 'rejected';
    }).length || 0;

    if (isLoading) {
        return (
            <div className='flex flex-col justify-center items-center gap-2'>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
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
            <div className="bg-linear-to-r from-blue-600 dark:from-blue-950 to-indigo-700 dark:to-indigo-950 text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
                        <p className="text-blue-100">All your bookings sorted by booking date (newest first)</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Stats and Filters */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                                <p className="text-2xl font-bold">{bookings?.length || 0}</p>
                            </div>
                            <FaTicketAlt className="text-2xl text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                                <p className="text-2xl font-bold">{formatPrice(totalSpent)} tk</p>
                            </div>
                            <FaMoneyBillWave className="text-2xl text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming</p>
                                <p className="text-2xl font-bold">{upcomingBookings}</p>
                            </div>
                            <FaCalendarAlt className="text-2xl text-orange-500" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Pending Payment</p>
                                <p className="text-2xl font-bold">
                                    {bookings?.filter(b => b.status === 'accepted').length || 0}
                                </p>
                            </div>
                            <FaHourglassHalf className="text-2xl text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter("pending")}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setFilter("accepted")}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === "accepted" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                            >
                                Accepted
                            </button>
                            <button
                                onClick={() => setFilter("paid")}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === "paid" ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                            >
                                Paid
                            </button>
                            <button
                                onClick={() => setFilter("cancelled")}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${filter === "cancelled" ? "bg-red-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
                            >
                                Cancelled
                            </button>
                        </div>

                        <div className="relative w-full md:w-64">
                            <div className="relative flex gap-2 justify-between">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={() => refetch()}
                                    className="btn btn-primary btn-outline gap-1.5 shadow-sm hover:shadow-md transition-all text-xs px-2 sm:px-3 py-1.5 h-10 "
                                >
                                    <FaSync className={`${isLoading ? 'animate-spin' : ''} w-3 h-3`} />
                                    <span className="hidden sm:inline">Refresh</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
                                onClick={() => navigate('/all-tickets')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Browse Tickets
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Booking Ref
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Booking Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Route
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Departure
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Time Left
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Passengers
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Total Price
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {paginatedBookings.map((booking) => {
                                            const status = getStatusBadge(booking.status);
                                            const timeLeft = calculateTimeLeft(booking.departureDateTime);
                                            const isDeparted = timeLeft === "Departed";
                                            const isUpcoming = !isDeparted && timeLeft !== "N/A";

                                            return (
                                                <tr
                                                    key={booking._id || booking.bookingReference}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {booking.bookingReference || "N/A"}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                                                                {booking.ticketTitle || "No title"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <div className="text-sm text-gray-900 dark:text-white flex items-center">
                                                                <FaCalendarDay className="mr-2 text-blue-500 text-sm" />
                                                                {formatDateTime(booking.bookingDate)}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatShortDate(booking.bookingDate)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {booking.from || "N/A"}
                                                            </div>
                                                            <FaArrowRight className="mx-2 text-gray-400" />
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {booking.to || "N/A"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-white">
                                                            {formatDateTime(booking.departureDateTime)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className={`text-sm font-semibold ${isDeparted
                                                                ? "text-red-600 dark:text-red-400"
                                                                : isUpcoming
                                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                                    : "text-gray-600 dark:text-gray-400"
                                                            }`}>
                                                            {timeLeft}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className="text-sm text-gray-900 dark:text-white">
                                                                {booking.quantity || "0"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                            {formatPrice(booking.totalPrice)} tk
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                                            {status.icon}
                                                            <span className="ml-1">{status.text}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            {booking.status === 'accepted' && (
                                                                <button
                                                                    onClick={() => handlePayNow(booking._id)}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center"
                                                                >
                                                                    <FaCreditCard className="mr-1" />
                                                                    Pay Now
                                                                </button>
                                                            )}

                                                            {(booking.status === 'pending' || booking.status === 'accepted') && (
                                                                <button
                                                                    onClick={() => handleCancelBooking(booking._id, booking.status, booking)}
                                                                    disabled={cancelMutation.isLoading}
                                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center"
                                                                >
                                                                    <FaTrash className="mr-1" />
                                                                    Cancel
                                                                </button>
                                                            )}

                                                            {booking.status === 'paid' && (
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                    Payment Completed
                                                                </span>
                                                            )}

                                                            {booking.status === 'cancelled' && (
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                    Cancelled
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700 dark:text-gray-400">
                                            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                                            <span className="font-medium">
                                                {Math.min(startIndex + itemsPerPage, filteredBookings.length)}
                                            </span> of{" "}
                                            <span className="font-medium">{filteredBookings.length}</span> results
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FaArrowLeft />
                                            </button>
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`px-3 py-1 rounded-md ${currentPage === pageNum
                                                                ? "bg-blue-600 text-white"
                                                                : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FaArrowRightIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export default MyBookings;