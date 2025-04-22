// Load environment variables from .env file
require('dotenv').config();

const Sequelize = require('sequelize');

// Initialize Sequelize with database credentials from environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    timezone: '+05:30',
  }
);

// Test the database connection
sequelize.authenticate()
  .then(() => console.log(' Database connected'))
  .catch((err) => console.error('DB connection failed:', err));

module.exports = sequelize;
