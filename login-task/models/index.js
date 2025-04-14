var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres', 'postgres', 'Chandu@123', {
    host: 'localhost',
    port: 5433,
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(function () { console.log('DB connected')})
    .catch(function (err) { console.error('DB connection failed:', err);});

module.exports = sequelize;