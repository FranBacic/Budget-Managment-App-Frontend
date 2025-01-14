import React, { useState } from 'react';
import axios from "axios";
// import Loader from '../components/Loader';
// import Error from '../components/Error';
// import Success from '../components/Success';
// import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

function Registerscreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currency, setCurrency] = useState('EUR');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [cpasswordVisible, setCpasswordVisible] = useState(false);

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
            setCurrency('');
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
                    <div className='bs'>
                        <h1>Registriraj se</h1>
                        {/* {success && (<Success message={
                            <>
                                Registracija uspješna! Odite na <a href="/login">login</a> kako bi se prijavili.
                            </>
                        } />)} */}
                        {/* {error && (<Error message={error} />)} */}

                        <input type="text" className='form-control' placeholder='Name' value={name} onChange={(e) => { setName(e.target.value) }} />
                        <input type="text" className='form-control' placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        {/* <input type="text" className='form-control' placeholder='Currency' value={currency} onChange={(e) => { setCurrency(e.target.value) }} /> */}

                        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                        </select>

                        <div className="password-input-container">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                className='form-control'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                            {/* <span
                                className="password-toggle-icon"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                                {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </span> */}
                        </div>

                        <div className="password-input-container">
                            <input
                                type={cpasswordVisible ? "text" : "password"}
                                className='form-control'
                                placeholder='Repeat Password'
                                value={cpassword}
                                onChange={(e) => { setCpassword(e.target.value) }}
                            />
                            {/* <span
                                className="password-toggle-icon"
                                onClick={() => setCpasswordVisible(!cpasswordVisible)}
                            >
                                {cpasswordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </span> */}
                        </div>

                        <button className='btn btn-primary mt-3' onClick={register}>Registriraj se!</button>
                        <br />
                        <button className="btn btn-link mt-4">
                            <a href="/login">Već imate profil? Prijavi se!</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registerscreen;
