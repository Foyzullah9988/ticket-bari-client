import React, { useState, useEffect } from "react";
import Navbar from "../Components/Shared/Navbar";
import Footer from "../Components/Shared/Footer";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
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
    FaExclamationTriangle
} from "react-icons/fa";
import { MdAirlineSeatReclineNormal, MdEventSeat } from "react-icons/md";
import Skeleton2 from "../Components/Shared/Skeleton2";

export default function TicketDetails() {
    const axiosSecure = useAxiosSecure();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    const { data: ticket, isLoading, error } = useQuery({
        queryKey: ['ticket', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tickets/${id}`);
            return res.data;
        },
        enabled: !!id,
        retry: 2,
    });

    useEffect(() => {
        if (ticket?.price) {
            setTotalPrice(ticket.price * quantity);
        }
    }, [quantity, ticket?.price]);

    // Transport icon mapping
    const getTransportIcon = (type) => {
        const transportMap = {
            bus: <FaBus className="text-2xl text-blue-400" />,
            train: <FaTrain className="text-2xl text-emerald-400" />,
            plane: <FaPlane className="text-2xl text-purple-400" />,
            ship: <FaShip className="text-2xl text-indigo-400" />,
            car: <FaCar className="text-2xl text-orange-400" />,
        };
        return transportMap[type?.toLowerCase()] || <FaBus className="text-2xl text-gray-400" />;
    };

    // Perk icon mapping
    const getPerkIcon = (perk) => {
        const perkLower = perk.toLowerCase();
        if (perkLower.includes('wifi') || perkLower.includes('wi-fi')) {
            return <FaWifi className="text-cyan-400" />;
        } else if (perkLower.includes('food') || perkLower.includes('meal')) {
            return <FaUtensils className="text-amber-400" />;
        } else if (perkLower.includes('tv') || perkLower.includes('entertainment')) {
            return <FaTv className="text-purple-400" />;
        } else if (perkLower.includes('ac') || perkLower.includes('air')) {
            return <FaSnowflake className="text-blue-400" />;
        } else if (perkLower.includes('power') || perkLower.includes('charg')) {
            return <FaBolt className="text-yellow-400" />;
        } else if (perkLower.includes('safe') || perkLower.includes('security')) {
            return <FaShieldAlt className="text-green-400" />;
        } else {
            return <FaStar className="text-yellow-400" />;
        }
    };

    if (isLoading)
        return (

            <div className='flex flex-col min-h-screen'>
                <Navbar fixed={false} />
                <div className='flex-1 container mx-auto mt-2 h-full w-full max-w-4xl p-6 flex items-center justify-center'>
                    <Skeleton2 />
                </div>
                <Footer />
            </div>
        )
            ;

    if (error) {
        console.error('Error fetching ticket:', error);
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar fixed={false} />
                <div className="flex-1 bg-black flex items-center justify-center p-6">
                    <div className="text-white text-center">
                        <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
                        <p className="text-xl">Error loading ticket details. Please try again.</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!ticket) {
        return <Loading />
    }

    const handleCountdown = (countdown) => {
        const now = new Date();
        const target = new Date(countdown);

        const timeLeft = target - now;

        if (timeLeft < 0) return 'Expired'

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);

        return `${days}d ${hours}h ${minutes}m`
    }

    const handleIncrement = () => {
        const maxQuantity = ticket.quantity;
        if (quantity < maxQuantity) {
            setQuantity(prev => prev + 1);
        }
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD').format(price);
    }

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-br from-gray-900 to-black">
            <Navbar fixed={false} />
            <div className="flex-1 flex items-center justify-center p-4 md:p-6">
                <div className="w-full max-w-4xl bg-linear-to-br from-gray-900 via-gray-900 to-black text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-800">
                    {/* Header with Ticket Icon */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <FaTicketAlt className="text-3xl text-emerald-400" />
                            <div>
                                <h1 className="text-2xl font-bold">Ticket Details</h1>
                                <p className="text-gray-400 text-sm">Complete booking information</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <FaTag className="text-2xl text-yellow-400" />
                        </div>
                    </div>

                    {/* Image and Countdown Section */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-8">
                        <div className="lg:w-2/5">
                            <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/20">
                                <img
                                    src={ticket.image}
                                    className="h-64 w-full object-cover"
                                    alt={ticket.title}
                                />
                                <div className="absolute top-4 left-4">
                                    <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                                        {getTransportIcon(ticket.transportType)}
                                        <span className="font-bold capitalize">{ticket.transportType}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-3/5">
                            <div className="bg-linear-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                                <h2 className="text-2xl font-bold mb-4 text-center">{ticket.title}</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-800/50 p-4 rounded-xl">
                                        <div className="flex lg:flex-col items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-emerald-400" />
                                                <span className="text-gray-400">Departure In</span>
                                            </div>
                                            <div className="bg-emerald-900/30 px-3 py-1 rounded-full">
                                                <p className="text-emerald-400 font-bold">{handleCountdown(ticket.departureDateTime)}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-end">Until departure</p>
                                    </div>

                                    <div className="bg-gray-800/50 p-4 rounded-xl">
                                        <div className="flex  lg:flex-col items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <FaTag className="text-yellow-400" />
                                                <span className="text-gray-400">Price</span>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{formatPrice(ticket.price)} tk</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-end text-gray-500">Per ticket</p>
                                    </div>
                                </div>

                                {/* Route Information */}
                                <div className="bg-gray-800/30 rounded-xl p-4 mb-4">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <FaMapMarkerAlt className="text-emerald-400" />
                                        <span className="text-gray-400">Route</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-4 text-lg font-bold">
                                        <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
                                            <span>{ticket.from}</span>
                                        </div>
                                        <FaLongArrowAltRight className="text-xl text-gray-400" />
                                        <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
                                            <span>{ticket.to}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule and Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Departure Details */}
                        <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FaCalendarAlt className="text-cyan-400" />
                                Departure Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-700 p-3 rounded-lg">
                                            <FaClock className="text-2xl text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Time</p>
                                            <p className="font-bold text-xl">
                                                {new Date(ticket.departureDateTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-700 p-3 rounded-lg">
                                            <FaCalendarAlt className="text-2xl text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Date</p>
                                            <p className="font-bold text-xl">
                                                {new Date(ticket.departureDateTime).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Information */}
                        <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                {getTransportIcon(ticket.transportType)}
                                Vehicle Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-800/50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <MdAirlineSeatReclineNormal className="text-2xl text-purple-400" />
                                        <div>
                                            <p className="text-gray-400 text-sm">Available</p>
                                            <p className="font-bold text-2xl">{ticket.quantity || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">Seats</p>
                                </div>

                                <div className="bg-gray-800/50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaChair className="text-2xl text-rose-400" />
                                        <div>
                                            <p className="text-gray-400 text-sm">Class</p>
                                            <p className="font-bold text-2xl">Standard</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">Comfort</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="bg-linear-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                                    <MdEventSeat className="text-emerald-400" />
                                    Select Quantity
                                </h3>
                                <p className="text-gray-400">Choose number of tickets to book</p>
                            </div>
                            <div className="flex items-center space-x-6">
                                <button
                                    onClick={handleDecrement}
                                    disabled={quantity <= 1}
                                    className={`p-4 rounded-full ${quantity <= 1 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 hover:scale-105 transition-all'} shadow-lg`}
                                >
                                    <FaMinus className="text-xl" />
                                </button>

                                <div className="text-center">
                                    <div className="text-5xl font-bold bg-linear-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                                        {quantity}
                                    </div>
                                    <div className="text-gray-400 text-sm mt-1">ticket{quantity > 1 ? 's' : ''}</div>
                                </div>

                                <button
                                    onClick={handleIncrement}
                                    disabled={quantity >= ticket.quantity}
                                    className={`p-4 rounded-full ${quantity >= ticket.quantity ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 hover:scale-105 transition-all'} shadow-lg`}
                                >
                                    <FaPlus className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t border-gray-700 pt-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <FaTicketAlt className="text-gray-400" />
                                        <span className="text-gray-400">Price per ticket</span>
                                    </div>
                                    <span className="font-semibold">{formatPrice(ticket.price)} tk</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <FaTag className="text-gray-400" />
                                        <span className="text-gray-400">Quantity</span>
                                    </div>
                                    <span className="font-semibold">{quantity} × {formatPrice(ticket.price)} tk</span>
                                </div>
                                <div className="pt-4 border-t border-gray-700">
                                    <div className="flex justify-between items-center text-xl font-bold">
                                        <div className="flex items-center gap-2">
                                            <FaCheckCircle className="text-emerald-400" />
                                            <span>Total Price</span>
                                        </div>
                                        <span className="text-2xl text-emerald-400 bg-linear-to-r from-emerald-900/20 to-green-900/20 px-4 py-2 rounded-lg">
                                            {formatPrice(totalPrice)} tk
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Perks Section */}
                    <div className="bg-linear-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FaStar className="text-yellow-400" />
                            Ticket Perks & Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ticket.perks && Array.isArray(ticket.perks) && ticket.perks.length > 0 ? (
                                ticket.perks.map((perk, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all group">
                                        <div className="p-3 rounded-lg bg-gray-700 group-hover:scale-110 transition-transform">
                                            {getPerkIcon(perk)}
                                        </div>
                                        <span className="font-medium text-lg">{perk}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-gray-400 text-center p-8 bg-gray-800/30 rounded-xl">
                                    <FaInfoCircle className="text-3xl mx-auto mb-3 text-gray-500" />
                                    <p>No special perks available for this ticket</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Book Now Button */}
                    <button className="w-full bg-linear-to-r from-emerald-500 via-green-500 to-emerald-600 text-white py-5 rounded-2xl font-bold text-xl hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 group">
                        <FaCheckCircle className="group-hover:rotate-12 transition-transform" />
                        Book {quantity} Ticket{quantity > 1 ? 's' : ''} for {formatPrice(totalPrice)} tk
                    </button>

                    {/* Seats Warning */}
                    {ticket.quantity < 5 && (
                        <div className="mt-6 p-4 bg-linear-to-r from-amber-900/20 to-yellow-900/20 rounded-xl border border-amber-700/30">
                            <div className="flex items-center gap-3">
                                <FaExclamationTriangle className="text-amber-400 text-xl" />
                                <p className="text-amber-300 font-medium">
                                    ⚠️ Hurry! Only {ticket.quantity} seat{ticket.quantity > 1 ? 's' : ''} left at this price!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}