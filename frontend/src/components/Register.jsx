import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'

export default function Register() {
    const [values, setValues] = useState({ name: '', email: '', password: '', aadhar: '' });
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!values.name || !values.email || !values.password || !values.aadhar) {
            alert('Please fill in all fields.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/register', values);
            if (response.data.Status === 'success') {
                setNotificationMessage('A verification email has been sent to your email address.');
                setShowNotification(true);
                setTimeout(() => navigate('/login'), 5000);
            } else {
                setNotificationMessage(response.data.Message || 'Registration failed');
                setShowNotification(true);
            }
        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);
            setNotificationMessage('An error occurred. Please try again.');
            setShowNotification(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#e9ecef',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                maxWidth: '500px',
                width: '100%',
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                boxSizing: 'border-box'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    fontSize: '1.8em',
                    color: '#333'
                }}>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor='name' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Name</label>
                        <input
                            type='text'
                            placeholder="Enter your name.."
                            name='name'
                            autoComplete="off"
                            value={values.name}
                            onChange={e => setValues({ ...values, name: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '1em',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor='email' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Email</label>
                        <input
                            type='email'
                            placeholder="Enter your email.."
                            name='email'
                            autoComplete="off"
                            value={values.email}
                            onChange={e => setValues({ ...values, email: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '1em',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor='password' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Password</label>
                        <input
                            type='password'
                            placeholder="Enter your password.."
                            name='password'
                            autoComplete="off"
                            value={values.password}
                            onChange={e => setValues({ ...values, password: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '1em',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor='aadhar' style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Aadhar Number</label>
                        <input
                            type='text'
                            placeholder="Enter your Aadhar number.."
                            name='aadhar'
                            autoComplete="off"
                            value={values.aadhar}
                            onChange={e => setValues({ ...values, aadhar: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '1em',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <button type='submit' style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        border: 'none',
                        boxSizing: 'border-box',
                        transition: 'background-color 0.3s ease'
                    }}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    fontSize: '0.9em',
                    color: '#333'
                }}>
                    Already have an account? <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Click to login</a>
                </p>
                {showNotification && (
                    <div style={{
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                        padding: '10px',
                        borderRadius: '5px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        fontFamily: 'Arial, sans-serif',
                        zIndex: 1000
                    }}>
                        {notificationMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
