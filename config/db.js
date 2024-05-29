const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('bulk_order_api', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
    }).catch((error) => {
        console.error('Database connection error:', error);
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.ordermodel = require('../models/order')(sequelize, DataTypes);
db.orderdetailmodel = require('../models/orderdetails')(sequelize, DataTypes);
db.duplicate_orderdetail_model = require('../models/duplicateorderdetails')(sequelize, DataTypes);
db.duplicate_order_model = require('../models/duplicateordermodel')(sequelize, DataTypes);

db.sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
    }).catch((error) => {
        console.error('Database synchronization error:', error);
    });

module.exports = db;
