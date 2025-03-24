import React, { useState } from 'react';
import axios from 'axios';

function Loginscreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');

    const Login = async () => {
        const user = { email, password };
        try {
            setLoading(true);
            const result = (await axios.post('/api/user/login', user)).data;
            setLoading(false);
            localStorage.setItem('currentUser', JSON.stringify(result));
            window.location.href = '/income';
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(true);
        }
    };

    const handleForgotPassword = async () => {
        try {
            setLoading(true);
            await axios.post('/api/users/forgot-password', { email: forgotPasswordEmail });
            setLoading(false);
            setForgotPasswordError('');
            alert('A password reset link has been sent to your email.');
            closeForgotPasswordModal();
        } catch (error) {
            console.log(error);
            setLoading(false);
            setForgotPasswordError('Korisnik nije pronađen');
        }
    };

    const closeForgotPasswordModal = () => {
        setForgotPasswordEmail('');
        const modal = document.getElementById('forgotPasswordModal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg p-4">
                        <h2 className="text-center mb-4">Login</h2>
                        {error && <div className="alert alert-danger">Lozinka ili email nisu točni!</div>}

                        <input
                            type="email"
                            className="form-control mb-3"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button className="btn btn-primary w-100" onClick={Login} disabled={loading}>
                            {loading ? 'Processing...' : 'Login '}
                        </button>

                        <div className="text-center mt-3">
                            <button className="btn btn-link" data-bs-toggle="modal" data-bs-target="#forgotPasswordModal">
                                Forgot password?
                            </button>
                            <br />
                            <a href="/register" className="btn btn-link">Don't have an account? Register here!</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal za zaboravljenu lozinku */}
            <div className="modal fade" id="forgotPasswordModal" tabIndex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="forgotPasswordModalLabel">Reset password</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="email"
                                className="form-control mb-2"
                                placeholder="Enter your email"
                                value={forgotPasswordEmail}
                                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            />
                            {forgotPasswordError && <div className="alert alert-danger">{forgotPasswordError}</div>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleForgotPassword}>Send link for reset</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loginscreen;
