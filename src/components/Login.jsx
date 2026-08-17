import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error("Error signing in with Google", error);
      alert("Failed to sign in. Please check console for details.");
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel login-card animate-fade-in">
        <div className="logo-container">
          <div className="logo-icon">💬</div>
        </div>
        <h1 className="login-title">Welcome to ChatRooms</h1>
        <p className="login-subtitle">Connect with your friends instantly.</p>
        
        <button onClick={handleSignIn} className="btn-primary google-btn">
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
