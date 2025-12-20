import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { FaCheckCircle, FaTicketAlt, FaReceipt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sessionId = searchParams.get('session_id');
    const ticketId = searchParams.get('ticketId');
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    console.log("URL Parameters:", { sessionId, ticketId });

    useEffect(() => {
        if (!sessionId) {
            setError("No session ID found in URL");
            setLoading(false);
            return;
        }

        const processPaymentSuccess = async () => {
            try {
                setLoading(true);
                console.log("Calling payment-success API with session_id:", sessionId);
                
                const response = await axiosSecure.patch(`/payment-success?session_id=${sessionId}`);
                console.log("API Response:", response.data);
                
                if (response.data.success) {
                    setPaymentInfo({
                        bookingReference: response.data.bookingReference,
                        ticketId: response.data.ticketId,
                        status: response.data.status,
                        paymentStatus: response.data.paymentStatus
                    });
                    
                    toast.success("Payment confirmed successfully!");
                } else {
                    setError(response.data.error || "Failed to process payment");
                }
            } catch (error) {
                console.error("Payment success error:", error);
                setError(error.response?.data?.error || "Failed to confirm payment");
                toast.error("Failed to confirm payment");
            } finally {
                setLoading(false);
            }
        };

        processPaymentSuccess();
    }, [sessionId, axiosSecure]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-700">Processing Payment...</h2>
                    <p className="text-gray-600 mt-2">Please wait while we confirm your payment</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
                    <div className="text-red-500 text-6xl mb-4">
                        <FaCheckCircle className="mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/dashboard/my-bookings')}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        >
                            Go to My Bookings
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-200 rounded-full mb-6">
                        <FaCheckCircle className="text-5xl text-green-600 dark:text-green-900" />

                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3 dark:text-white">
                        Payment Successful!
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-white">
                        Your ticket has been booked successfully
                    </p>
                </div>

                {/* Payment Details Card */}
                <div className="bg-white dark:bg-gray-700  rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-green-600 dark:bg-green-950 text-white  p-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <FaTicketAlt className="mr-3" />
                            Booking Confirmation
                        </h2>
                    </div>
                    
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-3">
                                    <span className="text-gray-600 font-medium dark:text-white">Booking Status:</span>
                                    <span className="px-4 py-1 bg-green-100 dark:bg-gray-600 dark:text-green-100 text-green-800 rounded-full font-bold">
                                        CONFIRMED
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center border-b pb-3">
                                    <span className="text-gray-600 font-medium dark:text-white">Payment Status:</span>
                                    <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">
                                        PAID
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center border-b pb-3">
                                    <span className="text-gray-600 font-medium dark:text-white">Payment Date:</span>
                                    <span className="font-bold text-gray-600 dark:text-white">
                                        {new Date().toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <FaReceipt className="text-gray-400 mr-2" />
                                        <span className="text-gray-600 dark:text-white">Booking Reference:</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 tracking-wider dark:text-white">
                                        {paymentInfo.bookingReference || 'N/A'}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 dark:text-white">
                                        Keep this reference for future inquiries
                                    </p>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                                    <div className="text-gray-600 mb-1 dark:text-white">Transaction ID:</div>
                                    <div className="font-mono text-sm text-gray-800 dark:text-white break-all">
                                        {sessionId}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Important Notes */}
                        <div className="mt-8 p-4 bg-yellow-50 dark:bg-gray-600 border border-yellow-200 rounded-lg">
                            <h3 className="font-bold text-yellow-800 dark:text-white mb-2 ">Important Information:</h3>
                            <ul className="text-sm text-yellow-700 space-y-1 dark:text-white">
                                <li>• Please save your booking reference for future reference</li>
                                <li>• You will receive an email confirmation shortly</li>
                                <li>• Present your booking reference at the boarding point</li>
                                <li>• Please arrive at least 30 minutes before departure</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        to="/dashboard/my-bookings" 
                        className="inline-flex items-center justify-center px-6 py-3 bg-green-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg"
                    >
                        <FaTicketAlt className="mr-2" />
                        View My Tickets
                    </Link>
                    
                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition"
                    >
                        Print Receipt
                    </button>
                    
                    <Link 
                        to="/" 
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700 transition"
                    >
                        Back to Home
                    </Link>
                </div>

                {/* Next Steps */}
                <div className="mt-12 bg-white dark:bg-gray-600 rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">What's Next?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                                1
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2 dark:text-white">Check Your Email</h4>
                            <p className="text-gray-600 text-sm dark:text-white">
                                You'll receive a confirmation email with your ticket details
                            </p>
                        </div>
                        <div className="text-center ">
                            <div className="w-12 h-12 bg-blue-100  text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                                2
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2 dark:text-white">Save Your Ticket</h4>
                            <p className="text-gray-600 text-sm dark:text-white">
                                Download or screenshot your ticket for boarding
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                                3
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2 dark:text-white">Travel Day</h4>
                            <p className="text-gray-600 text-sm dark:text-white">
                                Arrive early with your ID and booking reference
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;