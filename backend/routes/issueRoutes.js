import express from 'express';
import Issue from '../models/issue.js';
const router = express.Router();

// Route to save a new issue
router.post('/', async (request, response) => {
    try {
        const {
            title,
            description,
            status = 'open', // Default status to 'open' if not provided
            priority,
            concernAuthority,
            reporter,
            comments,
            images,
            tags,
            colony,
            pincode,
            location // Location includes latitude and longitude
        } = request.body;

        // Validate required fields
        if (
            !title || 
            !description || 
            !priority || 
            !concernAuthority || 
            !reporter || 
            !Array.isArray(comments) || 
            !Array.isArray(images) || 
            !Array.isArray(tags) ||
            !colony || // Validate colony
            !pincode || // Validate pincode
            !location || // Validate location
            !Array.isArray(location.coordinates) || location.coordinates.length !== 2
        ) {
            return response.status(400).json({ error: "All fields are required and must be valid!" });
        }

        // Check additional validation for images (max 3)
        if (images.length > 3) {
            return response.status(400).json({ error: "You can upload a maximum of 3 images." });
        }

        // Validate the status if provided (optional field)
        const validStatuses = ['open', 'in-progress', 'resolved', 'closed', 'complete'];
        if (status && !validStatuses.includes(status)) {
            return response.status(400).json({ error: "Invalid status value" });
        }

        // Adding a new issue
        const newIssue = new Issue({
            title,
            description,
            status,  // The status will be 'open' if not provided
            priority,
            concernAuthority,
            reporter,
            comments,
            images,
            tags,
            colony,
            pincode,
            location
        });

        await newIssue.save(); // Save issue to database
        response.status(201).json({ message: "Issue created successfully", issue: newIssue });

    } catch (error) {
        console.error("Error creating issue:", error);
        response.status(500).json({ error: "An error occurred while creating the issue", details: error.message });
    }
});

// Route to fetch all issues
router.get('/', async (request, response) => {
  try {
      console.log('Fetching issues...');
      const issues = await Issue.find({});
      console.log('Found issues:', issues);
      return response.status(200).json(issues);
  } catch (error) {
      console.error('Error fetching issues:', error);
      response.status(500).json({ 
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
  }
});

// Route to fetch issues by area (colony and pincode)
router.get('/by-address', async (request, response) => {
    const { colony, pincode } = request.query;

    try {
        // Query issues based on provided colony and pincode
        const issues = await Issue.find({
            colony, // Filter by colony if provided
            pincode // Filter by pincode if provided
        });

        if (issues.length === 0) {
            return response.status(404).json({ message: "No issues found for the given address details." });
        }

        return response.status(200).json(issues);
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
});

// Route to fetch issues near a given location using geospatial queries
router.get('/nearby', async (request, response) => {
    const { longitude, latitude, radius } = request.query;

    // Validate if coordinates and radius are provided
    if (!longitude || !latitude || !radius) {
        return response.status(400).json({ error: "Longitude, latitude, and radius are required" });
    }

    try {
        // Fetch issues near the specified location using geospatial query
        const issues = await Issue.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)] // [longitude, latitude]
                    },
                    $maxDistance: parseInt(radius) * 1000 // Convert radius to meters
                }
            }
        });

        if (issues.length === 0) {
            return response.status(404).json({ message: "No issues found within the specified radius." });
        }

        return response.status(200).json(issues);
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
});


export default router;