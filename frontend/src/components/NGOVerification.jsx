import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NGOVerification = () => {
  const [files, setFiles] = useState({
    registrationCertificate: null,
    taxExemptionCertificate: null,
    governmentIdProof: null,
    addressProof: null
  });
  
  const [uploadStatus, setUploadStatus] = useState({
    registrationCertificate: false,
    taxExemptionCertificate: false,
    governmentIdProof: false,
    addressProof: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (documentType, e) => {
    const file = e.target.files[0];
    setFiles(prev => ({
      ...prev,
      [documentType]: file
    }));
    setUploadStatus(prev => ({
      ...prev,
      [documentType]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get NGO ID from localStorage
    const ngoId = localStorage.getItem('ngoId');
    if (!ngoId) {
      alert('Please login again');
      navigate('/ngo/login');
      return;
    }

    // Validate required files
    if (!files.registrationCertificate || !files.governmentIdProof || !files.addressProof) {
      alert('Please upload all required documents');
      setIsSubmitting(false);
      return;
    }

    // Create a FormData object to send files
    const formData = new FormData();
    formData.append('ngoId', ngoId);
    
    // Append each file to the FormData
    Object.keys(files).forEach(key => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:3000/api/ngo/verify', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary for FormData
      });

      const data = await response.json();

      if (response.ok) {
        alert('Documents uploaded successfully!');
        navigate('/verification-pending');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert(error.message || 'Failed to upload documents. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">NGO Verification</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please upload the required documents for verification
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Registration Certificate */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                NGO Registration Certificate *
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  required
                  onChange={(e) => handleFileChange('registrationCertificate', e)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {uploadStatus.registrationCertificate && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
              </div>
            </div>

            {/* Tax Exemption Certificate */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax Exemption Certificate (if applicable)
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  onChange={(e) => handleFileChange('taxExemptionCertificate', e)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {uploadStatus.taxExemptionCertificate && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
              </div>
            </div>

            {/* Government ID Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Government ID Proof of Authorized Representative *
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  required
                  onChange={(e) => handleFileChange('governmentIdProof', e)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {uploadStatus.governmentIdProof && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
              </div>
            </div>

            {/* Address Proof */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address Proof of NGO *
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  required
                  onChange={(e) => handleFileChange('addressProof', e)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {uploadStatus.addressProof && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Uploading...' : 'Submit Documents'}
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Need help? Contact support at support@ngoplatform.com</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NGOVerification; 