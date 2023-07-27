import styles from './styles.module.css';
import React, { useState, useEffect, useRef,useMemo  } from 'react';
import io from 'socket.io-client';
const ChatWindow = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket  = useRef(null);
  const chatWindowRef = useRef(null);

  const conversationId = useMemo(() => {
    if (!conversation) return null;

    const userId = localStorage.getItem('name');
    const receiverId = conversation.username;
    return [userId, receiverId].sort().join(':');
}, [conversation]);

  useEffect(() => {
    if (conversation) {
    console.log(conversation)
    console.log(conversationId)
    // set the current reference to the socket connection
    socket.current = io('http://localhost:8080', {
      path: '/ws',
      query: { token: localStorage.getItem('token') }
    });

        // Join the conversation room
        socket.current.emit('join conversation', conversationId);

    socket.current.on('old messages', (oldMessages) => {
      // Transform oldMessages to match the structure of the messages state
      const transformedMessages = oldMessages.map(message => ({
        id: message.id,
        content: message.content,
        sender: message.sender_name,
        receiver_name: conversation.username,
        timestamp: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
    
      // Set the messages state to the transformed old messages
      setMessages(transformedMessages);
    });
  
    socket.current.on('chat message', (msg) => {
      console.log('received a message:', msg);
      socket.current.emit('fetch old messages', { group_id: localStorage.getItem('groupID'), receiver_name: conversation.username, user_id: localStorage.getItem('userID') });

    });
  
    socket.current.on('connect_error', (err) => {
      console.error('connection error:', err.message);
    });
  
    socket.current.emit('fetch old messages', { group_id: localStorage.getItem('groupID'), receiver_name: conversation.username, user_id: localStorage.getItem('userID') });

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
}
}, [conversation,conversationId]);
  
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
      conversationId,
      group_id: localStorage.getItem('groupID'),
      content: message,
      sender_id: localStorage.getItem('name'),
      receiver_name: conversation.username,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  
    if (socket.current) {
      socket.current.emit('chat message', JSON.stringify(newMessage));
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
