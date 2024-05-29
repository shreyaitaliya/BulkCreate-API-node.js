const { DataTypes } = require("sequelize");
const db = require("../config/db");
const sequelize = db.sequelize;

const ordermodel = require('../models/order')(sequelize, DataTypes);
const OrderDetails = require('../models/orderdetails')(sequelize, DataTypes);
const duplicateordermodel = require("../models/duplicateordermodel")(sequelize, DataTypes);
const duplicateorderdetails = require('../models/duplicateorderdetails')(sequelize, DataTypes);

const order_add = async (req, res) => {
    try {
        const orderadd = await ordermodel.create({
            customername: req.body.customername,
        });
        return res.status(200).json({
            success: true,
            message: 'Added successfully',
            orderadd,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while adding the order',
        });
    }
};

// const delete_order = async (req, res) => {
//     try {
//         const orderId = req.body.orderId;

//         // Find the order to delete
//         const orderToDelete = await ordermodel.findByPk(orderId);
//         if (!orderToDelete) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Order not found'
//             });
//         }

//         // Move the order to duplicateordermodel
//         await duplicateordermodel.create({
//             customername: orderToDelete.customername,
//             orderId: orderToDelete.id
//         });

//         // Find related order details
//         const orderDetailsToDelete = await OrderDetails.findAll({ where: { orderId: orderId } });
//         if (orderDetailsToDelete.length > 0) {
//             // Prepare data for bulk create in duplicateorderdetails
//             const duplicateOrderDetailsData = orderDetailsToDelete.map(detail => ({
//                 itemname: detail.itemname,
//                 price: detail.price,
//                 orderId: detail.orderId,
//                 orderDetailId: detail.id,
//                 customername: detail.customername
//             }));

//             // Bulk create duplicate order details
//             if (duplicateOrderDetailsData.length > 0) {
//                 await duplicateorderdetails.bulkCreate(duplicateOrderDetailsData);
//             }

//             // Delete original order details
//             await OrderDetails.destroy({ where: { orderId } });
//         }

//         // Delete the order from ordermodel
//         await ordermodel.destroy({
//             where: {
//                 id: orderId,
//                 customername: orderToDelete.customername  // Additional condition
//             }
//         });

//         return res.status(200).json({
//             success: true,
//             message: 'Order deleted successfully and data moved to duplicates.'
//         });

//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }


const delete_order = async (req, res) => {
    try {
        const orderId = req.body.orderId;

        // Find the order to delete
        const orderToDelete = await ordermodel.findByPk(orderId);
        if (!orderToDelete) {
            return res.status(400).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Move the order to duplicateordermodel
        await duplicateordermodel.create({
            customername: orderToDelete.customername,
            orderId: orderToDelete.id,
        });

        // Find related order details
        const orderDetailsToDelete = await OrderDetails.findAll({ where: { orderId } });
        if (orderDetailsToDelete.length > 0) {
            // Prepare data for bulk create in duplicateorderdetails
            const duplicateOrderDetailsData = orderDetailsToDelete.map((detail) => ({
                itemname: detail.itemname,
                price: detail.price,
                orderId: detail.orderId,
                orderDetailId: detail.id,
                customername: detail.customername,
            }));

            // Bulk create duplicate order details
            if (duplicateOrderDetailsData.length > 0) {
                await duplicateorderdetails.bulkCreate(duplicateOrderDetailsData);
            }

            // Delete original order details
            await OrderDetails.destroy({ where: { orderId } });
        }

        // Delete the order from ordermodel
        await ordermodel.destroy({
            where: {
                id: orderId,
                customername: orderToDelete.customername, // Additional condition
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Order deleted successfully and data moved to duplicates.',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the order',
        });
    }
};




const update_order = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const customername = req.body.customername;

        // Find the order to update
        const orderToUpdate = await ordermodel.findByPk(orderId);
        if (!orderToUpdate) {
            return res.status(400).send({
                success: false,
                message: 'Order with specified ID not found',
            });
        }

        // Move the order to duplicateordermodel
        await duplicateordermodel.create({
            customername: orderToUpdate.customername,
            orderId: orderToUpdate.id
        });

        // Update the customer name of the order
        orderToUpdate.customername = customername;
        await orderToUpdate.save();

        // Find related order details
        const orderDetailsToUpdate = await OrderDetails.findAll({ where: { orderId: orderId } });
        if (orderDetailsToUpdate.length > 0) {
            const duplicateOrderDetailsData = orderDetailsToUpdate.map(detail => ({
                itemname: detail.itemname,
                price: detail.price,
                orderId: detail.orderId,
                orderDetailId: detail.id,
                customername: detail.customername
            }));

            // Bulk create duplicate order details
            if (duplicateOrderDetailsData.length > 0) {
                await duplicateorderdetails.bulkCreate(duplicateOrderDetailsData);
            }

            // Save the order detail
            for (const orderDetail of orderDetailsToUpdate) {
                orderDetail.customername = customername;
                await orderDetail.save();
            }
        }

        return res.status(200).send({
            success: true,
            message: 'Order updated successfully and data moved to duplicates.',
            updatedOrder: orderToUpdate
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating the order',
        });
    }
}





module.exports = {
    order_add, delete_order, update_order
};
