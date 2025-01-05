import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import TopCard from '../components/TopCard ';

const REFRESH_INTERVAL = 15000; // 15 seconds, matching PriorityBoard

const BlogsPage = () => {
  const [topIssues, setTopIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopIssues = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/issues?sort=supported&limit=3'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch top issues');
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setTopIssues(data);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching top issues:', err);
      setError('Failed to load top issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchTopIssues();

    // Set up periodic refresh
    const intervalId = setInterval(fetchTopIssues, REFRESH_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading && topIssues.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} textAlign="center" color="error.main">
        {error}
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4, 
          color: '#26313E',
          fontWeight: '600',
          textAlign: 'center'
        }}
      >
        Top Issues
      </Typography>

      <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
        {topIssues.map((issue, index) => (
          <TopCard
            key={issue._id}
            issue={issue}
            rank={index + 1}
          />
        ))}
      </Box>
    </Container>
  );
};

export default BlogsPage;