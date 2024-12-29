import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import Header from '../components/Header';

const authorities = [
  "Hyderabad Metropolitan Water Supply and Sewerage Board (HMWSSB)",
  "Telangana State Southern Power Distribution Company Limited (TSSPDCL)",
  "Greater Hyderabad Municipal Corporation (GHMC)",
  "Telangana State Road Transport Corporation (TSRTC)",
  "Hyderabad Traffic Police",
  "Telangana State Pollution Control Board (TSPCB)",
  "Hyderabad Electric Supply Company Limited (HESCO)",
  "Public Works Department (PWD), Telangana",
  "Telangana State Fire and Emergency Services",
  "Hyderabad District Collector's Office"
];

function UploadIssuePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    concernAuthority: '',
    colony: '',
    pincode: '',
    location: { coordinates: [] },
    images: [],
    comments: [],
    tags: [],
    status: 'open',
    priority: 'low', // This will be updated based on signs later
    reporter: 'user' // This should be updated with actual user info when auth is implemented
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    // Get user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              type: 'Point',
              coordinates: [position.coords.longitude, position.coords.latitude]
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Failed to get location. Please try again.');
        }
      );
    }
  }, []);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 3) {
      setError('Maximum 3 images allowed');
      return;
    }
    setImageFiles(files);
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setImageUrls(urls);
  };

  const uploadToS3 = async (file) => {
    // This is a placeholder for AWS S3 upload logic
    // You'll need to implement this with your AWS credentials
    return 'https://your-s3-bucket.amazonaws.com/image-url';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Upload images to S3
      const uploadedUrls = await Promise.all(imageFiles.map(uploadToS3));
      
      // Prepare the final form data
      const finalFormData = {
        ...formData,
        images: uploadedUrls
      };

      // Submit to your API
      const response = await fetch('http://localhost:5000/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData)
      });

      if (!response.ok) {
        throw new Error('Failed to create issue');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
        <Header/>
    <Container maxWidth="md">
        
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Upload New Issue
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Issue created successfully!</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            select
            label="Concern Authority"
            name="concernAuthority"
            value={formData.concernAuthority}
            onChange={handleChange}
            margin="normal"
          >
            {authorities.map((authority) => (
              <MenuItem key={authority} value={authority}>
                {authority}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            required
            label="Colony"
            name="colony"
            value={formData.colony}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            margin="normal"
          />

          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2, mb: 2 }}
          >
            Upload Images (Max 3)
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {imageUrls.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
              ))}
            </Box>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Issue'}
          </Button>
        </form>
      </Paper>
    </Container>
    </div>
  );
}

export default UploadIssuePage;