import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../css/Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/register', {
        username,
        password,
      });

      alert(res.data.message || 'User registered successfully!');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err?.response?.data || err.message);
      alert(
        err?.response?.data?.error || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
