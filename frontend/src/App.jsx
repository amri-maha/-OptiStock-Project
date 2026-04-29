import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Import CSS
import './Home.css';
import './Login.css';
import './Register.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Home />} />

        {/* Se connecter */}
        <Route path="/login" element={<Login />} />

        {/* Rejoindre / S'inscrire */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard (protégé — à implémenter avec auth) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} /> 
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
import Analytics from './pages/Analytics'; // Import de la nouvelle page

import Settings from './pages/Settings';

