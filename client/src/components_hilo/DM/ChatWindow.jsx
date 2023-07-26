import styles from './styles.module.css';
import React, { useState, useEffect, useRef } from 'react';

const ChatWindow = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const websocket = useRef(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      const token = localStorage.getItem('token')
      // Create a new WebSocket connection when the conversation changes
      websocket.current = new WebSocket(`ws://localhost:8080/ws`, token);

      websocket.current.onopen = () => {
        console.log('WebSocket connection opened.');
      };

      websocket.current.onmessage = (event) => {
        const incomingMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      };

      websocket.current.onerror = (error) => {
        console.error('WebSocket error: ', error);
      };

      websocket.current.onclose = () => {
        console.log('WebSocket connection closed.');
      };
    }

    // Close the WebSocket connection when the component is unmounted or the conversation changes
    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, [conversation]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      content: message,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (websocket.current) {
      websocket.current.send(JSON.stringify(newMessage));
    }

    setMessages([...messages, newMessage]);
    setMessage('');
  };
  
  return (
    <div className="h-full p-4">
      {conversation ? (
        <div className="h-full bg-white border border-gray-300 rounded">
          <div className="p-4 flex flex-col h-full">
            <h1 className="text-2xl font-bold mb-4 border-b border-gray-300">{conversation.name}</h1>
            <div className="flex-grow overflow-y-auto" ref={chatWindowRef}>
              {/* Messages */}
              <div className="flex flex-col space-y-4 px-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col items-${msg.sender === 'You' ? 'end' : 'start'}`}
                  >
                    <div
                      className={`${
                        msg.sender === 'You'
                          ? 'bg-cyan-500 text-white rounded-t-lg rounded-bl-lg items-end'
                          : 'bg-gray-200 rounded-t-lg rounded-br-lg items-start'
                      } py-2 px-4 max-w-lg`}
                    >
                      {msg.content}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {msg.sender} - {msg.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex">
              <input
                type="text"
                className="flex-grow border border-gray-300 rounded px-4 py-2 mr-2 focus:outline-none"
                placeholder="Type your message..."
                value={message}
                onChange={handleMessageChange}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none"
                onClick={handleSendMessage}
              >
                Send
              </button>
              
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Select a conversation to start chatting.</p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
