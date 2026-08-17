import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { FiLogOut, FiArrowRight } from 'react-icons/fi';
import './RoomEntry.css';

const RoomEntry = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/chat/${roomCode.trim()}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel room-entry-card animate-fade-in">
        <div className="user-profile">
          <img src={user?.photoURL || 'https://via.placeholder.com/50'} alt="Profile" className="avatar" />
          <div className="user-info">
            <h3>Welcome back,</h3>
            <p>{user?.displayName || 'User'}</p>
          </div>
          <button onClick={handleSignOut} className="btn-icon" title="Sign Out">
            <FiLogOut size={20} />
          </button>
        </div>

        <div className="divider"></div>

        <h2 className="join-title">Join a Room</h2>
        <p className="join-subtitle">Enter a unique code to chat with friends.</p>

        <form onSubmit={handleJoin} className="join-form">
          <input
            type="text"
            className="input-field"
            placeholder="e.g. secret-base"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            <span>Join Chat</span>
            <FiArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomEntry;
