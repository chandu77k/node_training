// Import required modules
const fs = require('fs'); 
const path = require('path');
const Images = require('../models/images');
const messages = require('../utils/messages');
const status = require('../utils/statusCodes');

/**
 * Upload a new image
 */
exports.uploadImage = async (req, res) => {
  try {
    const { image_name, file_name } = req.body;

    // Validate required fields
    if (!image_name || !file_name || !req.file) {
      return res.status(status.BAD_REQUEST).json({ message: messages.MISSING_FIELDS });
    }

    // Read the uploaded file from disk as a buffer
    const imageBuffer = fs.readFileSync(req.file.path);

    // Create a new record in the Images table
    await Images.create({
      image_name,
      image_file: imageBuffer, // Save the image as binary data
      file_name,
      modified_date: null,
      file_path: req.file.filename // Save the filename for filesystem reference
    });

    // Respond with success
    return res.status(status.OK).json({
      message: messages.UPLOAD_SUCCESS,
      file: req.file,
    });
  } catch (err) {
    // Handle any server-side errors
    console.error('Error uploading image:', err.message);
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: messages.UPLOAD_FAIL });
  }
};

/**
 * Fetch image by ID
 */
exports.getImageById = async (req, res) => {
  try {
    // Find the image record by primary key (ID)
    const image = await Images.findByPk(req.params.id);

    if (!image) {
      return res.status(status.NOT_FOUND).json({ message: messages.NOT_FOUND });
    }

    // Convert the binary image file to base64 for JSON transport
    const base64Image = image.image_file.toString('base64');

    // Send the image data in the response
    return res.status(status.OK).json({
      ...image.toJSON(),
      image_file: base64Image,
    });
  } catch (err) {
    console.error('Error fetching image:', err.message);
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: messages.RETRIEVE_FAIL });
  }
};

/**
 * Get all images
 */
exports.getAllImages = async (req, res) => {
  try {
    // Retrieve all images from the database, ordered by image_id
    const images = await Images.findAll({ order: [['image_id', 'ASC']] });

    // Format each image by converting binary data to base64
    const formatted = images.map(img => ({
      ...img.toJSON(),
      image_file: img.image_file.toString('base64'),
      modified_date: img.modified_date || null,
    }));

    // Return all formatted images
    return res.status(status.OK).json(formatted);
  } catch (err) {
    console.error('Error fetching images:', err.message);
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: messages.RETRIEVE_FAIL });
  }
};

/**
 * Update an existing image
 */
exports.updateImage = async (req, res) => {
  try {
    const { image_name, file_name } = req.body;

    // Find the image by ID
    const image = await Images.findByPk(req.params.id);

    if (!image) {
      return res.status(status.NOT_FOUND).json({ message: messages.NOT_FOUND });
    }

    // Validate new data
    if (!image_name || !file_name) {
      return res.status(status.BAD_REQUEST).json({ message: messages.MISSING_FIELDS });
    }

    const updateData = {
      image_name,
      file_name,
      modified_date: new Date(), // Update the modification date
    };

    // If a new image file is provided
    if (req.file) {
      // Delete the old file from the uploads folder
      const oldPath = path.join(__dirname, '../uploads', image.file_path);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      // Read new image and update fields
      updateData.image_file = fs.readFileSync(req.file.path);
      updateData.file_path = req.file.filename;
    }

    // Update the image record in the database
    await image.update(updateData);

    return res.status(status.OK).json({
      message: messages.UPDATE_SUCCESS,
      updatedImage: updateData,
    });
  } catch (err) {
    console.error('Error updating image:', err.message);
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: messages.UPDATE_FAIL });
  }
};

/**
 * Delete an image by ID
 */
exports.deleteImage = async (req, res) => {
  try {
    // Find image by ID
    const image = await Images.findOne({ where: { image_id: req.params.id } });

    if (!image) {
      return res.status(status.NOT_FOUND).json({ message: messages.NOT_FOUND });
    }

    // Delete the image file from the filesystem
    const filePath = path.join(__dirname, '../uploads', image.file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Delete the record from the database
    await image.destroy();

    return res.status(status.OK).json({ message: messages.DELETE_SUCCESS });
  } catch (err) {
    console.error('Error deleting image:', err.message);
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: messages.DELETE_FAIL });
  }
};
