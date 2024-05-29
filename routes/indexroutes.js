const express = require('express');

const routes = express.Router();

//order controller 
const ordercontoller = require('../controllers/ordercontroller');

//orderdetails controller
const orderdetailcontroller = require('../controllers/orderdetailcontoller');

//order routes
routes.post('/order_add', ordercontoller.order_add);
routes.delete('/delete_order', ordercontoller.delete_order);
routes.put('/update_order', ordercontoller.update_order);

//order_details routes
routes.post('/order_detail', orderdetailcontroller.order_detail);
routes.get('/orderdetails_view', orderdetailcontroller.orderdetails_view);
routes.delete('/deleteorder_detail', orderdetailcontroller.deleteorder_detail);
routes.put('/update_details', orderdetailcontroller.update_details);

module.exports = routes;