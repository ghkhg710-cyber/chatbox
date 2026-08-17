import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { FiSend, FiArrowLeft } from 'react-icons/fi';
import './ChatRoom.css';

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const user = auth.currentUser;

  useEffect(() => {
    if (!roomId) return;

    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL
    });

    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="glass-panel chat-panel">
        <div className="chat-header">
          <button className="btn-icon" onClick={() => navigate('/')} title="Leave Room">
            <FiArrowLeft size={20} />
          </button>
          <div className="room-info">
            <h2>Room: <span>{roomId}</span></h2>
          </div>
        </div>

        <div className="messages-list">
          {messages.map((msg) => {
            const isMe = msg.uid === user?.uid;
            return (
              <div key={msg.id} className={`message-wrapper ${isMe ? 'sent' : 'received'}`}>
                {!isMe && (
                  <img 
                    src={msg.photoURL || 'https://via.placeholder.com/32'} 
                    alt="avatar" 
                    className="msg-avatar" 
                  />
                )}
                <div className="message-content">
                  {!isMe && <span className="msg-sender">{msg.displayName}</span>}
                  <div className={`message-bubble ${isMe ? 'my-msg' : 'their-msg'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            className="input-field"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
