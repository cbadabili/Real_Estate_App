import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import PropertiesPage from './pages/PropertiesPage'
import PlotsPage from './pages/PlotsPage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/plots" element={<PlotsPage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />
      </Routes>
    </div>
  )
}

export default App