import React from 'react';
import { FaCalendarAlt, FaCompass, FaPlusCircle, FaSearch, FaTicketAlt  } from 'react-icons/fa';
import { FaTicket } from "react-icons/fa6";
import { Link } from 'react-router';

const EmptyComponent = () => {
    return (
        <div className="col-span-full">
            <div className="text-center py-12 px-6 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 shadow-2xl">
                
                {/* Animated Icon Container */}
                <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-400 to-cyan-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
                    <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                        <div className="relative">
                            <FaTicket className="text-6xl text-emerald-500 dark:text-emerald-400 animate-bounce" />
                            <FaSearch className="absolute -top-2 -right-2 text-2xl text-amber-500 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Title and Message */}
                <h3 className="text-3xl font-bold mb-4 bg-linear-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    No Tickets Available
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
                    Currently there are no approved tickets available. This could be because:
                </p>

                {/* Reasons List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400 text-xl" />
                        </div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">New Tickets Coming Soon</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Vendors are preparing new exciting travel options
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <FaCompass className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Under Verification</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            New tickets are being reviewed for quality assurance
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <FaTicketAlt className="text-purple-600 dark:text-purple-400 text-xl" />
                        </div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Check Back Later</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            More tickets will be available soon. Stay tuned!
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                        onClick={() => window.location.reload()}
                        className="group inline-flex items-center gap-3 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <FaSearch className="group-hover:animate-spin" />
                        Refresh Tickets
                    </button>
                    
                    <Link
                        to="/all-tickets"
                        className="inline-flex items-center gap-3 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300"
                    >
                        <FaPlusCircle />
                        Browse All Tickets
                    </Link>
                </div>

                {/* Fun Animation */}
                <div className="mt-10">
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <div 
                                    key={i}
                                    className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                ></div>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            Waiting for new tickets...
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmptyComponent;