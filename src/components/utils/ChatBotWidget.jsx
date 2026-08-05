import React, { useState, useRef, useEffect } from 'react';
import chatGif from '../../assets/chatbot.png';

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, top: 0, left: 0 });

  // Make the chat draggable
  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;

    const handleMouseDown = (e) => {
      pos.current = {
        x: e.clientX,
        y: e.clientY,
        top: chat.offsetTop,
        left: chat.offsetLeft,
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
      const dx = e.clientX - pos.current.x;
      const dy = e.clientY - pos.current.y;
      chat.style.top = `${pos.current.top + dy}px`;
      chat.style.left = `${pos.current.left + dx}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const header = chat.querySelector('.chat-header');
    if (header) header.addEventListener('mousedown', handleMouseDown);

    return () => {
      if (header) header.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Chatbot Icon */}
      <div
        className="chat-bot-icon position-fixed"
        style={{
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          cursor: 'pointer',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={chatGif}
          alt="Chatbot Icon"
          style={{ width: '100px', height: '100px' }}
          className="rounded-circle shadow animate-chatbot"
        />
      </div>

      {/* Chatbox Panel */}
      {isOpen && (
        <div
          ref={chatRef}
          className="chatbox-window shadow"
          style={{
            position: 'fixed',
            top: 'auto',
            left: 'auto',
            bottom: '90px',
            right: '20px',
            width: '300px',
            height: '400px',
            background: '#fff',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
        >
          {/* Header (Draggable Handle) */}
          <div className="chat-header bg-primary text-white p-2 rounded-top text-center" style={{ cursor: 'move' }}>
            <strong>Event Assistant</strong>
          </div>

          {/* Messages Body */}
          <div className="flex-grow-1 p-3 overflow-auto" style={{ fontSize: '0.9rem' }}>
            <div className="text-start bg-light p-2 rounded mb-2">
              👋 Hello! Need help finding an event?
            </div>
            <div className="text-end bg-primary text-white p-2 rounded mb-2">
              Yes, show Ganesh events near me.
            </div>
          </div>

          {/* Input */}
          <div className="p-2 border-top">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Type a message..." />
              <button className="btn btn-primary">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotWidget;
