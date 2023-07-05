//import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components_hilo/Login/Login';
import Signup from './components_hilo/Signup/Signup';
import Main from './components_hilo/Main/Main';


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
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
