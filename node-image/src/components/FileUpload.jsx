import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import '../css/FileUpload.css';
import Button from "react-bootstrap/Button";
const FileUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageName, setImageName] = useState('');
  const [fileName, setFileName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchImageData = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/images/${id}`);
          setImageName(res.data.image_name);
          setFileName(res.data.file_name);
        } catch (err) {
          console.error('Error fetching image data:', err);
          setMessage('Failed to load image data for editing.');
        }
      };

      fetchImageData();
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageName || !fileName) {
      setMessage('Please enter both image name and file name.');
      return;
    }

    const formData = new FormData();
    formData.append('image_name', imageName);
    formData.append('file_name', fileName);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    setLoading(true);
    setMessage('');

    try {
      if (id) {
        await axios.put(`http://localhost:3000/update/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Image updated successfully!');
      } else {
        await axios.post(`http://localhost:3000/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Image uploaded successfully!');
      }

      setTimeout(() => {
        navigate('/imageTable');
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to upload/update image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="container">
         <div className="form-container">
    <div style={{ padding: '20px' }}>
      <h2>{id ? 'Edit Image' : 'Upload New Image'}</h2><br />
      <Form onSubmit={handleSubmit} className="full-form">
          <Form.Label>Image Name</Form.Label> <br/>
          <div className="side-heading-row">
          <Form.Control
            className="input-fields"
            type="text"
            placeholder="Image Name"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
          />
          </div><br />
          <div>
          <Form.Label>{id ? 'Replace Image File : ' : 'Upload Image File : '}</Form.Label> <br/>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          {fileName && (
          <div style={{ marginTop: '8px' }}>
          <small><strong>Current file:</strong> {fileName}</small>
          </div>
          )}
          </div><br />
          <Button variant="primary" type="submit" className="submit-btn submitting"  disabled={loading}>
          {loading ? (id ? 'Updating...' : 'Uploading...') : id ? 'Update Image' : 'Upload Image'}
          </Button>
        </Form><br />
        {message && <p>{message}</p>}
    </div>
    </div>
    </div>
  );
};

export default FileUpload;
