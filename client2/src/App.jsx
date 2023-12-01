//import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components_hilo/Login/Login';
import Signup from './components_hilo/Signup/Signup';
import Main from './components_hilo/Main/Main';
import Profile from './components_hilo/Profile/Profile';
import DM from './components_hilo/DM/DM';
import Navbar from './components_hilo/Navbar/Navbar';
import Admin from './components_hilo/Admin/Admin';


function App() {
  const user = localStorage.getItem("token");

  return (
    <div>
      
      <BrowserRouter>
        {user && <Navbar />}
        <Routes>

          {user && <Route path="/" exact element={<Admin />} />}
          <Route path="/login" element={<Login />}/>
          <Route path="/" element={<Navigate replace to="/Admin" />} />
          <Route path="/admin/signup" element={<Signup />}/>

          <Route path="/profile/:username" element={<Profile />}/>
          <Route path="/admin" element={<Admin />} />
          <Route path="/*" element={<Navigate replace to="/admin" />} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
