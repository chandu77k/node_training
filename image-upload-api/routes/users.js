const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Images = require('../models/images');
const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type'],
};

router.use(cors(corsOptions));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage }).single('image');

router.post('/upload', async function (req, res) {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', error: err.message });
    }

    const { image_name, file_name } = req.body;

    if (!image_name || !file_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const imageBuffer = fs.readFileSync(req.file.path);

      await Images.create({
        image_name,
        image_file: imageBuffer,
        file_name,
        modified_date: null, 
        file_path: req.file.filename
      });

      res.status(200).json({
        message: 'Image uploaded successfully',
        file: req.file,
      });
    } catch (dbErr) {
      console.error('Error saving to database:', dbErr.message);
      res.status(500).json({ error: 'Failed to save image data to database' });
    }
  });
});

router.get('/images/:id', async function (req, res) {
  const imageId = req.params.id;

  try {
    const image = await Images.findByPk(imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const base64Image = image.image_file.toString('base64');

    res.status(200).json({
      ...image.toJSON(),
      image_file: base64Image,
    });
  } catch (err) {
    console.error('Error fetching image:', err.message);
    res.status(500).json({ message: 'Failed to retrieve image' });
  }
});

router.put('/update/:id', upload, async function (req, res) {
  const imageId = req.params.id;
  const { image_name, file_name } = req.body;

  if (!image_name || !file_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const image = await Images.findByPk(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const updatedImageData = {
      image_name,
      file_name,
      modified_date: new Date(),
    };

    if (req.file) {
      const oldFilePath = path.join(__dirname, '../uploads', image.file_path);

      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error('Error deleting old image file:', err.message);
        } else {
          console.log('Old image file deleted successfully');
        }
      });

      const imageBuffer = fs.readFileSync(req.file.path);
      updatedImageData.image_file = imageBuffer;
      updatedImageData.file_path = req.file.filename;
    }

    await image.update(updatedImageData);

    res.status(200).json({
      message: 'Image updated successfully',
      updatedImage: updatedImageData,
    });
  } catch (err) {
    console.error('Error updating image:', err.message);
    res.status(500).json({ message: 'Failed to update image' });
  }
});

router.delete('/delete/:id', async function (req, res) {
  const imageId = req.params.id;
  console.log('Backend: Received imageId to delete:', imageId);

  try {
    const image = await Images.findOne({ where: { image_id: imageId } });

    if (!image) {
      console.log('Backend: Image not found');
      return res.status(404).json({ message: 'Image not found' });
    }

    const filePath = path.join(__dirname, '../uploads', image.file_path);

    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Error deleting file from uploads folder:', err.message);
      } else {
        console.log('File deleted from uploads folder');
      }

      await image.destroy();

      console.log('Backend: Image deleted successfully');
      res.status(200).json({ message: 'Image and file deleted successfully' });
    });

  } catch (err) {
    console.error('Backend: Error deleting image:', err.message);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

router.get('/images', async function (req, res) {
  try {
    const images = await Images.findAll({
      order: [['image_id', 'ASC']],
    });

    const imagesWithBase64 = images.map((img) => {
      const base64Image = img.image_file.toString('base64');
      return {
        ...img.toJSON(),
        image_file: base64Image,
        modified_date: img.modified_date ? img.modified_date : null,
      };
    });

    res.status(200).json(imagesWithBase64);
  } catch (err) {
    console.error('Error fetching images:', err.message);
    res.status(500).json({ message: 'Error retrieving images' });
  }
});

module.exports = router;
