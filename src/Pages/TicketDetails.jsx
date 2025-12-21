import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Components/Shared/Navbar";
import Footer from "../Components/Shared/Footer";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router";
import Loading from "../Components/Shared/Loading";
import {
    FaLongArrowAltRight,
    FaPlus,
    FaMinus,
    FaBus,
    FaTrain,
    FaPlane,
    FaShip,
    FaCar,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaChair,
    FaTicketAlt,
    FaTag,
    FaInfoCircle,
    FaShieldAlt,
    FaWifi,
    FaUtensils,
    FaTv,
    FaSnowflake,
    FaBolt,
    FaStar,
    FaCheckCircle,
    FaExclamationTriangle,
    FaChevronRight,
    FaUserFriends,
    FaPercentage,
    FaRegHeart,
    FaHeart,
    FaShareAlt,
    FaPhoneAlt,
    FaQuestionCircle,
    FaArrowLeft,
    FaLock,
    FaUser,
    FaEnvelope,
    FaTimesCircle
} from "react-icons/fa";
import { MdAirlineSeatReclineNormal, MdEventSeat, MdLocationOn, MdSecurity } from "react-icons/md";
import { IoIosAlert } from "react-icons/io";
import Skeleton2 from "../Components/Shared/Skeleton2";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AuthContext } from "../Context/AuthContext";
import useRole from "../Hooks/useRole";

export default function TicketDetails() {
    const { role } = useRole();
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    // Fetch ticket details
    const { data: ticket, isLoading, error } = useQuery({
        queryKey: ['ticket', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tickets/${id}`);
            return res.data;
        },
        enabled: !!id,
        retry: 2,
    });

    // Calculate total price whenever quantity changes
    useEffect(() => {
        if (ticket) {
            const calculatedTotal = ticket.price * quantity;
            setTotalPrice(calculatedTotal);
        }
    }, [ticket, quantity]);

    // Check if departure time has passed
    const isTimeExpired = (departureDateTime) => {
        if (!departureDateTime) return false;
        const departure = new Date(departureDateTime);
        const now = new Date();
        return departure < now;
    };

    // Prepare booking data
    const prepareBookingData = () => {
        if (!ticket || !user) return null;

        const bookingInfo = {
            ticketId: id,
            ticketTitle: ticket.title,
            ticketImage: ticket.image,
            transportType: ticket.transportType,
            from: ticket.from,
            to: ticket.to,
            departureDateTime: ticket.departureDateTime,
            vendorEmail: ticket.vendorEmail,
            pricePerTicket: ticket.price,
            quantity: quantity,
            totalPrice: totalPrice,
            userEmail: user.email,
            userName: user.displayName,
            userPhoto: user?.photoURL,
            userId: user._id,
            bookingDate: new Date().toISOString(),
            paymentStatus: 'pending',
            status: 'pending',
            bookingReference: `BK${Date.now()}`,
        };

        return bookingInfo;
    };

    // Booking mutation
    const bookingMutation = useMutation({
        mutationFn: async (bookingInfo) => {
            const res = await axiosSecure.post('/bookings', bookingInfo);
            return res.data;
        }
    });

    const handleBooking = () => {
        if (ticket.quantity < quantity) {
            toast.error(`Only ${ticket.quantity} seats available`);
            return;
        }

        const bookingData = prepareBookingData();
        bookingMutation.mutate(bookingData);
    };

    // Transport icon mapping
    const getTransportIcon = (type) => {
        const transportMap = {
            bus: { icon: <FaBus />, color: "bg-blue-500", text: "text-blue-500" },
            train: { icon: <FaTrain />, color: "bg-emerald-500", text: "text-emerald-500" },
            plane: { icon: <FaPlane />, color: "bg-purple-500", text: "text-purple-500" },
            ship: { icon: <FaShip />, color: "bg-indigo-500", text: "text-indigo-500" },
            car: { icon: <FaCar />, color: "bg-orange-500", text: "text-orange-500" },
        };
        const transport = transportMap[type?.toLowerCase()] || { icon: <FaBus />, color: "bg-gray-500", text: "text-gray-500" };

        return (
            <div className="flex items-center gap-2">
                <div className={`${transport.color} p-2 rounded-lg`}>
                    <div className="text-white text-sm">{transport.icon}</div>
                </div>
                <span className={`font-semibold ${transport.text} capitalize`}>{type}</span>
            </div>
        );
    };

    // Perk icon mapping
    const getPerkIcon = (perk) => {
        const perkLower = perk.toLowerCase();
        if (perkLower.includes('wifi') || perkLower.includes('wi-fi')) {
            return <FaWifi className="text-blue-500 text-lg" />;
        } else if (perkLower.includes('food') || perkLower.includes('meal')) {
            return <FaUtensils className="text-amber-500 text-lg" />;
        } else if (perkLower.includes('tv') || perkLower.includes('entertainment')) {
            return <FaTv className="text-purple-500 text-lg" />;
        } else if (perkLower.includes('ac') || perkLower.includes('air')) {
            return <FaSnowflake className="text-cyan-500 text-lg" />;
        } else if (perkLower.includes('power') || perkLower.includes('charg')) {
            return <FaBolt className="text-yellow-500 text-lg" />;
        } else if (perkLower.includes('safe') || perkLower.includes('security')) {
            return <FaShieldAlt className="text-green-500 text-lg" />;
        } else {
            return <FaStar className="text-yellow-400 text-lg" />;
        }
    };

    const handleCountdown = () => {
        if (!ticket?.departureDateTime) return 'Loading...';

        const now = new Date();
        const target = new Date(ticket.departureDateTime);
        const timeLeft = target - now;

        if (timeLeft <= 0) {
            return 'Departed';
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);

        if (days > 0) {
            return `${days}d ${hours}h left`;
        } else if (hours > 0) {
            return `${hours}h left`;
        } else if (minutes > 0) {
            return `${minutes}m left`;
        } else {
            return 'Less than 1m left';
        }
    };

    const handleIncrement = () => {
        const maxQuantity = ticket?.quantity || 1;
        if (quantity < maxQuantity) {
            setQuantity(prev => prev + 1);
        } else {
            toast.error(`Only ${maxQuantity} seats available`);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD').format(price);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: ticket?.title,
                text: `Check out this ${ticket?.transportType} ticket from ${ticket?.from} to ${ticket?.to}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    if (isLoading) {
        return (
            <div className='flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900'>
                <Navbar />
                <div className='flex-1 container mx-auto mt-2 h-full w-full max-w-6xl p-4 md:p-6'>
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <FaArrowLeft />
                            <span>Back</span>
                        </button>
                    </div>
                    <Skeleton2 />
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center max-w-md">
                        <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Ticket Not Found</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">The ticket you're looking for doesn't exist or has been removed.</p>
                        <button
                            onClick={() => navigate('/tickets')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Browse Available Tickets
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!ticket) {
        return <Loading />;
    }

    const isDeparted = isTimeExpired(ticket.departureDateTime);
    const isLocked = role === 'vendor' || role === 'admin' || isDeparted;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />

            {/* Back Navigation */}
            <div className="container mx-auto max-w-6xl px-4 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to all tickets</span>
                </button>
            </div>

            <div className="flex-1 container mx-auto max-w-6xl px-4 py-6">

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                >
                    {/* Image Header with Actions */}
                    <div className="relative">
                        <div className="h-48 md:h-64 w-full overflow-hidden">
                            <img
                                src={ticket.image}
                                alt={ticket.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all hover:scale-105 shadow-lg"
                            >
                                {isFavorite ?
                                    <FaHeart className="text-red-500 text-lg" /> :
                                    <FaRegHeart className="text-gray-600 dark:text-gray-300 text-lg" />
                                }
                            </button>
                            <button
                                onClick={handleShare}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all hover:scale-105 shadow-lg"
                            >
                                <FaShareAlt className="text-gray-600 dark:text-gray-300 text-lg" />
                            </button>
                        </div>

                        {/* Transport Type Badge */}
                        <div className="absolute bottom-4 left-4">
                            {getTransportIcon(ticket.transportType)}
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Title and Rating */}
                        <div className="mb-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {ticket.title}
                                    </h1>
                                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center gap-1">
                                            <FaStar className="text-yellow-400" />
                                            <span className="font-medium">4.8</span>
                                            <span className="text-sm">(128 reviews)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MdSecurity className="text-green-500" />
                                            <span className="text-sm">Verified Operator</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Display */}
                                <div className="text-right">
                                    <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                        {formatPrice(ticket.price)} tk
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                                        per person
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Route and Schedule */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Route Card */}
                            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-blue-500" />
                                    Route
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-center">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">From</div>
                                            <div className="font-bold text-lg dark:text-white">{ticket.from}</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <FaLongArrowAltRight className="text-gray-400 text-xl" />
                                            <div className="text-xs text-gray-500 mt-1">{ticket.distance || "350km"}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">To</div>
                                            <div className="font-bold text-lg dark:text-white">{ticket.to}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Departure Card */}
                            <div className="bg-linear-to-r from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FaCalendarAlt className="text-emerald-500" />
                                    Departure
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                                                <FaClock className="text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
                                                <div className="font-bold dark:text-white">
                                                    {new Date(ticket.departureDateTime).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                                                <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
                                                <div className="font-bold dark:text-white">
                                                    {new Date(ticket.departureDateTime).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Departs in:</span>
                                            <span className={`font-semibold ${isDeparted ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                {handleCountdown()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Availability Card */}
                            <div className="bg-linear-to-r from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <MdEventSeat className="text-amber-500" />
                                    Availability
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                                                <MdAirlineSeatReclineNormal className="text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Available Seats</div>
                                                <div className="font-bold text-2xl dark:text-white">{ticket.availableQuantity}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                                            <div className={`font-medium ${isDeparted
                                                ? 'text-red-600 dark:text-red-400'
                                                : ticket.quantity > 5
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : ticket.quantity > 0
                                                        ? 'text-amber-600 dark:text-amber-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                }`}>
                                                {isDeparted
                                                    ? 'Departed'
                                                    : ticket.quantity > 5
                                                        ? 'Available'
                                                        : ticket.quantity > 0
                                                            ? 'Few Left'
                                                            : 'Sold Out'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${isDeparted
                                                ? 'bg-red-500'
                                                : ticket.quantity > 10
                                                    ? 'bg-emerald-500'
                                                    : ticket.quantity > 3
                                                        ? 'bg-amber-500'
                                                        : 'bg-red-500'
                                                }`}
                                            style={{ width: `${Math.min(100, (ticket.quantity / 20) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selector & Booking */}
                        <div className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select Quantity</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Choose number of tickets to book</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleDecrement}
                                            disabled={quantity <= 1 || ticket.quantity <= 0 || isLocked}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${quantity <= 1 || ticket.availableQuantity <= 0 || isLocked
                                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                                                }`}
                                        >
                                            <FaMinus />
                                        </button>

                                        <div className="text-center">
                                            <div className={`text-4xl font-bold ${isLocked ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>{quantity}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                ticket{quantity !== 1 ? 's' : ''}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleIncrement}
                                            disabled={quantity >= ticket.availableQuantity || ticket.availableQuantity <= 0 || isLocked}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${quantity >= ticket.quantity || ticket.quantity <= 0 || isLocked
                                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                                                }`}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>

                                    <div className="h-12 w-px bg-gray-300 dark:bg-gray-600 hidden lg:block" />

                                    <div className="text-right">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Price</div>
                                        <div className={`text-3xl font-bold ${isLocked ? 'text-gray-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                            {formatPrice(totalPrice)} tk
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Perks Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Amenities & Features</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {ticket.perks && Array.isArray(ticket.perks) && ticket.perks.length > 0 ? (
                                    ticket.perks.map((perk, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-center group hover:shadow-md transition-all"
                                        >
                                            <div className="flex justify-center mb-2">
                                                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-gray-700 transition-colors">
                                                    {getPerkIcon(perk)}
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {perk}
                                            </span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8">
                                        <FaInfoCircle className="text-3xl text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">No amenities listed</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isLocked ? (
                            <div className="flex flex-col items-center justify-center gap-3 bg-linear-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 p-6 text-center rounded-2xl">
                                <FaLock className="text-3xl text-gray-600 dark:text-gray-300" />
                                <div className="space-y-2">
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                        {role === 'vendor' || role === 'admin'
                                            ? "Booking Restricted"
                                            : "Booking Closed"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                                        {role === 'vendor'
                                            ? "Vendor accounts cannot book tickets. Please use a user account for bookings."
                                            : role === 'admin'
                                                ? "Admin accounts are for management purposes only. Please use a user account to make bookings."
                                                : `This ticket's departure time was ${new Date(ticket.departureDateTime).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })} at ${new Date(ticket.departureDateTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}. It is no longer available for booking.`
                                        }
                                    </p>

                                    {(isDeparted && (role !== 'vendor' && role !== 'admin')) && (
                                        <div className="mt-4">
                                            <Link
                                                to="/all-tickets"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                            >
                                                <FaTicketAlt />
                                                <span>Browse Available Tickets</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) :
                            ticket.availableQuantity === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-linear-to-r from-red-50 via-red-100/50 to-red-50 dark:from-red-950/30 dark:via-red-900/20 dark:to-red-950/30 border-2 border-red-200 dark:border-red-800/50 rounded-2xl p-8 shadow-lg overflow-hidden"
                                >
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-300 rounded-full -translate-y-16 translate-x-16"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-400 rounded-full -translate-x-8 translate-y-8"></div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                            {/* Icon Section */}
                                            <div className="shrink-0 flex justify-center lg:justify-start">
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 flex items-center justify-center shadow-xl">
                                                        <FaTimesCircle className="text-white text-4xl" />
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white dark:bg-gray-900 rounded-full border-4 border-red-100 dark:border-red-900 flex items-center justify-center">
                                                        <span className="text-red-600 dark:text-red-400 font-bold text-sm">0</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="flex-1">
                                                <div className="text-center lg:text-left mb-6">
                                                    <h3 className="text-2xl md:text-3xl font-bold text-red-800 dark:text-red-300 mb-3">
                                                        Ticket Sold Out!
                                                    </h3>
                                                    <p className="text-red-700/90 dark:text-red-400/90 text-lg mb-4">
                                                        All {ticket.quantity} tickets have been booked. This ticket is no longer available.
                                                    </p>

                                                    {/* Stats Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                        <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl border border-red-200 dark:border-red-800">
                                                            <div className="text-2xl font-bold text-red-700 dark:text-red-400">0</div>
                                                            <div className="text-sm text-red-600/80 dark:text-red-400/80">Available Now</div>
                                                        </div>
                                                        <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl border border-red-200 dark:border-red-800">
                                                            <div className="text-2xl font-bold text-red-700 dark:text-red-400">{ticket.quantity}</div>
                                                            <div className="text-sm text-red-600/80 dark:text-red-400/80">Total Seats</div>
                                                        </div>
                                                        <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl border border-red-200 dark:border-red-800">
                                                            <div className="text-2xl font-bold text-red-700 dark:text-red-400">100%</div>
                                                            <div className="text-sm text-red-600/80 dark:text-red-400/80">Booked</div>
                                                        </div>
                                                        <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl border border-red-200 dark:border-red-800">
                                                            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                                                                {ticket.distance || "350"}km
                                                            </div>
                                                            <div className="text-sm text-red-600/80 dark:text-red-400/80">Distance</div>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="mb-8">
                                                        <div className="flex justify-between text-sm text-red-700/80 dark:text-red-400/80 mb-2">
                                                            <span className="font-semibold">Booking Status: Completely Sold Out</span>
                                                            <span className="font-bold">0 / {ticket.quantity} seats available</span>
                                                        </div>
                                                        <div className="w-full h-3 bg-red-200 dark:bg-red-900/50 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-linear-to-r from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 rounded-full transition-all duration-1000"
                                                                style={{ width: '100%' }}
                                                            />
                                                        </div>
                                                        <div className="flex justify-between mt-1">
                                                            <span className="text-xs text-red-600/70 dark:text-red-400/70">Start: {ticket.from}</span>
                                                            <span className="text-xs text-red-600/70 dark:text-red-400/70">Destination: {ticket.to}</span>
                                                        </div>
                                                    </div>

                                                    {/* Alternative Options */}
                                                    <div className="pt-6 border-t border-red-200 dark:border-red-800/30">
                                                        

                                                        <div className=" ">
                                                            <Link
                                                                to="/all-tickets"
                                                                className=" w-full btn  bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-5 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border-0 h-auto"
                                                            >
                                                                <div className="flex items-center justify-center text-center ">
                                                                    <FaTicketAlt className="text-2xl  group-hover:scale-110 transition-transform" />
                                                                    <div className="font-bold text-lg">Browse Available Tickets</div>
                                                                    <FaChevronRight className=" text-blue-200 group-hover:translate-x-1 transition-transform" />
                                                                </div>
                                                            </Link>

                                                            
                                                        </div>

                                                        {/* Informational Note */}
                                                        <div className="mt-6 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-red-200 dark:border-red-800/50">
                                                            <div className="flex items-start gap-3">
                                                                <FaInfoCircle className="text-blue-500 text-xl mt-0.5 shrink-0" />
                                                                <div>
                                                                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                                        Cancellations sometimes happen! Seats may become available if someone cancels their booking.
                                                                    </p>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                        Check back later or contact support for cancellation updates on this route.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) :
                                (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link
                                            to={'/dashboard/my-bookings'}
                                            onClick={handleBooking}
                                            disabled={ticket.quantity <= 0 || bookingMutation.isPending}
                                            className={`flex-1 py-4 px-6 rounded-xl font-bold text-white text-lg transition-all ${ticket.quantity <= 0
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                {bookingMutation.isPending ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>
                                                            {ticket.quantity <= 0
                                                                ? 'Sold Out'
                                                                : `Book ${quantity} Ticket${quantity !== 1 ? 's' : ''} Now`
                                                            }
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </Link>

                                        
                                    </div>
                                )}

                        {/* Important Notes */}
                        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                            <div className="flex items-start gap-3">
                                <IoIosAlert className="text-amber-500 text-xl mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Important Information</h4>
                                    <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                                        <li>• Please arrive at the station 30 minutes before departure</li>
                                        <li>• E-ticket will be sent to your email after booking</li>
                                        <li>• Cancellation available up to 24 hours before departure</li>
                                        <li>• Children under 5 travel free (without seat)</li>
                                        <li>• Show valid ID and booking confirmation at check-in</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Contact/Support Section */}
            <div className="container mx-auto max-w-6xl px-4 py-8">
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Need Assistance?</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Our customer support team is available 24/7
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                            <FaPhoneAlt className="text-blue-500" />
                            <span className="font-medium">Call Support</span>
                        </button>
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                            <FaQuestionCircle className="text-emerald-500" />
                            <span className="font-medium">Live Chat</span>
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}