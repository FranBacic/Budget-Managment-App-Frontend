import React from 'react';


function Navbar() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    function logout() {
        localStorage.removeItem('currentUser')
        window.location.href = '/login'
    }

    return ( 
        <div>
            <nav class="navbar navbar-expand-lg ">
                <a class="navbar-brand" href="/home">Budget</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ">

                        <li class="nav-item ">
                            <a class="nav-link" href="/home">Income</a>
                        </li>

                        <li class="nav-item ">
                            <a class="nav-link" href="/expense">Expense</a>
                        </li>

                        <li class="nav-item ">
                            <a class="nav-link" href="/goals">Goals</a>
                        </li>

                        {user ? (<>
                            <div class="dropdown">
                                <button class="btn  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-person"></i><b>{user.name}</b>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="/profile">Profile</a></li>
                                    {(user.isAdmin || user.isReceptionist || user.isMaid) && (
                                        <li><a className="dropdown-item" href="/admin">Admin Panel</a></li>
                                    )}
                                    <li><a class="dropdown-item" href="#" onClick={logout}>Logout</a></li>
                                </ul>
                            </div>
                        </>) : <>
                            <li className="nav-item">
                                <a className="nav-link" href="/register">Register</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>
                        </>}

                    </ul>
                </div>
            </nav>
        </div>
     );
}

export default Navbar;