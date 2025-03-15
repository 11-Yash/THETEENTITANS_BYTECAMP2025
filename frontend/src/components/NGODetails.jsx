import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const NGODetails = () => {
  const { ngoId } = useParams();
  const [ngo, setNgo] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    fetchNGODetails();
    fetchCampaigns();
  }, [ngoId]);

  const fetchNGODetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/ngos/${ngoId}`);
      setNgo(response.data);
    } catch (err) {
      setError('Failed to fetch NGO details');
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/campaigns/ngo/${ngoId}`);
      setCampaigns(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch campaigns');
      setLoading(false);
    }
  };

  const handleDonate = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDonationModal(true);
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    try {
      const donationData = {
        campaignId: selectedCampaign.id,
        amount: parseFloat(donationAmount),
        paymentMethod,
        isAnonymous,
        donorId: localStorage.getItem('donorId')
      };

      const response = await axios.post('http://localhost:3000/api/donations', donationData);
      console.log('Donation successful:', response.data);
      
      // Reset form and close modal
      setDonationAmount('');
      setPaymentMethod('upi');
      setIsAnonymous(false);
      setShowDonationModal(false);
      
      // Refresh campaigns to update progress
      fetchCampaigns();
    } catch (err) {
      setError('Failed to process donation');
    }
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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {ngo && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{ngo.organization_name}</h1>
          <p className="text-gray-600 mb-6">{ngo.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <p className="text-gray-600">{ngo.address}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Contact</h2>
              <p className="text-gray-600">{ngo.phone}</p>
              <p className="text-gray-600">{ngo.email}</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Active Campaigns</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">{campaign.title}</h3>
            <p className="text-gray-600 mb-4">{campaign.description}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round((campaign.current_amount / campaign.target_amount) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2"
                  style={{ width: `${(campaign.current_amount / campaign.target_amount) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Target: ₹{campaign.target_amount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Raised: ₹{campaign.current_amount.toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleDonate(campaign)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Donate Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Make a Donation</h2>
            <form onSubmit={handleDonationSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  required
                  min="1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                >
                  <option value="upi">UPI</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm">Make this donation anonymous</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Proceed to Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGODetails; 