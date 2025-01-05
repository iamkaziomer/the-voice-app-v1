import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Button,
  LinearProgress,
  Box,
  Tooltip
} from '@mui/material';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function IssueCard({ issue }) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Calculate progress percentage
  const progress = (upvoteCount / (issue?.target || 100)) * 100;

  useEffect(() => {
    // Initialize upvote count from issue data
    if (issue?.upvotes?.count !== undefined) {
      setUpvoteCount(issue.upvotes.count);
    }

    // Check upvote status if user is logged in
    if (user && issue?._id) {
      checkUpvoteStatus();
    }
  }, [user, issue?._id]);

  const checkUpvoteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found for upvote status check');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/issues/${issue._id}/upvote-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check upvote status');
      }

      const data = await response.json();
      console.log('Upvote status response:', data);

      if (data.success) {
        setHasUpvoted(data.hasUpvoted);
        setUpvoteCount(data.upvoteCount);
      }
    } catch (error) {
      console.error('Error checking upvote status:', error);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleUpvoteClick = async () => {
    if (!user) {
      alert('Please login to upvote issues');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Making upvote request:', {
        issueId: issue._id,
        endpoint: hasUpvoted ? 'remove-upvote' : 'upvote'
      });

      const endpoint = hasUpvoted ? 'remove-upvote' : 'upvote';
      const response = await fetch(`http://localhost:5000/api/issues/${issue._id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server');
      }

      const data = await response.json();
      console.log('Upvote response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update upvote');
      }

      if (data.success) {
        setHasUpvoted(!hasUpvoted);
        setUpvoteCount(data.upvoteCount);
      }
    } catch (error) {
      console.error('Error updating upvote:', error);
      alert(error.message || 'Failed to update upvote');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 3,
      borderRadius: 4,
      overflow: 'hidden',
      '&:hover': {
        boxShadow: 6,
        transform: 'scale(1.02)',
        transition: 'all 0.2s ease-in-out'
      }
    }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="issue">
            {issue?.title?.charAt(0)}
          </Avatar>
        }
        title={
          <Typography 
            variant="h6" 
            component="div"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {issue?.title || 'Issue Title'}
          </Typography>
        }
        subheader={formatDate(issue?.createdAt)}
      />

      {issue?.images?.length > 0 && (
        <CardMedia
          component="img"
          height="194"
          image={issue.images[0]}
          alt="Issue Image"
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {issue?.description || 'No description available'}
        </Typography>
        
        <Box sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              {issue?.colony}, {issue?.pincode}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Filed under: <strong>{issue?.concernAuthority}</strong>
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {upvoteCount} supporters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Target: {issue?.target || 100}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(progress, 100)} 
            sx={{ 
              height: 8, 
              borderRadius: 5,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main'
              }
            }}
          />
        </Box>
      </CardContent>

      <CardActions disableSpacing sx={{ mt: 'auto' }}>
        <Button
          startIcon={hasUpvoted ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
          onClick={handleUpvoteClick}
          disabled={loading}
          color="primary"
          variant={hasUpvoted ? "contained" : "outlined"}
          sx={{ mr: 1 }}
        >
          {loading ? 'Processing...' : hasUpvoted ? 'Supported' : 'Support'} ({upvoteCount})
        </Button>

        <Tooltip title="Show more details">
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Tooltip>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph variant="h6">Additional Details:</Typography>
          <Typography paragraph>
            Status: <strong>{issue?.status}</strong>
          </Typography>
          <Typography paragraph>
            Priority: <strong>{issue?.priority}</strong>
          </Typography>
          {issue?.tags?.length > 0 && (
            <Typography paragraph>
              Tags: {issue.tags.join(', ')}
            </Typography>
          )}
          {issue?.comments?.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Comments:</Typography>
              {issue.comments.map((comment, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {comment.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.createdAt)}
                  </Typography>
                </Box>
              ))}
            </>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default IssueCard;