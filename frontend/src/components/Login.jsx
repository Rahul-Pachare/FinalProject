import React, { useEffect } from 'react'
import { loginWithGoogle } from '../api.js'
import {useNavigate} from 'react-router-dom'
function Login() {
    const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    }
  }, [navigate]);
  return (
    <div>
        <h2>login here</h2>
     <button onClick={loginWithGoogle}>Login with Google</button> 
    </div>
  )
}

export default Login
