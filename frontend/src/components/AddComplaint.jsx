import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bot, Loader2 } from 'lucide-react';

const AddComplaint = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: '',
    description: '',
    category: 'Water Supply',
    location: ''
  });
  
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Please provide a title and description for AI analysis.');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5000/api/ai/analyze', {
        title: formData.title,
        description: formData.description,
        category: formData.category
      }, config);
      
      setAiAnalysis(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze complaint');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const payload = {
        ...formData,
        aiSummary: aiAnalysis?.summary,
        aiPriority: aiAnalysis?.priority,
        aiDepartment: aiAnalysis?.department
      };
      
      await axios.post('http://localhost:5000/api/complaints', payload, config);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in flex justify-center pb-12">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-8">Register a New Complaint</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Complaint Title</label>
                <input 
                  type="text" name="title" className="input-field" 
                  value={formData.title} onChange={handleChange} required 
                />
              </div>
              
              <div className="input-group">
                <label>Category</label>
                <select 
                  name="category" className="input-field"
                  value={formData.category} onChange={handleChange} required
                >
                  <option value="Water Supply">Water Supply</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Roads">Roads</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="input-group">
                <label>Location</label>
                <input 
                  type="text" name="location" className="input-field" 
                  value={formData.location} onChange={handleChange} required 
                  placeholder="e.g. Ghaziabad"
                />
              </div>
              
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  name="description" className="input-field min-h-[120px]" 
                  value={formData.description} onChange={handleChange} required 
                ></textarea>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button 
                  type="button" 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing}
                  className="btn btn-secondary flex-1"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Bot size={18} />}
                  Analyze with AI
                </button>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="space-y-6">
            <div className="glass-card h-full">
              <div className="flex items-center gap-2 mb-6 border-b border-surface-border pb-4">
                <Bot className="text-secondary" size={24} />
                <h3 className="text-xl font-bold">AI Analysis Result</h3>
              </div>
              
              {!aiAnalysis ? (
                <div className="text-secondary flex flex-col items-center justify-center h-[200px] text-center">
                  <Bot size={48} className="mb-4 opacity-20" />
                  <p>Click "Analyze with AI" to get automatic prioritization, department routing, and summaries.</p>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="text-xs text-secondary uppercase tracking-wider font-semibold block mb-1">Priority Level</label>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold border
                      ${aiAnalysis.priority.toLowerCase().includes('high') ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                        aiAnalysis.priority.toLowerCase().includes('medium') ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 
                        'bg-green-500/20 text-green-400 border-green-500/30'}`}
                    >
                      {aiAnalysis.priority}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-secondary uppercase tracking-wider font-semibold block mb-1">Suggested Department</label>
                    <div className="text-primary font-medium">{aiAnalysis.department}</div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-secondary uppercase tracking-wider font-semibold block mb-1">AI Summary</label>
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50 text-sm">
                      {aiAnalysis.summary}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-secondary uppercase tracking-wider font-semibold block mb-1">Auto-Response Suggestion</label>
                    <div className="bg-primary/10 text-primary p-3 rounded border border-primary/20 text-sm italic">
                      "{aiAnalysis.responseMessage}"
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComplaint;
