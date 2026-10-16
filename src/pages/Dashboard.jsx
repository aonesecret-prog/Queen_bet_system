import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiUser, FiDollarSign, 
  FiBarChart2, FiPlus, FiLogOut 
} from 'react-icons/fi';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-center tracking-wider text-blue-400">QUEEN BET</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
            <FiHome size={20} /> Dashboard
          </Link>
          <Link to="/agents" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
            <FiUsers size={20} /> Agents
          </Link>
          <Link to="/players" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
            <FiUser size={20} /> Players
          </Link>
          <Link to="/payments" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
            <FiDollarSign size={20} /> Payments
          </Link>
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
            <FiBarChart2 size={20} /> Reports
          </a>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full rounded-lg text-red-400 hover:bg-slate-700 transition-colors"
          >
            <FiLogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Qaybta Midig */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="text-slate-700 font-medium">{user.username || 'Admin'}</span>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all">
              <FiPlus size={18} /> Create
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Ku soo dhawoow Dashboard-ka!</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
              <p className="text-gray-500 text-sm font-medium">Total Deposits</p>
              <h4 className="text-2xl font-bold text-slate-800 mt-1">0.00 ETB</h4>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
              <p className="text-gray-500 text-sm font-medium">Total Withdrawals</p>
              <h4 className="text-2xl font-bold text-slate-800 mt-1">0.00 ETB</h4>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
              <p className="text-gray-500 text-sm font-medium">Active Agents</p>
              <h4 className="text-2xl font-bold text-slate-800 mt-1">0</h4>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
              <p className="text-gray-500 text-sm font-medium">Total Players</p>
              <h4 className="text-2xl font-bold text-slate-800 mt-1">0</h4>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Transactions</h3>
            <p className="text-gray-500">Halkan waxaa ka muuqan doona taariikhda lacagaha.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;