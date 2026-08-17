import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import RoomEntry from './components/RoomEntry';
import ChatRoom from './components/ChatRoom';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="glass-panel">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* If user is logged in, show RoomEntry, else show Login */}
        <Route 
          path="/" 
          element={user ? <RoomEntry /> : <Login />} 
        />
        
        {/* If user is not logged in and tries to access chat, redirect to login */}
        <Route 
          path="/chat/:roomId" 
          element={user ? <ChatRoom /> : <Navigate to="/" replace />} 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
