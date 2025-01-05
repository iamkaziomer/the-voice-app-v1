import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import PrimaryPage from './pages/PrimaryPage';
import PriorityBoard from './pages/PriorityBoard';
import BlogsPage from './pages/BlogsPage';
import UploadIssuePage from './pages/UploadIssuePage';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          
          <main className="main-content">
            <Routes>
              {/* Redirect root to primary page */}
              <Route path="/" element={<Navigate to="/primary" replace />} />
              
              {/* Main routes */}
              <Route path="/primary" element={<PrimaryPage />} />
              <Route path="/issues" element={<HomePage />} />
              <Route path="/priority" element={<PriorityBoard />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/upload-issue" element={<UploadIssuePage />} />
              
              {/* Catch all route - redirect to primary */}
              <Route path="*" element={<Navigate to="/primary" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;