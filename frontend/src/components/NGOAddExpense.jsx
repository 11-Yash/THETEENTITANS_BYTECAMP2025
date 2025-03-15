import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const NGOAddExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const campaignId = location.state?.campaignId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [campaign, setCampaign] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    receiptNumber: '',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (campaignId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/campaigns/${campaignId}/summary`);
          setCampaign(response.data);
        } catch (error) {
          console.error('Error fetching campaign details:', error);
          setError('Failed to fetch campaign details');
        }
      }
    };

    fetchCampaignDetails();
  }, [campaignId]);

  const categories = [
    'Education',
    'Healthcare',
    'Food & Nutrition',
    'Infrastructure',
    'Administrative',
    'Emergency Relief',
    'Other'
  ];

  const paymentMethods = [
    'cash',
    'bank_transfer',
    'check',
    'upi',
    'credit_card'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const ngoId = localStorage.getItem('ngoId');
      if (!ngoId) {
        throw new Error('NGO ID not found. Please login again.');
      }

      const response = await axios.post('http://localhost:3000/api/expenses', {
        ...formData,
        ngoId,
        campaignId,
        amount: parseFloat(formData.amount)
      });

      if (response.data) {
        if (campaignId) {
          navigate('/ngo/dashboard/campaigns');
        } else {
          navigate('/ngo/dashboard/statistics');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Add New Expense
            {campaign && (
              <span className="block text-sm font-normal text-gray-600 mt-1">
                For Campaign: {campaign.title}
              </span>
            )}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {campaign && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Campaign Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Target Amount</p>
                  <p className="font-medium">₹{campaign.target_amount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Current Amount</p>
                  <p className="font-medium">₹{campaign.current_amount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Expenses</p>
                  <p className="font-medium">₹{campaign.total_expenses || 0}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-medium capitalize">{campaign.status}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="receiptNumber" className="block text-sm font-medium text-gray-700">
                Receipt Number
              </label>
              <input
                type="text"
                id="receiptNumber"
                name="receiptNumber"
                value={formData.receiptNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>
                    {method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(campaignId ? '/ngo/dashboard/campaigns' : '/ngo/dashboard/statistics')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NGOAddExpense; 