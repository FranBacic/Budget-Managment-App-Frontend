import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaWallet, FaBell } from 'react-icons/fa';
import './Landingscreen.css';  // Povezivanje CSS-a

function Landingscreen() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    return (
        <div className="landing-container">
            <div className="container text-center">
                <div className="row align-items-center content-box">
                    <div className="col-md-6 text-md-start">
                        <h1 className="display-4 fw-bold">Take Control of Your Finances!</h1>
                        <p className="lead">Track your income and expenses, plan your budget, and make smart financial decisions.</p>
                        <div className="d-flex gap-3 mt-3">
                            {user ? (
                                <Link to="/income" className="btn btn-warning btn-lg">Start Now</Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn btn-warning btn-lg">Sign Up</Link>
                                    <Link to="/login" className="btn btn-light btn-lg">Log In</Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6 d-none d-md-block">
                        <img
                            src="https://private-user-images.githubusercontent.com/85112417/426247139-1f1c92ff-02b3-428d-85ad-08e75ef4a482.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDI4NDcwNDMsIm5iZiI6MTc0Mjg0Njc0MywicGF0aCI6Ii84NTExMjQxNy80MjYyNDcxMzktMWYxYzkyZmYtMDJiMy00MjhkLTg1YWQtMDhlNzVlZjRhNDgyLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAzMjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMzI0VDIwMDU0M1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWMwYzhmYzVjY2NhMjM2YjBiODhjMDYwODFkMzBkNDQxZWMxNmNkOTMzNmNmMTBlMzA5NjNkOWI2OWRjMTA1OTEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.67ZC1SGyuyrai5HdufIMuyqgzp8G1GbWzn0xSxDifGU"
                            alt="Budget App Preview"
                            className="img-fluid rounded shadow"
                        />
                    </div>
                </div>

                <div className="my-5">
                    <h2 className="mb-4 text-white">Why Choose Our App?</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card shadow p-4 text-center">
                                <div className="d-flex justify-content-center">
                                    <FaChartLine size={50} className="text-primary" />
                                </div>
                                <h3 className="mt-3">Income & Expense Analytics</h3>
                                <p>View detailed charts and statistics to better manage your money.</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card shadow p-4">
                                <div className="d-flex justify-content-center">
                                    <FaWallet size={50} className="text-success" />
                                </div>
                                <h3 className="mt-3">Easy Transaction Logging</h3>
                                <p>Quickly add your income and expenses with just a few clicks.</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card shadow p-4">
                                <div className="d-flex justify-content-center">
                                    <FaBell size={50} className="text-warning" />
                                </div>
                                <h3 className="mt-3">Payment Reminders</h3>
                                <p>Get notifications when it's time to pay your bills so you never forget.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landingscreen;
