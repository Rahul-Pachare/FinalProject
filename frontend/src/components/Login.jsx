// import React, { useEffect } from 'react'
// import { loginWithGoogle } from '../api.js'
// import {useNavigate} from 'react-router-dom'
// function Login() {
//     const navigate = useNavigate();

//   useEffect(() => {
//     const token = new URLSearchParams(window.location.search).get('token');
//     if (token) {
//       localStorage.setItem('token', token);
//       navigate('/dashboard');
//     }
//   }, [navigate]);
//   return (
//     <div>
//         <h2>login here</h2>
//      <button onClick={loginWithGoogle}>Login with Google</button> 
//     </div>
//   )
// }

// export default Login

import React, { useEffect } from 'react';
import { ManunalScan, loginWithGoogle } from '../api.js';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
 const scanMail = async ()=>{
  const resp =  await ManunalScan();
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-200">
      {/* Header Section */}
      <header className="absolute top-0 left-0 p-6">
        <div className="flex items-center space-x-2">
          <img
            src="/spamguard-logo.png" // Replace with your actual logo path
            alt="SpamGuard Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-gray-800">SpamGuard</h1>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-lg w-full p-8 bg-white rounded-2xl shadow-xl text-center space-y-6">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome to SpamGuard
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-lg">
          An automated spam email detection and deletion system that efficiently handles and manages spam emails for you.
        </p>

        {/* Login Button */}
        <button
          onClick={loginWithGoogle}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          Login with Google
        </button>
      </div>
      <div>
      <button
          onClick={scanMail}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          SCAN MAILS
        </button>
      </div>
      {/* Footer Section */}
      <footer className="absolute bottom-0 w-full text-center p-4 text-gray-500 text-sm">
        © 2023 SpamGuard. All rights reserved.
      </footer>
    </div>
  );
}

export default Login;