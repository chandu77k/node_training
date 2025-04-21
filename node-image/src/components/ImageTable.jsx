import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import '../css/ImageTable.css';
const ImageTable = () => {
  const [images, setImages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get('http://localhost:3000/images/');
      setImages(res.data);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/upload/${id}`);
  };

  const handleNew = () => {
    navigate('/');
  };

  const handleDeleteClick = (image) => {
    setImageToDelete(image);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setImageToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/delete/${imageToDelete.image_id}`);
      setImages(prevImages => prevImages.filter(img => img.image_id !== imageToDelete.image_id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete the image');
      setShowDeleteModal(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className='heading-addNew'>
      <h2 className='heading'>Image Table</h2>
      <Button variant="primary" onClick={handleNew} className='addNew'>Add New Image</Button>
      </div>
      <div className="table-scroll-container">
      <Table striped bordered hover className='table-class'>
        <thead className='table-head'>
          <tr>
            <th>ID</th>
            <th>Image Name</th>
            <th>Thumbnail</th>
            <th>File Name</th>
            <th>Upload Date</th>
            <th>Modified Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.map((img) => (
            <tr key={img.image_id}>
              <td>{img.image_id}</td>
              <td>{img.image_name}</td>
              <td>
                <img
                  src={`data:image/jpeg;base64,${img.image_file}`}
                  alt={img.image_name}
                  width="80"
                  height="80"
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
              </td>
              <td>{img.file_name}</td>
              <td>{new Date(img.upload_date).toLocaleString()}</td>
              <td>{img.modified_date ? new Date(img.modified_date).toLocaleString() : ''}</td>
              <td>
                <Button variant="outline-primary" onClick={() => handleEdit(img.image_id)} style={{ marginRight: '10px' }}>
                  Edit
                </Button>
                <Button variant="outline-danger" onClick={() => handleDeleteClick(img)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
      <Modal show={showDeleteModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete image <strong>{imageToDelete?.image_name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageTable;
