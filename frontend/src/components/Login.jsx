


import React, { useEffect } from 'react';
import { ManunalScan, loginWithGoogle } from '../api.js';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  
  const scanMail = async () => {
    const resp = await ManunalScan();
    return resp;
  }
  
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-200">
      {/* Header (similar style to Header.jsx) */}
      {/* <div className="bg-gradient-to-br from-blue-50 to-gray-200 flex justify-between items-center p-4 shadow-sm">
        <div className="flex">
          <span className="flex items-center">
            <img src="/spamguard.png" alt="SpamGuard Logo" className="w-16 h-16 object-contain" />
            <span className="text-red-500 font-bold text-3xl">Spam</span>
            <span className="text-gray-800 font-sans text-3xl">Guard</span>
          </span>
        </div>
        <div>
          <button className="text-lg font-semibold mx-4 text-gray-700 hover:text-red-500 transition">Home</button>
          <button className="text-lg font-semibold mx-4 text-gray-700 hover:text-red-500 transition">About</button>
          <button className="text-lg font-semibold mx-4 text-gray-700 hover:text-red-500 transition">Contact us</button>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to SpamGuard</h1>
            <p className="text-gray-600">
              An intelligent email protection system that detects and manages spam emails efficiently.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Email Protection Features:</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Automatic spam detection
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Email categorization
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Powerful dashboard to manage emails
                </li>
              </ul>
            </div>
            
            <button
              onClick={loginWithGoogle}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.211-7.859 9.574-11.895l-9.574 0.023z" />
              </svg>
              Login with Google
            </button>
            
            <div className="text-center">
              <span className="text-sm text-gray-500">
                By logging in, you agree to our
                <a href="#" className="text-red-500 hover:text-red-700 mx-1">Terms of Service</a>
                and
                <a href="#" className="text-red-500 hover:text-red-700 mx-1">Privacy Policy</a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (similar to Footer.jsx) */}
      {/* <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-red-500 font-bold text-xl">Spam</span>
                <span className="text-gray-200 font-sans text-xl">Guard</span>
              </div>
              <p className="text-gray-400 mt-1 text-sm">Protecting your inbox from unwanted emails</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">© 2025 SpamGuard. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}

export default Login;