// src/ChatList.js
import React, { useEffect, useState } from 'react';





const ChatList = ({ selectedConversation, onSelectConversation }) => {
  const [conversation, setConversation] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);

  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    const group_id = localStorage.getItem('groupID');
    const username = localStorage.getItem('name');
    fetch(`http://localhost:5000/groupUsers/${group_id}/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Pass the token in the header
        'auth-token': token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setGroupUsers(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);




  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      <ul className="space-y-4">
        {groupUsers.map((groupUsers) => (
          <li
            key={groupUsers.username}
            className={`p-2 cursor-pointer ${
              selectedConversation?.username === groupUsers.username ? 'bg-blue-100' : ''
            }`}
            onClick={() => onSelectConversation(groupUsers)}
          >
            {groupUsers.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
