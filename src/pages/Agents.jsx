import React, { useEffect, useState } from 'react';
import API from '../api';
import { FiSearch, FiFilter, FiEye, FiX } from 'react-icons/fi';

function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State-ka Foomka (Modal)
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', email: '', phone: '' });
  const [formError, setFormError] = useState('');

  // Function-ka soo qaadista xogta
  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/agents/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAgents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Khalad ayaa dhacay markii xogta la soo qaadanayay');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Function-ka abuurista Agent-ka
  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const token = localStorage.getItem('token');
      await API.post('/agents/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setFormData({ username: '', password: '', email: '', phone: '' });
      fetchAgents(); // Dib u cusbooneysii shaxda
    } catch (err) {
      setFormError(err.response?.data?.message || 'Khalad ayaa dhacay markii Agent-ka la abuurayay');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Agents Management</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          + Create Agent
        </button>
      </div>

      {/* Search and Filter bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 flex items-center bg-white border rounded-lg px-3">
          <FiSearch className="text-gray-400" />
          <input type="text" placeholder="Search Agent Username..." className="w-full p-2 outline-none" />
        </div>
        <button className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">
          <FiFilter /> Filter
        </button>
      </div>

      {loading && <p className="text-gray-500">Xogta ayaa soo degaysa...</p>}
      {error && <p className="text-red-500 bg-red-50 p-3 rounded">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Username</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Phone</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">Ma jiro Agent la helay</td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr key={agent.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{agent.id}</td>
                    <td className="p-4 font-medium text-slate-800">{agent.username}</td>
                    <td className="p-4 text-gray-600">{agent.email || '-'}</td>
                    <td className="p-4 text-gray-600">{agent.phone || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${agent.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <FiEye /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* FOOMKA ABUURISTA AGENT-KA (MODAL) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Create New Agent</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>
            
            {formError && <p className="text-red-500 bg-red-50 p-2 rounded mb-4 text-sm">{formError}</p>}

            <form onSubmit={handleCreateAgent}>
              <div className="mb-3">
                <label className="block text-slate-700 text-sm font-medium mb-1">Username</label>
                <input type="text" required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="block text-slate-700 text-sm font-medium mb-1">Password</label>
                <input type="password" required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="block text-slate-700 text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-1">Phone</label>
                <input type="text" className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all">
                Save Agent
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agents;