// Import required modules
const express = require('express');
const cors = require('cors');
const router = express.Router();

// Import middleware and controller
const upload = require('../middlewares/upload');
const imageController = require('../controllers/imageController');

// Define CORS options to allow requests from a specific origin
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type'],
};

router.use(cors(corsOptions));

// Upload a new image
router.post('/upload', upload, imageController.uploadImage);

// Get a single image by its ID
router.get('/images/:id', imageController.getImageById);

// Get all images
router.get('/images', imageController.getAllImages);

// Update an existing image by ID 
router.put('/update/:id', upload, imageController.updateImage);

// Delete an image by ID
router.delete('/delete/:id', imageController.deleteImage);

module.exports = router;
