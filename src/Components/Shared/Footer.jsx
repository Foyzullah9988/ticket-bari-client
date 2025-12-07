import React from 'react';
import { FaFacebook, FaXTwitter, FaYoutube } from 'react-icons/fa6';

const Footer = () => {
    return (
        <div>
            <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
                <nav className="grid grid-flow-col gap-4">
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                    <a className="link link-hover">Press kit</a>
                </nav>
                <nav>
                    <div className="grid grid-flow-col gap-4">
                        <a>
                            <FaXTwitter size={21} />
                        </a>
                        <a>
                            <FaFacebook size={23} />
                        </a>
                        <a>
                            <FaYoutube size={25} />
                        </a>
                    </div>
                </nav>
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
                </aside>
            </footer>
        </div>
    );
};

export default Footer;