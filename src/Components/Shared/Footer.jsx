import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaFacebook, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { SiMastercard, SiPaypal, SiStripe, SiVisa } from 'react-icons/si';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <div className='bg-base-200 dark:bg-gray-900'>
            <footer className="container mx-auto px-4 py-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info Column */}
                    <div className="space-y-4">
                        <Link to="/" className="inline-flex items-center gap-3 mb-4">
                            <figure>
                                <img
                                    src='/travel.png'
                                    alt='Ticket Bari'
                                    className="w-12 h-12 object-contain rounded-lg"
                                    referrerPolicy="no-referrer"
                                />
                            </figure>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold dark:text-white">Ticket Bari</span>
                                <span className="text-sm opacity-80 dark:text-gray-300">Online Ticket Booking</span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-neutral-700 dark:text-gray-300">
                            Book bus, train, launch & flight tickets easily. Discover schedules, compare
                            prices and checkout securely — all in one place.
                        </p>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Quick Links</h3>
                        <nav className="flex flex-col space-y-3">
                            <Link to="/" className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-white">Home</Link>
                            <Link to="/all-tickets" className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-white">All Tickets</Link>
                            <Link to="/about" className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-white">About us</Link>
                            <Link to="/careers" className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-white">Careers</Link>
                            <Link to="/contact" className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-white">Contact</Link>
                        </nav>
                    </div>

                    {/* Payment Methods Column */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Payment Methods</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 hover:bg-base-300 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                                <SiStripe className="text-indigo-500 text-xl" />
                                <span className="dark:text-gray-300">Stripe</span>
                            </li>
                            <li className="flex items-center gap-3 hover:bg-base-300 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                                <SiVisa className="text-blue-500 text-xl" />
                                <span className="dark:text-gray-300">Visa</span>
                            </li>
                            <li className="flex items-center gap-3 hover:bg-base-300 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                                <SiMastercard className="text-red-500 text-xl" />
                                <span className="dark:text-gray-300">Mastercard</span>
                            </li>
                            <li className="flex items-center gap-3 hover:bg-base-300 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                                <SiPaypal className="text-blue-600 text-xl" />
                                <span className="dark:text-gray-300">PayPal</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Column */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/foyzullah.foyzullah.98" className="w-12 h-12 rounded-full bg-base-300 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                                <FaFacebook size={20} className="dark:text-gray-300" />
                            </a>
                            <a href="https://github.com/Foyzullah9988" className="w-12 h-12 rounded-full bg-base-300 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                                <FaGithub size={20} className="dark:text-gray-300" />
                            </a>
                            <a href="https://www.linkedin.com/in/foyzullah-dev/" className="w-12 h-12 rounded-full bg-base-300 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                                <FaLinkedin size={20} className="dark:text-gray-300" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-base-300 dark:border-gray-700 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-neutral-600 dark:text-gray-400">
                            © {new Date().getFullYear()} TicketBari. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/privacy" className="text-sm hover:text-primary dark:text-gray-400 dark:hover:text-white">Privacy Policy</Link>
                            <Link to="/terms" className="text-sm hover:text-primary dark:text-gray-400 dark:hover:text-white">Terms of Service</Link>
                            <Link to="/cookies" className="text-sm hover:text-primary dark:text-gray-400 dark:hover:text-white">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;