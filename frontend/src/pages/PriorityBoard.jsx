import React, { useState, useEffect } from 'react';
import PriorityIssue from '../components/PriorityIssue';
import { Pagination, CircularProgress, Box, Container } from '@mui/material';
import './PriorityBoard.css';

const PriorityBoard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const issuesPerPage = 10;

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/issues?sort=supported&page=${page}&limit=${issuesPerPage}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }

      const data = await response.json();
      setIssues(data);
      // Assuming total count is returned from backend
      // setTotalPages(Math.ceil(data.total / issuesPerPage));
      setTotalPages(5); // Temporary hardcoded value
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [page]);

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

      // Refresh issues after successful upvote
      fetchIssues();
    } catch (error) {
      console.error('Error upvoting:', error);
      alert(error.message);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (loading) {
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
            rank={index + 1 + (page - 1) * issuesPerPage}
            onUpvote={handleUpvote}
          />
        ))}
      </div>

      <Box display="flex" justifyContent="center" mt={4} mb={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Container>
  );
};

export default PriorityBoard;