import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.withCredentials = true;

export default function HomePage() {
    const [auth, setAuth] = useState(false);
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/')
            .then(res => {
                if (res.data.msg === 'success') {
                    setAuth(true);
                    setName(res.data.name);
                } else {
                    setMsg(res.data.msg);
                }
            })
            .catch(err => {
                console.error('Error fetching authentication status:', err);
                setMsg('An error occurred while checking authentication.');
            });
    }, []);

    const handleLogout = () => {
        axios.get('/logout')
            .then((res) => {
                if (res.data.Status === 'success') {
                    setAuth(false);
                    setName('');
                    setMsg('You have been logged out.');
                    navigate('/login'); // Redirect to login page
                } else {
                    alert('Logout failed');
                }
            })
            .catch(err => {
                console.error('Error during logout:', err);
                alert('An error occurred during logout.');
            });
    };

    return (
        auth ?
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
                justifyContent: 'center'
            }}>
                <h1>You are Authorized, {name}</h1>
                <button onClick={handleLogout} style={{
                    padding: '10px 20px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}>Logout</button>
            </div>
            :
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
                justifyContent: 'center'
            }}>
                <h3>{msg}</h3>
                <Link to='/login' style={{
                    color: '#007bff',
                    textDecoration: 'none',
                    fontSize: '18px'
                }}>Login</Link>
            </div>
    );
}
