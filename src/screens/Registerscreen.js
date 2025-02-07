import React, { useState } from 'react';
import axios from "axios";
// import Loader from '../components/Loader';
// import Error from '../components/Error';
// import Success from '../components/Success';

function Registerscreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currency, setCurrency] = useState('EUR');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    async function register() {
        setError('');
        setSuccess('');

        if (!validateEmail(email)) {
            setError('Unesite ispravnu email adresu.');
            return;
        }

        if (password.length <= 6) {
            setError('Lozinka mora biti duža od 6 znakova.');
            return;
        }

        if (password !== cpassword) {
            setError('Lozinke se ne podudaraju.');
            return;
        }

        const user = {
            name,
            email,
            currency,
            password
        };

        try {
            setLoading(true);
            const result = (await axios.post('/api/user/register', user)).data;
            setLoading(false);
            setSuccess(true);

            setName('');
            setEmail('');
            setCurrency('EUR');
            setPassword('');
            setCpassword('');
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError('Registracija nije uspjela. Molimo pokušajte ponovno.');
        }
    }

    return (
        <div>
            {/* {loading && (<Loader />)} */}

            <div className="row justify-content-center mt-5">
                <div className="col-md-5">
                    <div className="card shadow-lg p-4">
                        <h1>Register</h1>
                        {/* {success && (<Success message={
                            <>Registracija uspješna! Odite na <a href="/login">login</a> kako bi se prijavili.</>
                        } />)} */}
                        {/* {error && (<Error message={error} />)} */}

                        <input type="text" className='form-control' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="text" className='form-control' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />

                        <select className='form-control' value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                        </select>

                        <input
                            type="password"
                            className='form-control'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            className='form-control'
                            placeholder='Repeat Password'
                            value={cpassword}
                            onChange={(e) => setCpassword(e.target.value)}
                        />

                        <button className='btn btn-primary mt-3' onClick={register}>Register!</button>
                        <br />
                        <button className="btn btn-link mt-4">
                            <a href="/login">Already have a profile? Go to the login page!</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registerscreen;
