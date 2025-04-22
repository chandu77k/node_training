// Import required modules
const multer = require('multer');
const path = require('path');
const allowedTypes = require('../utils/allowedFileTypes');

// Configure multer storage engine
const storage = multer.diskStorage({
  // Set the destination folder where uploaded files will be saved
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Files will be stored in the "uploads" folder
  },

  // Define how uploaded files will be named
  filename: (req, file, cb) => {
    // Use the current timestamp + original file extension for uniqueness
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Custom file filter function to allow only specific file types
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase(); // Get the file extension
  if (allowedTypes.includes(ext)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type'), false); // Reject the file
  }
};

// Export the multer middleware configuration
// `.single('image')` means it expects a single file upload with the form field name 'image'
module.exports = multer({ storage, fileFilter }).single('image');
