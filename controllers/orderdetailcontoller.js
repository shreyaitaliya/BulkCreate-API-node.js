const { DataTypes, where } = require("sequelize");
const db = require("../config/db");
const sequelize = db.sequelize;

const OrderDetails = require("../models/orderdetails")(sequelize, DataTypes);
const DuplicateOrderDetails = require("../models/duplicateorderdetails")(sequelize, DataTypes);
const ordermodel = require("../models/order")(sequelize, DataTypes);

const order_detail = async (req, res) => {
    try {
        let orderDetailsData = req.body.orderdetails;

        // Parse orderdetails if it's a JSON string
        if (typeof orderDetailsData === 'string') {
            orderDetailsData = JSON.parse(orderDetailsData);
        }

        // Check if orderDetailsData is an array
        if (!Array.isArray(orderDetailsData)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data format: orderdetails should be an array of objects'
            });
        }


        for (const detail of orderDetailsData) {
            if (!detail.itemname || !detail.price || !detail.orderId) {
                return res.status(400).json({
                    success: false,
                    message: 'Each order detail must have itemname, price, and orderId'
                });
            }

            // Fetch the customername
            const order = await ordermodel.findByPk(detail.orderId);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: `Order with id ${detail.orderId} not found`
                });
            }

            // Add customername to the detail
            detail.customername = order.customername;
        }

        // Create order details 
        const orderdetails = await OrderDetails.bulkCreate(orderDetailsData);

        return res.status(200).json({
            success: true,
            message: 'Order details added successfully',
            orderdetails
        });
    } catch (error) {
        console.log(error);
        return false;
    }
}

const orderdetails_view = async (req, res) => {
    try {
        // const cutomername = req.customername
        const orderId = req.body.orderId;

        const order_details_view = await OrderDetails.findAll({ where: { orderId: orderId } });

        return res.status(200).json({
            success: true,
            message: 'view sucessfully',
            totalItem: order_details_view.length,
            // cutomername,
            order_details_view,
        })
    } catch (error) {
        console.log(error);
        return false;
    }
}

const deleteorder_detail = async (req, res) => {
    try {
        const orderDetailId = req.body.orderdetailID;

        const orderDetailToDelete = await OrderDetails.findByPk(orderDetailId);

        if (!orderDetailToDelete) {
            return res.status(400).json({
                success: false,
                message: 'Order detail not found'
            });
        }

        const duplicateData = {
            itemname: orderDetailToDelete.itemname,
            price: orderDetailToDelete.price,
            orderId: orderDetailToDelete.orderId,
            orderDetailId: orderDetailToDelete.id,
            customername: orderDetailToDelete.customername
        };

        //duplicate add
        await DuplicateOrderDetails.create(duplicateData);

        await orderDetailToDelete.destroy();

        return res.status(200).json({
            success: true,
            message: 'Order detail deleted and duplicated successfully.'
        });
    } catch (error) {
        console.log(error);
        return false;
    }
}

const update_details = async (req, res) => {
    try {
        let orderDetailsData = req.body.orderdetails;
        // console.log(orderDetailsData);
        // Parse orderdetails if it's a JSON string
        if (typeof orderDetailsData === 'string') {
            orderDetailsData = JSON.parse(orderDetailsData)
        }
        // console.log(orderDetailsData);

        // // Check if orderDetailsData is an array
        if (!Array.isArray(orderDetailsData)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data format: orderdetails should be an array of objects'
            });
        }
        // console.log(orderDetailsData);

        const duplicateData = [];
        for (const detail of orderDetailsData) {
            if (!detail.itemname || !detail.price || !detail.orderId || !detail.id) {
                return res.status(400).json({
                    success: false,
                    message: 'Each order detail must have itemname, price, orderId, and id'
                });
            }

            // Fetch the existing order detail using detail.id
            const existingOrderDetail = await OrderDetails.findByPk(detail.id);

            if (!existingOrderDetail) {
                return res.status(404).json({
                    success: false,
                    message: `Order detail with id ${detail.id} not found`
                });
            }

            // Add customername to the detail
            detail.customername = existingOrderDetail.customername;

            // Check if any of the fields to be updated are different
            if (
                existingOrderDetail.itemname !== detail.itemname ||
                existingOrderDetail.price !== detail.price ||
                existingOrderDetail.orderId !== detail.orderId ||
                existingOrderDetail.customername !== detail.customername
            ) {
                duplicateData.push({
                    itemname: existingOrderDetail.itemname,
                    price: existingOrderDetail.price,
                    orderId: existingOrderDetail.orderId,
                    orderDetailId: existingOrderDetail.id,
                    customername: existingOrderDetail.customername
                });
            }
        }

        // // Create duplicate 
        if (duplicateData.length > 0) {
            await DuplicateOrderDetails.bulkCreate(duplicateData);
        }
        console.log(duplicateData);

        // // Update order details
        await OrderDetails.bulkCreate(orderDetailsData, {
            updateOnDuplicate: ['itemname', 'price', 'customername', 'orderId']
        });
        // console.log(orderDetailsData);


        return res.status(200).json({
            success: true,
            message: 'Order details updated and duplicated successfully'
        });
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    order_detail, orderdetails_view, deleteorder_detail, update_details
}