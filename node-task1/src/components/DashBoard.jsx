import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { removeToken } from '../utils/auth';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      axios.get('http://localhost:5001/users/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        removeToken();
        navigate('/login');
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
