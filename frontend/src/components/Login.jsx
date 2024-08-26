import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Import the CSS file

export default function Login() {
    const [values, setValues] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!values.email || !values.password) {
            alert('Please fill in all fields.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/login', values);
            if (response.data.Status === 'success') {
                // Handle successful login
                navigate('/');
            } else {
                setNotificationMessage(response.data.Message || 'Login failed');
                setShowNotification(true);
            }
        } catch (error) {
            console.error('Error during login:', error.response?.data || error.message);
            setNotificationMessage('An error occurred. Please try again.');
            setShowNotification(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            placeholder="Enter your email.."
                            name='email'
                            value={values.email}
                            onChange={e => setValues({ ...values, email: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            placeholder="Enter your password.."
                            name='password'
                            value={values.password}
                            onChange={e => setValues({ ...values, password: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <button type='submit' className="button">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9em', color: '#333' }}>
                    Don't have an account? <a href="/register" className="link">Click to register</a>
                </p>
                {showNotification && (
                    <div className="notification">
                        {notificationMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
