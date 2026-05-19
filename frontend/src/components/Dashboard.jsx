import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, MapPin } from 'lucide-react';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { user } = useContext(AuthContext);

  const fetchComplaints = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      let url = 'https://end-sem-backend-e8cx.onrender.com/api/complaints';
      if (locationSearch) {
        url = `https://end-sem-backend-e8cx.onrender.com/api/complaints/search?location=${locationSearch}`;
      } else if (categoryFilter) {
        url = `https://end-sem-backend-e8cx.onrender.com/api/complaints?category=${categoryFilter}`;
      }
      
      const { data } = await axios.get(url, config);
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [locationSearch, categoryFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.put(`https://end-sem-backend-e8cx.onrender.com/api/complaints/${id}`, { status: newStatus }, config);
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s === 'resolved') return 'badge badge-resolved';
    if (s === 'pending') return 'badge badge-pending';
    return 'badge';
  };
  
  const getPriorityBadge = (priority) => {
    if (!priority) return null;
    const p = priority.toLowerCase();
    if (p.includes('high')) return 'badge badge-high';
    if (p.includes('medium')) return 'badge badge-medium';
    if (p.includes('low')) return 'badge badge-low';
    return 'badge';
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Complaint Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center glass rounded-lg px-3 py-2">
            <Search size={18} className="text-secondary mr-2" />
            <input 
              type="text" 
              placeholder="Search by location..." 
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-primary"
            />
          </div>
          
          <div className="flex items-center glass rounded-lg px-3 py-2">
            <Filter size={18} className="text-secondary mr-2" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-primary"
            >
              <option value="" className="bg-slate-800">All Categories</option>
              <option value="Water Supply" className="bg-slate-800">Water Supply</option>
              <option value="Electricity" className="bg-slate-800">Electricity</option>
              <option value="Roads" className="bg-slate-800">Roads</option>
              <option value="Sanitation" className="bg-slate-800">Sanitation</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid-cards">
        {complaints.length === 0 ? (
          <p className="text-secondary">No complaints found.</p>
        ) : (
          complaints.map(complaint => (
            <div key={complaint._id} className="glass-card flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{complaint.title}</h3>
                  <span className={getStatusBadge(complaint.status)}>{complaint.status}</span>
                </div>
                <p className="text-secondary mb-4 text-sm">{complaint.description}</p>
                
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <MapPin size={14} className="text-primary"/> 
                  <span>{complaint.location}</span>
                </div>
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <span className="text-secondary">Category:</span> 
                  <span className="font-semibold">{complaint.category}</span>
                </div>
                
                {complaint.aiSummary && (
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 mb-4">
                    <div className="flex gap-2 mb-2">
                      {getPriorityBadge(complaint.aiPriority) && <span className={getPriorityBadge(complaint.aiPriority)}>{complaint.aiPriority}</span>}
                      {complaint.aiDepartment && <span className="badge badge-pending bg-primary/20 text-primary border-primary/30">{complaint.aiDepartment}</span>}
                    </div>
                    <p className="text-xs text-secondary italic">" {complaint.aiSummary} "</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-surface-border flex justify-between items-center">
                <span className="text-xs text-secondary">By: {complaint.name}</span>
                {user.role === 'Admin' || true ? ( // Simulating admin powers or just letting users update
                  <select 
                    value={complaint.status}
                    onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                    className="bg-slate-800 text-sm p-1 rounded border border-surface-border outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
