import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 text-2xl font-bold text-primary">
          <AlertCircle size={28} className="text-secondary" />
          <span>Smart<span className="text-secondary">Complaints</span></span>
        </Link>
        <div className="nav-links flex items-center gap-6">
          {user ? (
            <>
              <Link to="/" className="flex items-center gap-2"><LayoutDashboard size={18} /> Dashboard</Link>
              <Link to="/add-complaint" className="flex items-center gap-2"><PlusCircle size={18} /> New Complaint</Link>
              <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2">
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
