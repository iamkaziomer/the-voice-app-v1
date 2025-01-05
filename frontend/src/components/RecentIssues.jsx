import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import './RecentIssues.css';

const RecentIssues = () => {
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/issues?sort=recent&limit=5');
      if (!response.ok) {
        throw new Error('Failed to fetch recent issues');
      }
      const data = await response.json();
      setRecentIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  const renderIssueCard = (issue) => {
    if (!issue || typeof issue !== 'object') return null;

    const upvoteCount = issue.upvotes?.count || 0;
    const firstImage = issue.images && issue.images.length > 0 ? issue.images[0] : null;

    return (
      <Box
        key={issue._id}
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 1,
          border: '1px solid #E5E7EB',
          display: 'flex',
          gap: 2,
          '&:last-child': {
            mb: 0
          },
          '&:hover': {
            backgroundColor: '#F8FAFC',
            transition: 'all 0.2s ease-in-out'
          }
        }}
      >
        {/* Image Section */}
        {firstImage && (
          <Box
            sx={{
              width: 100,
              height: 100,
              flexShrink: 0,
              borderRadius: 1,
              overflow: 'hidden'
            }}
          >
            <img
              src={firstImage}
              alt={issue.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.jpg'; // Add a placeholder image path
              }}
            />
          </Box>
        )}

        {/* Content Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: '#26313E',
              mb: 0.5
            }}
          >
            {issue.title || 'Untitled Issue'}
          </Typography>
          
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: '#4B5563',
              mb: 'auto',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5
            }}
          >
            {issue.description || 'No description provided'}
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2
          }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <PersonOutlineIcon sx={{ fontSize: '1rem', color: '#6B7280' }} />
                <Typography sx={{ 
                  fontSize: '0.75rem',
                  color: '#6B7280'
                }}>
                  {upvoteCount} signs
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <LocationOnIcon sx={{ fontSize: '1rem', color: '#6B7280' }} />
                <Typography sx={{ 
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {issue.colony || 'Unknown location'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <CalendarTodayIcon sx={{ fontSize: '1rem', color: '#6B7280' }} />
              <Typography sx={{ 
                fontSize: '0.75rem',
                color: '#6B7280'
              }}>
                {formatDate(issue.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Card sx={{
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#26313E', fontWeight: 600 }}>
            Recently Reported Issues
          </Typography>
          {[1, 2, 3].map((index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 1,
                border: '1px solid #E5E7EB',
                display: 'flex',
                gap: 2
              }}
            >
              <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="100%" height={20} />
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="20%" height={20} />
                </Box>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
      }}>
        <CardContent>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{
      height: '100%',
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
    }}>
      <CardContent>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            color: '#26313E',
            fontWeight: 600
          }}
        >
          Recently Reported Issues
        </Typography>
        
        {Array.isArray(recentIssues) && recentIssues.length > 0 ? (
          recentIssues.map(issue => renderIssueCard(issue))
        ) : (
          <Typography align="center" sx={{ color: '#6B7280' }}>
            No recent issues found
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentIssues;