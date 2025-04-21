var { DataTypes } = require('sequelize');
var sequelize = require('./index');

var Images = sequelize.define('images_table', {
    image_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      primaryKey: true, 
      autoIncrement: true, 
      field: 'image_id' 
    },
    image_name: { 
      type: DataTypes.STRING(255),
      allowNull: false, 
      field: 'image_name' 
    },
    image_file: { 
      type: DataTypes.BLOB('long'),
      allowNull: false, 
      field: 'image_file' 
    },
    file_name: { 
      type: DataTypes.STRING(255),
      allowNull: false, 
      field: 'file_name' 
    },
    file_path: { 
      type: DataTypes.STRING(255),
      allowNull: true, 
      field: 'file_path' 
    },
    upload_date: { 
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'upload_date'
    },
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
