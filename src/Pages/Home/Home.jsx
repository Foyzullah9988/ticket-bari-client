import React from 'react';
import Hero from './Hero';
import LatestTickets from './LatestTickets';
import { Link } from 'react-router'; // Fixed import
import { FaArrowRight } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="min-h-screen bg-  linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <Hero />
            
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
                {/* Header with decorative elements */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="h-1 w-16 bg-  linear-to-r from-transparent via-green-500 to-transparent mr-4"></div>
                        <h2 className="text-3xl md:text-4xl font-bold bg-  linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            Latest Tickets
                        </h2>
                        <div className="h-1 w-16 bg-  linear-to-r from-transparent via-blue-500 to-transparent ml-4"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                        Stay updated with the most recent support tickets. Click on any ticket to view details or create a new one.
                    </p>
                </div>

                {/* Latest Tickets Section */}
                <div className="mb-16">
                    <div className="relative">
                        {/* Background decoration */}
                        <div className="absolute -inset-4 bg-  linear-to-r from-green-100/30 to-blue-100/30 dark:from-green-900/10 dark:to-blue-900/10 rounded-3xl blur-xl opacity-50"></div>
                        
                        {/* Card Container */}
                        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8">
                            <LatestTickets />
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-20">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                            Need to see more?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8">
                            Explore all tickets in our comprehensive dashboard. Track progress, filter by status, and manage everything in one place.
                        </p>
                    </div>

                    {/* Animated Button Container */}
                    <div className="flex justify-center items-center">
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-  linear-to-r from-green-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                            
                            {/* Main button */}
                            <Link
                                to="/all-tickets"
                                className="relative inline-flex items-center justify-center gap-3 bg-linear-to-l to-green-500 from-green-900 dark:from-black/90 dark:to-black/5
                                    hover:from-10% hover:to-40% text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
                            >


                                <span className="relative z-10">View All Tickets</span>
                                <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                                
                                {/* Hover effect circles */}
                                <span className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping-slow opacity-0 group-hover:opacity-100"></span>
                            </Link>
                        </div>
                    </div>

                    {/* Stats or Additional Info */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="text-center p-6 rounded-xl bg-  linear-to-br from-green-50 to-transparent dark:from-green-900/20 border border-green-100 dark:border-green-800/30">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">24/7</div>
                            <p className="text-gray-700 dark:text-gray-300">Support Available</p>
                        </div>
                        
                        <div className="text-center p-6 rounded-xl bg-  linear-to-br from-blue-50 to-transparent dark:from-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">99%</div>
                            <p className="text-gray-700 dark:text-gray-300">Resolution Rate</p>
                        </div>
                        
                        <div className="text-center p-6 rounded-xl bg-  linear-to-br from-purple-50 to-transparent dark:from-purple-900/20 border border-purple-100 dark:border-purple-800/30">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">15min</div>
                            <p className="text-gray-700 dark:text-gray-300">Avg. Response Time</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Note */}
            <footer className="mt-20 py-8 text-center border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Powered by <span className="font-semibold text-green-600 dark:text-green-400">SupportHub</span> • 
                    Efficient ticket management system
                </p>
                <div className="mt-2 flex justify-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-300"></div>
                </div>
            </footer>
        </div>
    );
};

export default Home;