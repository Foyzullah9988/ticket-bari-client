import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../../Components/Shared/Loading';
import { toast } from 'react-hot-toast';

const Payment = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    
    console.log('ticketId from params:', ticketId);
    
    const { 
        isLoading, 
        isError, 
        error, 
        data: ticket, 
        refetch 
    } = useQuery({
        queryKey: ['booking', ticketId],
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/bookings/${ticketId}`);
                console.log('Booking data received:', res.data);
                return res.data;
            } catch (error) {
                console.error('API Error:', error);
                toast.error('Failed to load booking details');
                throw error;
            }
        },
        retry: 2,
    });

    const handlePayment = async () => {
        if (!ticket) {
            toast.error('Ticket information not available');
            return;
        }
        
        console.log('Processing payment for ticket:', ticket);
        
        try {
            const paymentInfo = {
                totalPrice: ticket.totalPrice,
                ticketId: ticket._id,
                userEmail: ticket.userEmail,
                ticketTitle: ticket.ticketTitle,
                bookingReference: ticket.bookingReference,
                userName: ticket.userName,
                vendorEmail: ticket.vendorEmail,
                from: ticket.from,
                to: ticket.to,
                quantity: ticket.quantity,
                status: ticket.status
            };
            
            console.log('Sending payment info:', paymentInfo);
            
            const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
            
            if (res.data.url) {
                console.log('Redirecting to payment URL:', res.data.url);
                window.location.href = res.data.url;
            } else {
                toast.error('Payment URL not received');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
        }
    };

    // Debug effect
    useEffect(() => {
        console.log('Ticket data state:', { isLoading, isError, ticket });
    }, [isLoading, isError, ticket]);

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Ticket</h2>
                    <p className="text-gray-600 mb-4">{error?.message || 'Failed to load ticket details'}</p>
                    <button 
                        onClick={() => refetch()}
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                    <button 
                        onClick={() => navigate('/dashboard/my-bookings')}
                        className="btn btn-outline ml-4"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Ticket Not Found</h2>
                    <p className="text-gray-600">The ticket you're looking for doesn't exist or has been removed.</p>
                    <button 
                        onClick={() => navigate('/dashboard/my-bookings')}
                        className="btn btn-primary mt-4"
                    >
                        View My Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        Payment Details
                    </div>
                    
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                        {ticket.ticketTitle || 'Ticket Payment'}
                    </h2>
                    
                    <div className="mt-6 space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Booking Reference:</span>
                            <span className="font-semibold">{ticket.bookingReference || 'N/A'}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Travel Route:</span>
                            <span className="font-semibold">
                                {ticket.from} → {ticket.to}
                            </span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Passenger:</span>
                            <span className="font-semibold">{ticket.userName}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tickets:</span>
                            <span className="font-semibold">{ticket.quantity}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Price per ticket:</span>
                            <span className="font-semibold">
                                ৳{ticket.pricePerTicket || Math.round(ticket.totalPrice / ticket.quantity)}
                            </span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-semibold ${
                                ticket.status === 'pending' ? 'text-yellow-600' : 
                                ticket.status === 'accepted' ? 'text-green-600' : 
                                'text-red-600'
                            }`}>
                                {ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1)}
                            </span>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-lg">
                                <span className="font-bold text-gray-900">Total Amount:</span>
                                <span className="font-bold text-green-600 text-xl">৳{ticket.totalPrice}</span>
                            </div>
                        </div>
                        
                        <div className="pt-6">
                            <button 
                                onClick={handlePayment}
                                disabled={ticket.status === 'cancelled'}
                                className={`w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ${
                                    ticket.status === 'cancelled' 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {ticket.status === 'cancelled' 
                                    ? 'Booking Cancelled' 
                                    : `Pay Now - ৳${ticket.totalPrice}`}
                            </button>
                            
                            {ticket.status === 'cancelled' && (
                                <p className="mt-2 text-sm text-red-600 text-center">
                                    This booking has been cancelled and cannot be paid for.
                                </p>
                            )}
                            
                            <p className="mt-4 text-sm text-gray-500 text-center">
                                You will be redirected to a secure payment page
                            </p>
                            
                            <button 
                                onClick={() => navigate('/dashboard/my-bookings')}
                                className="w-full mt-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition"
                            >
                                Back to Bookings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;