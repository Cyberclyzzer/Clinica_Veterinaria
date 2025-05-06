import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import './App.css'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OwnerPage from './pages/owner/OwnerPage';
import AdminPage from './pages/admin/AdminPage';
import VetPage from './pages/vet/VetPage';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />


      <Route path="/owner" element={<OwnerPage />} />

      <Route path="/vet" element={<VetPage/>} />

      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App
