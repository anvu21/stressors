import styles from './styles.module.css';
import React, { useState, useEffect, useRef,useMemo  } from 'react';
import io from 'socket.io-client';
const ChatWindow = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket  = useRef(null);
  const chatWindowRef = useRef(null);
  const user = localStorage.getItem('name');

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
    socket.current = io(`${import.meta.env.VITE_APP_SOCKET_URL}`, {
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
  // Scroll to the bottom of the chat window when new messages are added
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
  
    setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage('');
    console.log(messages);
    console.log(conversation);
  };
  
  return (
    
    <div className={styles.message_box}>
      {conversation ? (
        <div className={styles.message_bg}>
          <div className={styles.message_flex}>
            <h1 className={styles.name}>{conversation.name}</h1>
            <div className="flex-grow overflow-y-auto" ref={chatWindowRef}>
              {/* Messages */}
              <div className="flex flex-col space-y-4 px-4">
                {messages.slice().reverse().map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col items-${msg.sender === user ? 'end' : 'start'}`}
                  >
                    <div
                      className={`${
                        msg.sender === user
                          ? styles.user_content
                          : styles.friend_content
                      } py-2 px-4 max-w-lg`}
                    >
                      {msg.content}
                    </div>
                    <div className={styles.time}>
                      {msg.sender} - {msg.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.input_flex}>
              <input
                type="text"
                className={styles.input}
                placeholder="Type your message..."
                value={message}
                onChange={handleMessageChange}
              />
              <button
                className={styles.send}
                onClick={handleSendMessage}
              >
                Send
              </button>
              
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.default}>
          Select a conversation to start chatting.
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
