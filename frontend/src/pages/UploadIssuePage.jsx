import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadImages } from '../services/imageService';
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Paper,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Header from '../components/Header';
import './UploadIssuePage.css';

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

const priorityLevels = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' }
];

function UploadIssuePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    concernAuthority: '',
    colony: '',
    pincode: '',
    location: { type: 'Point', coordinates: [] },
    images: [],
    tags: [],
    status: 'open',
    priority: 'low'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
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

    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [user, navigate, imageUrls]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 3) {
      setError('Maximum 3 images allowed');
      return;
    }
    setImageFiles(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);
  };

  const handleImageDelete = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      if (!formData.title || !formData.description || !formData.concernAuthority || 
          !formData.colony || !formData.pincode) {
        throw new Error('Please fill in all required fields');
      }

      let finalFormData = { ...formData };

      if (imageFiles.length > 0) {
        const uploadedImages = await uploadImages(imageFiles);
        finalFormData.images = uploadedImages.map((img) => img.url);
      }

      const issueResponse = await fetch('http://localhost:5000/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalFormData)
      });

      if (!issueResponse.ok) {
        const errorData = await issueResponse.json();
        throw new Error(errorData.message || 'Failed to create issue');
      }

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      console.error('Error creating issue:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="page-container">
      <Header />
      <Container maxWidth="md" className="content-container">
        <Paper elevation={2} className="upload-form-container">
          <Typography variant="h5" className="page-title">
            Report New Issue
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Issue reported successfully!</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Issue Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              className="form-field"
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
              variant="outlined"
              className="form-field"
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                required
                select
                label="Priority Level"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                margin="normal"
                className="form-field"
              >
                {priorityLevels.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                required
                select
                label="Concern Authority"
                name="concernAuthority"
                value={formData.concernAuthority}
                onChange={handleChange}
                margin="normal"
                className="form-field"
              >
                {authorities.map((authority) => (
                  <MenuItem key={authority} value={authority}>
                    {authority}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                required
                label="Colony"
                name="colony"
                value={formData.colony}
                onChange={handleChange}
                margin="normal"
                className="form-field"
              />

              <TextField
                fullWidth
                required
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                margin="normal"
                className="form-field"
              />
            </Box>

            <Box className="image-upload-section">
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                className="upload-button"
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

              <Box className="image-preview-container">
                {imageUrls.map((url, index) => (
                  <Box key={index} className="image-preview-item">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleImageDelete(index)}
                      className="delete-image-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              className="submit-button"
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
