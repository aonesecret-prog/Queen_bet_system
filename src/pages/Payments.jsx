import React, { useState, useEffect } from 'react';
import API from '../api';
import { FiSearch, FiFilter, FiEye, FiX, FiUser, FiArrowLeft, FiCheck } from 'react-icons/fi';

function Payments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [showFindBy, setShowFindBy] = useState(false);
  const [findBy, setFindBy] = useState('Player ID');
  const [searchValue, setSearchValue] = useState('');
  const [player, setPlayer] = useState(null);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const searchOptions = ['Player ID', 'Username', 'Email', 'Phone Number'];

  // 1. Soo qaad taariikhda lacagaha
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/transactions/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Khalad ayaa dhacay');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 2. Raadi Player-ka (Search Player)
  const handleFindPlayer = async () => {
    if (!searchValue) {
      setError('Fadlan geli xogta aad raadinayso');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await API.get(`/players/search?field=${findBy}&value=${searchValue}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlayer(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Player-ka lama helin');
    } finally {
      setLoading(false);
    }
  };

  // 3. Wareejinta lacagta (Transfer Money)
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError('Fadlan geli lacag sax ah');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await API.post('/transactions/deposit', {
        player_id: player.id,
        amount: parseFloat(amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Lacagta si guul leh ayaa loo wareejiyay Player-ka!');
      setShowModal(false);
      setPlayer(null);
      setSearchValue('');
      setAmount('');
      setNotes('');
      fetchTransactions(); // Dib u cusbooneysii shaxda
    } catch (err) {
      setError(err.response?.data?.message || 'Khalad ayaa dhacay');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Payments Management</h2>
        <button 
          onClick={() => { setShowModal(true); setPlayer(null); setSearchValue(''); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          + Transfer to Player
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 flex items-center bg-white border rounded-lg px-3">
          <FiSearch className="text-gray-400" />
          <input type="text" placeholder="Search Transaction ID..." className="w-full p-2 outline-none" />
        </div>
        <button className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50">
          <FiFilter /> Filter
        </button>
      </div>

      {loading && transactions.length === 0 && <p className="text-gray-500">Xogta ayaa soo degaysa...</p>}
      
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">User ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Type</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Amount (ETB)</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">Ma jiro lacag la helay</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{t.id}</td>
                    <td className="p-4 font-medium text-slate-800">{t.user_id}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === 'DEPOSIT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{t.amount}</td>
                    <td className="p-4">{t.status}</td>
                    <td className="p-4 text-gray-500">{new Date(t.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">
                {player ? 'Transfer To Player' : 'Find Player'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            {!player && (
              <div className="p-6">
                {error && <p className="text-red-500 bg-red-50 p-2 rounded mb-4 text-sm">{error}</p>}
                <div className="mb-4">
                  <label className="block text-slate-700 text-sm font-medium mb-1">Find By</label>
                  <button 
                    onClick={() => setShowFindBy(true)}
                    className="w-full flex justify-between items-center p-3 border rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <span>{findBy}</span>
                    <span className="text-gray-400">▼</span>
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-slate-700 text-sm font-medium mb-1">{findBy} *</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${findBy}`}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowModal(false)} className="flex-1 p-2 border rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                  <button 
                    onClick={handleFindPlayer}
                    disabled={loading}
                    className="flex-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Find'}
                  </button>
                </div>
              </div>
            )}

            {player && (
              <form onSubmit={handleTransfer} className="p-6">
                {error && <p className="text-red-500 bg-red-50 p-2 rounded mb-4 text-sm">{error}</p>}
                <button 
                  type="button"
                  onClick={() => { setPlayer(null); setSearchValue(''); }}
                  className="flex items-center gap-1 text-blue-600 mb-4 text-sm"
                >
                  <FiArrowLeft /> Back
                </button>
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <FiUser size={20} />
                    </div>
                    <span className="font-bold text-slate-800">Player ID: {player.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Username</p>
                      <p className="font-medium text-slate-800">{player.username}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Currency</p>
                      <p className="font-medium text-slate-800">ETB</p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-slate-700 text-sm font-medium mb-1">Amount *</label>
                  <input 
                    type="number" 
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-slate-700 text-sm font-medium mb-1">Notes</label>
                  <textarea 
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Notes"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 p-3 border rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Transferring...' : 'Transfer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showFindBy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Select Find By</h3>
              <button onClick={() => setShowFindBy(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-2">
              {searchOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => { setFindBy(option); setShowFindBy(false); setSearchValue(''); }}
                  className="w-full flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg"
                >
                  <span className={findBy === option ? 'text-blue-600 font-medium' : 'text-slate-700'}>
                    {option}
                  </span>
                  {findBy === option && <FiCheck className="text-blue-600" size={20} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;