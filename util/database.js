const Sequelize= require('sequelize');

const sequelize = new Sequelize('node_ecommerce', 'root', 'Fidelwole@27', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;