import React from 'react';
import { FaFacebook, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { SiMastercard, SiPaypal, SiStripe, SiVisa } from 'react-icons/si';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <div className='bg-base-200'>
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
                                <span className="text-xl font-bold">Ticket Bari</span>
                                <span className="text-sm opacity-80">Online Ticket Booking</span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                            Book bus, train, launch & flight tickets easily. Discover schedules, compare
                            prices and checkout securely — all in one place.
                        </p>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <nav className="flex flex-col space-y-3">
                            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                            <Link to="/all-tickets" className="hover:text-primary transition-colors">All Tickets</Link>
                            <Link to="/about" className="hover:text-primary transition-colors">About us</Link>
                            <Link to="/careers" className="hover:text-primary transition-colors">Careers</Link>
                            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
                        </nav>
                    </div>

                    {/* Payment Methods Column */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 hover:bg-base-300 p-2 rounded-lg transition-colors">
                                <SiStripe className="text-indigo-500 text-xl" />
                                <span>Stripe</span>
                            </li>
                            <li className="flex items-center gap-3 hover:bg-base-300 p-2 rounded-lg transition-colors">
                                <SiVisa className="text-blue-500 text-xl" />
                                <span>Visa</span>
                            </li>
                            <li className="flex items-center gap-3 hover:bg-base-300 p-2 rounded-lg transition-colors">
                                <SiMastercard className="text-red-500 text-xl" />
                                <span>Mastercard</span>
                            </li>
                            <li className="flex items-center gap-3 hover:bg-base-300 p-2 rounded-lg transition-colors">
                                <SiPaypal className="text-blue-600 text-xl" />
                                <span>PayPal</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Column */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                                <FaXTwitter size={20} />
                            </a>
                            <a href="#" className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                                <FaYoutube size={20} />
                            </a>
                        </div>
                        
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-base-300 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-neutral-600">
                            © {new Date().getFullYear()} TicketBari. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/privacy" className="text-sm hover:text-primary">Privacy Policy</Link>
                            <Link to="/terms" className="text-sm hover:text-primary">Terms of Service</Link>
                            <Link to="/cookies" className="text-sm hover:text-primary">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;