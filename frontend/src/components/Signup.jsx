import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-box glass-card">
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign Up
          </button>
        </form>
        <p className="text-center mt-8 text-secondary">
          Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
