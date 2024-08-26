import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/verify-email?token=${token}`);
                if (response.data.Status === 'success') {
                    alert('Email verified successfully. You can now log in.');
                    navigate('/login');
                } else {
                    alert('Invalid or expired token.');
                    navigate('/register');
                }
            } catch (error) {
                console.error('Error during email verification:', error);
                alert('An error occurred during verification.');
                navigate('/register');
            }
        };

        verifyEmail();
    }, [location.search, navigate]);

    return null; // This component doesn't need to render anything
}
