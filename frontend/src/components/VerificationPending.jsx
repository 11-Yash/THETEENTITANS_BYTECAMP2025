import React from 'react';
import { Link } from 'react-router-dom';

const VerificationPending = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <svg
                className="h-6 w-6 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verification Pending
            </h2>
            
            <p className="mt-2 text-center text-sm text-gray-600">
              Thank you for submitting your documents. Our team will review them shortly.
            </p>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                The verification process typically takes 2-3 business days. We'll notify you via email once the review is complete.
              </p>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                For any queries, please contact our support team at:
                <br />
                <a
                  href="mailto:support@ngoplatform.com"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  support@ngoplatform.com
                </a>
              </p>
            </div>
            
            <div className="mt-6">
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending; 