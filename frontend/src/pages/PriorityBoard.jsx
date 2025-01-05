import React, { useState, useEffect, useCallback } from 'react';
import PriorityIssue from '../components/PriorityIssue';
import { Pagination, CircularProgress, Box, Container } from '@mui/material';
import './PriorityBoard.css';

const REFRESH_INTERVAL = 15000; // 15 seconds in milliseconds
const ISSUES_PER_PAGE = 10;

const PriorityBoard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchIssues = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/issues?sort=supported&page=${page}&limit=${ISSUES_PER_PAGE}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }

      const data = await response.json();
      
      // Handle the array response directly
      if (Array.isArray(data)) {
        setIssues(data);
        // If the backend doesn't provide total count, estimate based on current page data
        setTotalPages(data.length < ISSUES_PER_PAGE ? page : page + 1);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues');
    } finally {
      setLoading(false);
    }
  }, [page]); // Include page in dependency array

  useEffect(() => {
    // Initial fetch
    fetchIssues();

    // Set up periodic refresh
    const intervalId = setInterval(fetchIssues, REFRESH_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchIssues]); // Use fetchIssues in dependency array

  const handleUpvote = async (issueId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `http://localhost:5000/api/issues/${issueId}/upvote`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upvote');
      }

      // Refresh issues immediately after successful upvote
      fetchIssues();
    } catch (error) {
      console.error('Error upvoting:', error);
      alert(error.message);
    }
  };

  const handlePageChange = (event, newPage) => {
    // Reset loading state when changing pages
    setLoading(true);
    setPage(newPage);
  };

  if (loading && issues.length === 0) {
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
    <Container className="priority-board">
      <div className="priority-board-content">
        {issues.map((issue, index) => (
          <PriorityIssue
            key={issue._id}
            issue={issue}
            rank={index + 1 + (page - 1) * ISSUES_PER_PAGE}
            onUpvote={handleUpvote}
          />
        ))}
      </div>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Box display="flex" justifyContent="center" mt={4} mb={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          disabled={loading}
        />
      </Box>
    </Container>
  );
};

export default PriorityBoard;