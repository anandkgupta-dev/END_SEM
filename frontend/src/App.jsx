import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddComplaint from './components/AddComplaint';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="auth-container">Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
      <div className="container mt-8">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/add-complaint" element={user ? <AddComplaint /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
