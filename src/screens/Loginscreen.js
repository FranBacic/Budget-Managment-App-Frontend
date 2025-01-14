import React, { useState } from 'react';
import axios from 'axios';
// import Loader from '../components/Loader';
// import Error from '../components/Error';

function Loginscreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');

    async function Login() {
        const user = {
            email,
            password,
        };

        try {
            setLoading(true);
            const result = (await axios.post('/api/user/login', user)).data;
            setLoading(false);
            localStorage.setItem('currentUser', JSON.stringify(result));
            window.location.href = '/home';
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(true);
        }
    }

    async function handleForgotPassword() {
        try {
            setLoading(true);
            await axios.post('/api/users/forgot-password', { email: forgotPasswordEmail });
            setLoading(false);
            setForgotPasswordError(''); // Clear any previous error
            alert('A password reset link has been sent to your email.');
            closeForgotPasswordModal();
        } catch (error) {
            console.log(error);
            setLoading(false);
            setForgotPasswordError('Korisnik nije pronađen');
        }
    }

    const closeForgotPasswordModal = () => {
        setForgotPasswordEmail('');
        const modal = document.getElementById('forgotPasswordModal');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('padding-right');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
        }
    };

    return (
        <div>
            {/* {loading && <Loader />} */}
            <div className="row justify-content-center mt-5">
                <div className="col-md-5">
                    {/* {error && <Error message="Lozinka ili email nisu točni!" />} */}
                    <div className="bs">
                        <h1>Login</h1>

                        <input type="text" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                        <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                        <button className="btn btn-primary mt-3" onClick={Login}>Login</button>

                        <div className="mt-3">
                            <button className="btn btn-link" data-bs-toggle="modal" data-bs-target="#forgotPasswordModal">
                                Zaboravili ste lozinku? Klikni ovdje!
                            </button>
                            <br />
                            <button className="btn btn-link">
                                <a href="/register">Nemate profil? Registriraj se!</a>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="forgotPasswordModal" tabIndex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="forgotPasswordModalLabel">Zaboravio sam Lozinku</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input type="text" className="form-control" placeholder="Unesite svoju email adresu" value={forgotPasswordEmail} onChange={(e) => setForgotPasswordEmail(e.target.value)} />
                            {/* {forgotPasswordError && <Error message={forgotPasswordError} />} */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Zatvori</button>
                            <button type="button" className="btn btn-primary" onClick={handleForgotPassword}>Pošalji Novu Lozinku</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loginscreen;
