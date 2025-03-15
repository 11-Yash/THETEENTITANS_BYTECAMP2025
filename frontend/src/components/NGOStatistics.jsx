import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const NGOStatistics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalExpenses: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    monthlyDonations: [],
    expenseCategories: []
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const storedNgoId = localStorage.getItem('ngoId');
        if (!storedNgoId) {
          throw new Error('No NGO ID found. Please log in again.');
        }

        const response = await axios.get(`http://localhost:3000/api/ngo/${storedNgoId}/statistics`);
        setStats(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch statistics');
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  const handleAddExpense = () => {
    navigate('/ngo/dashboard/expenses/add');
  };

  const DetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDetailsModal(false)}>
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Detailed Statistics</h2>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Monthly Donations Breakdown</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Month</th>
                    <th className="text-right py-2">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.monthlyDonations.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2">{item.month}</td>
                      <td className="text-right">{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Expense Categories Breakdown</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Category</th>
                    <th className="text-right py-2">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.expenseCategories.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2">{item.name}</td>
                      <td className="text-right">{item.value.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Statistics</h1>
        <div className="space-x-4">
          <button
            onClick={handleViewDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            View Details
          </button>
          <button
            onClick={handleAddExpense}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Add Expense
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Donations</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            ₹{stats.totalDonations.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            ₹{stats.totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Active Campaigns</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {stats.activeCampaigns}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Completed Campaigns</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {stats.completedCampaigns}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Donations Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Donations</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyDonations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Categories Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {showDetailsModal && <DetailsModal />}
    </div>
  );
};

export default NGOStatistics; 