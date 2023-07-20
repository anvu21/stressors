// src/ChatList.js
import React from 'react';

const conversations = [
  { id: 1, name: 'Friend 1' },
];

const ChatList = ({ selectedConversation, onSelectConversation }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      <ul className="space-y-4">
        {conversations.map((conversation) => (
          <li
            key={conversation.id}
            className={`p-2 cursor-pointer ${
              selectedConversation?.id === conversation.id ? 'bg-blue-100' : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            {conversation.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
