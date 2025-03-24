import React from 'react';
import { FaUserCircle, FaSignOutAlt, FaUserCog, FaChartPie } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const currentPath = window.location.pathname; 

    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">

                <a className="navbar-brand d-flex align-items-center" href="/">
                    <FaChartPie className="me-2" size={24} />
                    <strong>Budget</strong>
                </a>


                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Left side - Income, Expense, Goals */}
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${currentPath === "/income" ? "active-section" : ""}`}
                                href="/income"
                            >
                                Income
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${currentPath === "/expense" ? "active-section" : ""}`}
                                href="/expense"
                            >
                                Expense
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${currentPath === "/goals" ? "active-section" : ""}`}
                                href="/goals"
                            >
                                Goals
                            </a>
                        </li>
                    </ul>


                    <ul className="navbar-nav">
                        {user ? (
                            <li className="nav-item dropdown">
                                <button
                                    className="btn btn-outline-light dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <FaUserCircle className="me-2" />
                                    <b>{user.name}</b>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <a className="dropdown-item" href="/profile">
                                            <FaUserCircle className="me-2" /> Profile
                                        </a>
                                    </li>
                                    {(user.isAdmin || user.isReceptionist || user.isMaid) && (
                                        <li>
                                            <a className="dropdown-item" href="/admin">
                                                <FaUserCog className="me-2" /> Admin Panel
                                            </a>
                                        </li>
                                    )}
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={logout}>
                                            <FaSignOutAlt className="me-2" /> Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="/register">Register</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/login">Login</a>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
