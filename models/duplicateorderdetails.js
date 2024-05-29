module.exports = (sequelize, DataTypes) => {
    const duplicateorderdetails = sequelize.define('duplicate_order_details', {
        itemname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        orderDetailId: {      
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        customername: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    return duplicateorderdetails;
};
