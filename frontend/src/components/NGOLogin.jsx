import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NGOLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('http://localhost:3000/api/ngo/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store NGO data in localStorage
        localStorage.setItem('ngoId', data.id);
        localStorage.setItem('ngoData', JSON.stringify(data));

        if (!data.isVerified) {
          try {
            // Check verification status
            const verificationResponse = await fetch(`http://localhost:3000/api/ngo/verification-status/${data.id}`);
            const verificationData = await verificationResponse.json();

            if (verificationResponse.ok) {
              if (!verificationData.status) {
                // No verification submitted yet
                navigate('/ngo/verify');
              } else if (verificationData.status === 'pending') {
                navigate('/verification-pending');
              } else if (verificationData.status === 'rejected') {
                // navigate('/ngo/verification-pending');
                alert('Your verification request has been rejected. Please resubmit your documents.');
              }
              else if (verificationData.status === 'approved') {
                alert('Your verification request has been approved. You can now access your dashboard.');
                navigate('/ngo/ngo-dashboard');
              
            }} else {
              console.error('Verification status error:', verificationData);
              // If there's an error checking verification, default to verification page
              navigate('/ngo/verification-pending');
            }
          } catch (error) {
            console.error('Error checking verification status:', error);
            // If there's an error checking verification, default to verification page
            navigate('/ngo/verification-pending');
          }
        } else {
          // Navigate to NGO dashboard if verified
          navigate('/ngo/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 shadow-lg rounded-xl bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">NGO Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          New to our platform? {' '}
          <button
            onClick={() => navigate('/ngo/register')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register your NGO
          </button>
        </div>
      </div>
    </div>
  );
} 