import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import {Navbar} from './components'
import CoverLetter from './CoverLetter';
import Summary from './Summary';
const  App=() =>{

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CoverLetter />} />
        <Route path="/Summary" element={<Summary />} />
      </Routes>

    </BrowserRouter>

  
)
}

export default App
