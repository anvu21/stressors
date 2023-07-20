import styles from './styles.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const DM = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className='flex w-screen h-screen'>
      <Navbar />
      <div className="flex w-full bg-purp relative mt-14">
        <div className="w-1/4 border-r border-gray-300 bg-white">
          <ChatList
            selectedConversation={selectedConversation}
            onSelectConversation={handleConversationSelect}
          />
        </div>
        <div className="w-3/4">
          <ChatWindow conversation={selectedConversation} />
        </div>
      </div>
    </div>
  );
};

export default DM;
