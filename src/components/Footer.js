import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
function Footer() {
    return (
        <footer className="bg-dark text-light text-center py-3 mt-5">
            <p>&copy; {new Date().getFullYear()} Budget Management App. All rights reserved.</p>

            <div className="social-icons mt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-light">
                    <FaFacebook size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-light">
                    <FaInstagram size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-light">
                    <FaTwitter size={24} />
                </a>
            </div>
        </footer>
    );
}

export default Footer;
