import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileUpload from './FileUpload';
import ImageTable from './ImageTable';

const RoutingFile = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/imageTable" element={<ImageTable />} />
        <Route path="/upload/:id" element={<FileUpload />} />
      </Routes>
    </Router>
  );
};

export default RoutingFile;
