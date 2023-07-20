import styles from './styles.module.css';
import React, { useState, useEffect, useRef } from 'react';

const ChatWindow = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    // temp messages
    { id: 1, content: 'Hello, how are you?', sender: 'John Doe', timestamp: '10:30 AM' },
    { id: 2, content: "I'm doing well, thanks!", sender: 'You', timestamp: '10:32 AM' },
  ]);

  const chatWindowRef = useRef(null);

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
      sender: 'You', // For simplicity, assume the user always sends the messages
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  {/**  
  const [messages, setMessages] = useState([]);
  const [MessageText, setMessageText] = useState({});
  
  useEffect(() => {
    fetchMessages();
  }, [conversation]);

  const handleMessageChange = ({ currentTarget: input }) => {
    setMessageText({ ...MessageText, [input.name]: input.value });
    console.log(newMessageText);
  };
  
  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() === '') return;

    let groupid = localStorage.getItem("groupID") 
    const { message_text } = MessageText;
    console.log(MessageText)
    
    try {
      const response = await axios.post('http://localhost:5000/message', { message_text, group_id: groupid}, {
        headers: {
          'auth-token': localStorage.getItem('token') 
        }
      });   
      
      setMessageText((prevMessageText) => ({
        ...prevMessageText,
      }));
      
      console.log(response)
      //alert(response.data.message);
      fetchMessages();
      
    } catch (error) {
      console.error(error);
      alert('Could not create message');
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/messages/${groupId}`, {
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });
      console.log(response)
      const sortedMessages = response.data.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    
      setMessages(sortedMessages);
      console.log("message fetch")
      console.log(sortedMessages);
    } catch (error) {
      console.error('Fetching commments failed:', error);
    }
  }

  const chatWindowRef = useRef(null);
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

*/}
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
