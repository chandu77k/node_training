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

    if (!image_name || !file_name || !req.file) {
      return res.status(status.BAD_REQUEST).json({ message: messages.MISSING_FIELDS });
    }

    const imageBuffer = fs.readFileSync(req.file.path);

    await Images.create({
      image_name,
      image_file: imageBuffer,
      file_name,
      modified_date: null,
      file_path: req.file.filename
    });

    return res.status(status.OK).json({
      message: messages.UPLOAD_SUCCESS,
      file: req.file,
    });
  } catch (err) {
    console.error('Error uploading image:', err.message);
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: messages.UPLOAD_FAIL });
  }
};

/**
 * Fetch image by ID
 */
exports.getImageById = async (req, res) => {
  try {
    const image = await Images.findByPk(req.params.id);

    if (!image) {
      return res.status(status.NOT_FOUND).json({ message: messages.NOT_FOUND });
    }

    const base64Image = image.image_file.toString('base64');

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
    const images = await Images.findAll({ order: [['image_id', 'ASC']] });

    const formatted = images.map(img => ({
      ...img.toJSON(),
      image_file: img.image_file.toString('base64'),
      modified_date: img.modified_date || null,
    }));

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
    const image = await Images.findByPk(req.params.id);

    if (!image) {
      return res.status(status.NOT_FOUND).json({ message: messages.NOT_FOUND });
    }

    if (!image_name || !file_name) {
      return res.status(status.BAD_REQUEST).json({ message: messages.MISSING_FIELDS });
    }

    const updateData = {
      image_name,
      file_name,
      modified_date: new Date(),
    };

    // If new file provided, update it
    if (req.file) {
      const oldPath = path.join(__dirname, '../uploads', image.file_path);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      updateData.image_file = fs.readFileSync(req.file.path);
      updateData.file_path = req.file.filename;
    }

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
    const image = await Images.findOne({ where: { image_id: req.params.id } });

    if (!image) {
      return res.status(status.NOT_FOUND).json({ message: messages.NOT_FOUND });
    }

    const filePath = path.join(__dirname, '../uploads', image.file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await image.destroy();

    return res.status(status.OK).json({ message: messages.DELETE_SUCCESS });
  } catch (err) {
    console.error('Error deleting image:', err.message);
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: messages.DELETE_FAIL });
  }
};
