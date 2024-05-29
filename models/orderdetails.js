module.exports = (sequelize, DataTypes) => {
    const OrderDetails = sequelize.define('orderdetails', {
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
        customername: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
        {
            timestamps: false,
        }
    );

    return OrderDetails
}      