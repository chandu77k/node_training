const express = require('express');
const cors = require('cors');
const router = express.Router();

const upload = require('../middlewares/upload');
const imageController = require('../controllers/imageController');

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type'],
};

router.use(cors(corsOptions));

// Routes
router.post('/upload', upload, imageController.uploadImage);
router.get('/images/:id', imageController.getImageById);
router.get('/images', imageController.getAllImages);
router.put('/update/:id', upload, imageController.updateImage);
router.delete('/delete/:id', imageController.deleteImage);

module.exports = router;
