// Import necessary modules from Sequelize
var { DataTypes } = require('sequelize');
var sequelize = require('./index');

// Define the 'images_table' model
var Images = sequelize.define('images_table', {
  // Primary key: auto-incremented integer ID
  image_id: { 
    type: DataTypes.INTEGER,           
    allowNull: false,               
    primaryKey: true,                
    autoIncrement: true,            
    field: 'image_id'                
  },

  // Image name
  image_name: { 
    type: DataTypes.STRING(255),    
    allowNull: false,         
    field: 'image_name'
  },

  // Image file as binary
  image_file: { 
    type: DataTypes.BLOB('long'),   
    allowNull: false,             
    field: 'image_file'         
  },

  // Original name of the uploaded file 
  file_name: { 
    type: DataTypes.STRING(255),  
    allowNull: false,            
    field: 'file_name'
  },

  // Stored path or filename of the uploaded image on the server
  file_path: { 
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'file_path' 
  },

  // Timestamp of when the image was uploaded
  upload_date: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'upload_date'
  },

  // Timestamp of last modification
  modified_date: { 
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'modified_date' 
  }

}, {
  tableName: 'images_table',
  timestamps: false 
});

module.exports = Images;
