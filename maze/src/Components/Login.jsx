import React, { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:3000/auth/login", { email, password })
            .then((response) => {
                if (response.data.status) {
                    navigate('/home');
                } else {
                    alert(response.data.message || "Login failed"); // Provide user feedback
                }
            })
            .catch((err) => {
                console.error('Error during login:', err);
            });
    };

    return (
        <div
            className="home-container"
            style={{
              
                backgroundSize: 'cover', // Ensure the image covers the entire container
                backgroundRepeat: 'no-repeat', // Prevent tiling
                backgroundPosition: 'center', // Center the image
                height: '100vh', // Ensure full-screen height
            }}
        >
            <div className='sign-up-container'>
                <form className='sign-up-form' onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        autoComplete="off"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        placeholder="*****"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                  <button type="login">Login</button>
                    <p>
                        Don't Have an Account? <Link to="/signup">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
