import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DiscoverNGOs = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchNGOs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchNGOs = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching NGOs with search term:', searchTerm.trim());
      const response = await axios.get('http://localhost:3000/api/ngos/verified', {
        params: { search: searchTerm.trim() }
      });
      console.log('Received NGOs:', response.data);
      setNgos(response.data);
    } catch (err) {
      console.error('Error fetching NGOs:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to fetch NGOs. Please try again later.');
      setNgos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    console.log('Search term changed:', e.target.value);
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Discover NGOs</h2>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search NGOs by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left">Organization Name</th>
                <th className="px-6 py-3 border-b text-left">Contact Person</th>
                <th className="px-6 py-3 border-b text-left">Email</th>
                <th className="px-6 py-3 border-b text-left">Registration Number</th>
                <th className="px-6 py-3 border-b text-left">Phone</th>
                <th className="px-6 py-3 border-b text-left">Status</th>
                <th className="px-6 py-3 border-b text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {ngos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No NGOs found
                  </td>
                </tr>
              ) : (
                ngos.map((ngo) => (
                  <tr key={ngo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{ngo.organization_name}</td>
                    <td className="px-6 py-4 border-b">{ngo.name}</td>
                    <td className="px-6 py-4 border-b">{ngo.email}</td>
                    <td className="px-6 py-4 border-b">{ngo.registration_number || 'N/A'}</td>
                    <td className="px-6 py-4 border-b">{ngo.phone || 'N/A'}</td>
                    <td className="px-6 py-4 border-b">
                      <span className={`px-2 py-1 rounded text-sm ${ngo.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {ngo.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b">
                      <Link
                        to={`/donor/dashboard/ngo/${ngo.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DiscoverNGOs; 