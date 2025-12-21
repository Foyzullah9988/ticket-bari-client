import React, { use } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { AuthContext } from '../../../Context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { FaSpinner, FaReceipt, FaCalendarAlt, FaTag, FaDollarSign } from 'react-icons/fa';
import { format } from 'date-fns';

const TransactionHistory = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = use(AuthContext);

    const { data: bookingsS = [], isLoading, error } = useQuery({
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

    const bookings = bookingsS.filter(boo => boo.status === 'paid').sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))


    const formatCurrency = (amount) => {

        const amountInTk = amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'bdt',
        }).format(amountInTk);
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
        } catch {
            return 'Invalid date';
        }
    };

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
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">Error loading transactions: {error.message}</p>
            </div>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div className="bg-linear-to-br from-gray-50 to-blue-50 rounded-2xl p-8 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                    <FaReceipt className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No transactions found</h3>
                <p className="text-gray-600">You haven't made any ticket purchases yet.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-indigo-50 dark:from-gray-600 dark:to-gray-700 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 dark:text-white">
                        Transaction History
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2 dark:text-gray-200">
                        <FaReceipt className="text-blue-500 dark:text-gray-200" />
                        Your Stripe payment transactions for all ticket purchases
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                            <h3 className="font-semibold text-gray-700 mb-2">Total Spent</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(
                                    bookings.reduce((total, booking) =>
                                        total + (booking.totalPrice || 0), 0
                                    )
                                )}
                            </p>
                        </div>
                        <div className="bg-linear-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                            <h3 className="font-semibold text-gray-700 mb-2">Successful Payments</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {bookings.filter(b => b.status === 'paid').length}
                            </p>
                        </div>
                        <div className="bg-linear-to-r from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
                            <h3 className="font-semibold text-gray-700 mb-2">Last Transaction</h3>
                            <p className="text-gray-900 truncate">
                                {bookings.length > 0
                                    ? formatDate(
                                        bookings.reduce((latest, booking) =>
                                            new Date(booking.paymentDate) > new Date(latest.paymentDate)
                                                ? booking
                                                : latest
                                        ).paymentDate
                                    )
                                    : 'No transactions'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-linear-to-r from-gray-50 to-blue-50 dark:from-gray-600 dark:to-gray-700 border-b border-gray-200">
                                    <th className="py-4 px-6 text-left">
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-white  font-semibold">
                                            <FaReceipt className="text-blue-500 dark:text-white" />
                                            Transaction ID
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 text-left">
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-white font-semibold">
                                            <FaDollarSign className="text-green-500 dark:text-white" />
                                            Amount
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 text-left">
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-white font-semibold">
                                            <FaTag className="text-purple-500 dark:text-white" />
                                            Ticket Title
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 text-left">
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-white font-semibold">
                                            <FaCalendarAlt className="text-orange-500 dark:text-white" />
                                            Payment Date
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 text-left text-gray-700 dark:text-white font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookings.map((booking) => (
                                    <tr
                                        key={booking.bookingReference}
                                        className="hover:bg-blue-50/50 transition-colors duration-150"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                    <FaReceipt className="text-gray-600 " />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {booking.bookingReference}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate max-w-[200px] dark:text-gray-200">
                                                        Stripe Payment
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <span className="p-2 bg-green-100 rounded-lg">
                                                    <FaDollarSign className="text-green-600" />
                                                </span>
                                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(booking.totalPrice)} tk
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="max-w-[250px]">
                                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                                    {booking.ticketTitle}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-200">
                                                    General Admission
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-gray-400 dark:text-white" />
                                                <span className="text-gray-700 dark:text-white">
                                                    {formatDate(booking.createdAt || booking.paymentDate)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : booking.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Completed'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                </div>

                {/* Summary Card */}

            </div>
        </div>
    );
};

export default TransactionHistory;