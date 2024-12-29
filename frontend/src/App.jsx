import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UploadIssuePage from './pages/UploadIssuePage';
import './App.css';

function App() {
  const [issues, setIssues] = useState([]);

  // Fetch issues data from the backend API
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/issues'); // Replace with your actual API URL
        const data = await response.json();
        setIssues(data); // Set the issues state
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };
    fetchIssues();
  }, []); // Empty array to run the effect only once on component mount

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage issues={issues} />} /> {/* Pass issues as a prop to HomePage */}
        <Route path="/upload-issue" element={<UploadIssuePage />} />
      </Routes>
    </Router>
  );
}

export default App;
