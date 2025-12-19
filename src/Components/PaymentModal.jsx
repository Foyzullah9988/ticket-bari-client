// Components/Shared/PaymentModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTimes,
    FaCreditCard,
    FaMobileAlt,
    FaWallet,
    FaLock,
    FaCheckCircle,
    FaExclamationCircle
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';

export default function PaymentModal({ isOpen, onClose, onSuccess, bookingData, isLoading }) {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [pin, setPin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate payment processing
        const paymentData = {
            paymentId: `PAY${Date.now()}`,
            method: paymentMethod,
            amount: bookingData?.totalPrice,
            timestamp: new Date().toISOString()
        };

        setTimeout(() => {
            onSuccess(paymentData);
        }, 2000);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD').format(price);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MdPayment className="text-2xl text-emerald-500" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Complete Payment
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Secure payment powered by SSL
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Booking Summary */}
                        <div className="p-6">
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    Booking Summary
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Ticket:</span>
                                        <span className="font-medium">{bookingData?.ticketTitle}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Route:</span>
                                        <span className="font-medium">{bookingData?.from} → {bookingData?.to}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Passengers:</span>
                                        <span className="font-medium">{bookingData?.quantity} person(s)</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between font-bold">
                                            <span>Total Amount:</span>
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                {formatPrice(bookingData?.totalPrice || 0)} tk
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    Select Payment Method
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'card'
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                                            }`}
                                    >
                                        <FaCreditCard className={`text-xl mx-auto mb-2 ${paymentMethod === 'card' ? 'text-emerald-500' : 'text-gray-400'
                                            }`} />
                                        <span className="text-sm font-medium">Credit Card</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('mobile')}
                                        className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'mobile'
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                                            }`}
                                    >
                                        <FaMobileAlt className={`text-xl mx-auto mb-2 ${paymentMethod === 'mobile' ? 'text-emerald-500' : 'text-gray-400'
                                            }`} />
                                        <span className="text-sm font-medium">Mobile</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('wallet')}
                                        className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'wallet'
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                                            }`}
                                    >
                                        <FaWallet className={`text-xl mx-auto mb-2 ${paymentMethod === 'wallet' ? 'text-emerald-500' : 'text-gray-400'
                                            }`} />
                                        <span className="text-sm font-medium">Wallet</span>
                                    </button>
                                </div>
                            </div>

                            {/* Payment Form */}
                            <form onSubmit={handleSubmit}>
                                {paymentMethod === 'card' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    value={expiryDate}
                                                    onChange={(e) => setExpiryDate(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="123"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'mobile' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Mobile Number
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="01XXXXXXXXX"
                                                value={mobileNumber}
                                                onChange={(e) => setMobileNumber(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                PIN
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Enter PIN"
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Security Notice */}
                                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FaLock className="text-emerald-500" />
                                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                            Your payment is secure and encrypted. We never store your card details.
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-6 w-full py-4 bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Processing Payment...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle />
                                            Pay {formatPrice(bookingData?.totalPrice || 0)} tk
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}