import React, { useState, useEffect } from 'react';
import IssueCard from '../components/issueCard';
import Header from '../components/Header';
import { Box, Container, Grid, Typography } from '@mui/material';

function HomePage() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/issues');
        if (response.ok) {
          const data = await response.json();
          setIssues(data);
        } else {
          console.error('Failed to fetch issues');
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    fetchIssues();
  }, []);

  return (
    <Box>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Issues
        </Typography>
        <Grid container spacing={3}>
          {issues.length > 0 ? (
            issues.map((issue) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={issue._id}>
                <IssueCard issue={issue} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                No issues found
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;