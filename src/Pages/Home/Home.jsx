import React from 'react';
import Hero from './Hero';
import LatestTickets from './LatestTickets';
import { Link } from 'react-router';
import { FaArrowRight, FaCompass, FaTicketAlt, FaRocket, FaShieldAlt, FaChartLine, FaStar, FaCrown } from 'react-icons/fa';
import { GiTicket } from 'react-icons/gi';
import Advertised from './Advertised';

const Home = () => {
    return (
        <div className=" ">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <div className="relative z-10">
                <Hero />
            </div>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 py-8 md:px-6 lg:px-8">


                {/* Advertised Tickets Section */}
                <div className="mb-20">
                    <div className="relative">
                        {/* Decorative Border */}
                        <div className="absolute -inset-1 bg-linear-to-r from-orange-500 via-red-500 to-pink-500 dark:from-orange-600 dark:via-red-600 dark:to-pink-600 rounded-3xl blur-md opacity-20"></div>

                        {/* Content */}
                        <div className="relative bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="absolute top-0 right-0 w-full h-32 bg-linear-to-br from-orange-500/10 to-red-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 rounded-2xl bg-linear-to-r from-orange-500 to-red-500 dark:from-orange-700 dark:to-red-800 shadow-lg">
                                        <FaCrown className="text-2xl text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                            <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-600 to-red-600
                                            dark:from-orange-800 dark:to-red-800 mr-4 md:mt-0">
                                                Featured Travel Deals
                                            </span>
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Exclusive offers you won't find anywhere else
                                        </p>
                                    </div>
                                </div>
                                <Advertised />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Latest Tickets Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                <div className="relative bg-linear-to-r from-emerald-500 to-blue-500 text-white p-4 rounded-full shadow-xl">
                                    <FaTicketAlt className="text-2xl" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-blue-600">
                                Latest Travel Tickets
                            </span>
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                            Stay updated with the newest travel options and last-minute deals
                        </p>
                    </div>

                    <div className="relative">
                        {/* Floating Elements */}
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-linear-to-br from-emerald-200 to-blue-200 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-full blur-2xl opacity-50"></div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-linear-to-br from-blue-200 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full blur-2xl opacity-50"></div>

                        {/* Latest Tickets Card */}
                        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                            <div className="p-6 md:p-8">
                                <LatestTickets />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-24">
                    <div className="relative bg-linear-to-br from-emerald-500 via-blue-500 to-purple-600 dark:from-emerald-950 dark:via-blue-950 dark:to-purple-950 rounded-3xl shadow-2xl overflow-hidden">
                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '30px'
                            }}></div>
                        </div>

                        <div className="relative z-10 p-10 md:p-14 text-center">
                            <div className="max-w-3xl mx-auto">
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    Ready to Start Your Journey?
                                </h3>

                                <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                                    Join thousands of satisfied travelers who have booked their perfect trips with us
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
                                        <p className="text-white/80">Happy Travelers</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.8%</div>
                                        <p className="text-white/80">Satisfaction Rate</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
                                        <p className="text-white/80">Customer Support</p>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <div className=" ">
                                        <Link
                                            to={`/all-tickets`}
                                            className="group/btn w-full inline-flex items-center justify-center gap-2 px-9 py-5 bg-  bg-linear-to-l from-green-500 to-green-900 dark:to-black/90 dark:from-black/20 
                                                                        hover:from-10% hover:to-40%
                                                                         text-white  rounded-full font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                                        >
                                            <span>Explore All Tickets</span>
                                            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>

                                    <Link
                                        to="/dashboard"
                                        className="group relative inline-flex items-center justify-center gap-3 bg-transparent text-white font-bold px-9 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-white/30 hover:border-white"
                                    >
                                        <span>Go to Dashboard</span>
                                        <FaStar className="text-yellow-300 group-hover:rotate-180 transition-transform duration-500" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* Feature Cards Section */}
            <div className="mb-16 mt-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="h-1 w-20 bg-linear-to-r from-transparent via-emerald-500 to-transparent"></div>
                        <GiTicket className="text-4xl text-emerald-500 animate-bounce" />
                        <div className="h-1 w-20 bg-linear-to-r from-transparent via-blue-500 to-transparent"></div>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-600 via-blue-600 to-purple-600">
                            Why Choose TicketBari?
                        </span>
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Experience seamless travel booking with our premium features
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50">
                        <div className="absolute inset-0 bg-linear-to-br from-emerald-100/30 to-transparent dark:from-emerald-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-green-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <FaShieldAlt className="text-2xl text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure Booking</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Your transactions are 100% secure with bank-level encryption
                            </p>
                        </div>
                    </div>

                    <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50">
                        <div className="absolute inset-0 bg-linear-to-br from-blue-100/30 to-transparent dark:from-blue-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <FaRocket className="text-2xl text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Instant Confirmation</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Get your tickets confirmed instantly with real-time updates
                            </p>
                        </div>
                    </div>

                    <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50">
                        <div className="absolute inset-0 bg-linear-to-br from-purple-100/30 to-transparent dark:from-purple-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <FaChartLine className="text-2xl text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Best Prices</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We guarantee the lowest prices with our price match promise
                            </p>
                        </div>
                    </div>

                    <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50">
                        <div className="absolute inset-0 bg-linear-to-br from-orange-100/30 to-transparent dark:from-orange-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500 to-red-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <FaCompass className="text-2xl text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Easy Refunds</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Simple and quick refund process within 24 hours
                            </p>
                        </div>
                    </div>
                </div>
            </div>



            {/* Add animation keyframes for blob animation */}
            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animate-ping-slow {
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;