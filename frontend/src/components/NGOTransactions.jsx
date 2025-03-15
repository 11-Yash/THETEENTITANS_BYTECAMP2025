import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NGOTransactions = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, incoming, outgoing

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const storedNgoId = localStorage.getItem('ngoId');
        if (!storedNgoId) {
          throw new Error('No NGO ID found. Please log in again.');
        }

        // In a real application, you would fetch this data from your backend
        // This is mock data for demonstration
        const mockData = [
          {
            id: 1,
            type: 'incoming',
            amount: 50000,
            date: '2024-03-15',
            description: 'Donation from John Doe',
            campaign: 'Education for All',
            donor: 'John Doe'
          },
          {
            id: 2,
            type: 'outgoing',
            amount: 30000,
            date: '2024-03-14',
            description: 'School supplies purchase',
            campaign: 'Education for All',
            category: 'Education'
          },
          {
            id: 3,
            type: 'incoming',
            amount: 75000,
            date: '2024-03-13',
            description: 'Corporate donation',
            campaign: 'Healthcare Initiative',
            donor: 'ABC Corp'
          },
          {
            id: 4,
            type: 'outgoing',
            amount: 45000,
            date: '2024-03-12',
            description: 'Medical supplies',
            campaign: 'Healthcare Initiative',
            category: 'Healthcare'
          }
        ];

        setTransactions(mockData);
      } catch (error) {
        setError(error.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Transaction History</h1>
        
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'incoming'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('incoming')}
          >
            Incoming
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'outgoing'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('outgoing')}
          >
            Outgoing
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'incoming'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'incoming' ? 'Received' : 'Spent'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'incoming' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.campaign}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.type === 'incoming' ? transaction.donor : transaction.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NGOTransactions; 