//import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components_hilo/Login/Login';
import Signup from './components_hilo/Signup/Signup';
import Main from './components_hilo/Main/Main';
import Profile from './components_hilo/Profile/Profile';
import DM from './components_hilo/DM/DM';


function App() {
  const user = localStorage.getItem("token");

  return (
    <div>
      
      <BrowserRouter>
        <Routes>
       
          <Route path="/main" element={<Main />}/>
          {user && <Route path="/" exact element={<Main />} />}
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
  
          <Route path="/profile/:username" element={<Profile />}/>
          <Route path="/messages" element={<DM />} />
          <Route path="/*" element={<Navigate replace to="/main" />} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
